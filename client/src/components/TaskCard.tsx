import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GripVerticalIcon } from "lucide-react"

interface TaskCardProps {
  task: {
    _id: string
    title: string
    description?: string
    priority: "low" | "medium" | "high"
    assignedTo?: { _id: string; name: string }
    project?: { _id: string; name: string }
  }
  getPriorityColor: (priority: string) => string
}

export function TaskCard({ task, getPriorityColor }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: {
      type: "task",
      task,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start gap-2">
            <GripVerticalIcon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base leading-tight">{task.title}</CardTitle>
            </div>
            <div
              className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${getPriorityColor(task.priority)}`}
              title={`Priority: ${task.priority}`}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-2">
          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs capitalize">
              {task.priority}
            </Badge>

            {task.assignedTo && (
              <Badge variant="secondary" className="text-xs">
                {task.assignedTo.name}
              </Badge>
            )}
          </div>

          {task.project && (
            <p className="text-xs text-muted-foreground">
              Project: {task.project.name}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
