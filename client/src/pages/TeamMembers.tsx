import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UsersIcon, MailIcon, BriefcaseIcon, CheckCircleIcon, ClockIcon } from "lucide-react"

interface TeamMember {
  _id: string
  name: string
  email: string
  role: string
  assignedTasks: Task[]
}

interface Task {
  _id: string
  title: string
  status: "todo" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  project: string
}

export default function TeamMembers() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/team", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data)
      }
    } catch (error) {
      console.error("Failed to fetch team members:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      "in-progress": "default",
      completed: "secondary",
      todo: "destructive",
    }
    return <Badge variant={variants[status] || "default"}>{status}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      high: "bg-red-500",
      medium: "bg-yellow-500",
      low: "bg-green-500",
    }
    return (
      <span className={`px-2 py-1 rounded text-white text-xs ${colors[priority] || "bg-gray-500"}`}>
        {priority}
      </span>
    )
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Team Members</h1>
        <p className="text-muted-foreground">Manage your team and view assigned tasks</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <Card key={member._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <UsersIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MailIcon className="h-4 w-4" />
                    {member.email}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline">{member.role}</Badge>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4" />
                    Assigned Tasks ({member.assignedTasks?.length || 0})
                  </h4>
                  {member.assignedTasks && member.assignedTasks.length > 0 ? (
                    <div className="space-y-2">
                      {member.assignedTasks.map((task) => (
                        <div key={task._id} className="border rounded p-3 space-y-2">
                          <div className="font-medium text-sm">{task.title}</div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {getStatusBadge(task.status)}
                            {getPriorityBadge(task.priority)}
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <ClockIcon className="h-3 w-3" />
                              {task.project}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No tasks assigned</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {teamMembers.length === 0 && !loading && (
        <div className="text-center py-12">
          <UsersIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No team members found</p>
        </div>
      )}
    </div>
  )
}
