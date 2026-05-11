import { useState, useEffect, useCallback } from "react"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TaskCard } from "@/components/TaskCard"
import { TaskCreateDialog } from "@/components/TaskCreateDialog"
import { GripVerticalIcon, PlusIcon } from "lucide-react"
import { toast } from "sonner"

interface Task {
  _id: string
  title: string
  description?: string
  status: "todo" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  assignedTo?: { _id: string; name: string }
  project?: { _id: string; name: string }
}

const COLUMNS = [
  { id: "todo", title: "To Do", color: "bg-slate-100 border-slate-300" },
  { id: "in-progress", title: "In Progress", color: "bg-blue-50 border-blue-300" },
  { id: "completed", title: "Completed", color: "bg-green-50 border-green-300" },
]

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
      toast.error("Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t._id === event.active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as Task["status"]

    // Find the task
    const task = tasks.find((t) => t._id === taskId)
    if (!task || task.status === newStatus) return

    // Optimistically update UI
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    )

    // Update on server
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update task")
      }

      toast.success("Task moved successfully")
    } catch (error) {
      // Revert on error
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: task.status } : t))
      )
      toast.error("Failed to move task")
    }
  }

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status)
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: "bg-red-500",
      medium: "bg-yellow-500",
      low: "bg-green-500",
    }
    return colors[priority] || "bg-gray-500"
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading tasks...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Kanban Board</h2>
          <p className="text-muted-foreground">Drag and drop tasks to update their status</p>
        </div>
        <TaskCreateDialog>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 cursor-pointer">
            <PlusIcon className="h-4 w-4" />
            Add Task
          </button>
        </TaskCreateDialog>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map((column) => (
            <div
              key={column.id}
              className={`rounded-lg border-2 ${column.color} p-4`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{column.title}</h3>
                <Badge variant="secondary">{getTasksByStatus(column.id).length}</Badge>
              </div>

              <SortableContext
                items={getTasksByStatus(column.id).map((t) => t._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3 min-h-[200px]">
                  {getTasksByStatus(column.id).map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      getPriorityColor={getPriorityColor}
                    />
                  ))}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <Card className="w-full opacity-90 shadow-lg">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start gap-2">
                  <GripVerticalIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <CardTitle className="text-base">{activeTask.title}</CardTitle>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${getPriorityColor(activeTask.priority)}`}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {activeTask.assignedTo && (
                  <p className="text-sm text-muted-foreground">
                    Assigned to: {activeTask.assignedTo.name}
                  </p>
                )}
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
