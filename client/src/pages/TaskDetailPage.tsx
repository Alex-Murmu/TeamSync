import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AppShell from "@/layout/AppShell";
import PageHeader from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTask } from "@/store/slices/tasksSlice";
import { toast } from "sonner";
import { TaskEditorDialog } from "@/components/tasks/TaskEditorDialog";

export default function TaskDetailPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const task = useAppSelector((state) => state.tasks.active);
  const status = useAppSelector((state) => state.tasks.status);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (taskId) {
      dispatch(fetchTask(taskId));
    }
  }, [dispatch, taskId]);

  if (status === "loading" && !task) {
    return (
      <AppShell>
        <PageHeader title="Loading..." />
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-2/3 rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
            </div>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  if (!task) {
    return (
      <AppShell>
        <PageHeader title="Task not found" />
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">This task does not exist or you don't have access.</p>
            <Button className="mt-4" onClick={() => navigate("/tasks")}>Back to tasks</Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const assignee = task.assignedTo;

  return (
    <AppShell>
      <PageHeader
        title={task.title}
        description={task.description}
        actions={[
          { label: "Edit task", onClick: () => setIsEditOpen(true) },
        ]}
      />
      <TaskEditorDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        mode="edit"
        task={task}
      />
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">Task context</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              This task tracks delivery requirements, dependencies, and acceptance criteria.
            </p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-xl border border-border/60 p-4">
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant="secondary">{task.status}</Badge>
              </div>
              <div className="rounded-xl border border-border/60 p-4">
                <p className="text-xs text-muted-foreground">Priority</p>
                <Badge variant="outline">{task.priority}</Badge>
              </div>
              <div className="rounded-xl border border-border/60 p-4">
                <p className="text-xs text-muted-foreground">Due date</p>
                <p className="text-sm font-medium">{new Date(task.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">Assignee</h3>
            <div className="mt-4 rounded-xl border border-border/60 p-4">
              <p className="font-medium">
                {assignee ? `${assignee.firstName} ${assignee.lastName}` : "Unassigned"}
              </p>
              <p className="text-xs text-muted-foreground">{assignee?.email}</p>
            </div>
            <div className="mt-4 rounded-xl border border-dashed border-border/70 p-4 text-xs text-muted-foreground">
              Activity, comments, and files will appear here once API integration is wired.
            </div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
