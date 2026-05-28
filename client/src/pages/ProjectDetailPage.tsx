import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AppShell from "@/layout/AppShell";
import PageHeader from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProject, removeProjectMemberItem } from "@/store/slices/projectsSlice";
import { fetchTasks } from "@/store/slices/tasksSlice";
import AddProjectMemberDialog from "@/components/actions/AddProjectMemberDialog";
import { toast } from "sonner";
import { TaskEditorDialog } from "@/components/tasks/TaskEditorDialog";

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const project = useAppSelector((state) => state.projects.active);
  const tasks = useAppSelector((state) => state.tasks.items);
  const role = useAppSelector((state) => state.auth.user?.role);
  const status = useAppSelector((state) => state.projects.status);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProject(projectId));
      dispatch(fetchTasks());
    }
  }, [dispatch, projectId]);

  if (status === "loading" && !project) {
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

  if (!project) {
    return (
      <AppShell>
        <PageHeader title="Project not found" />
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">This project does not exist or you don't have access.</p>
            <Button className="mt-4" onClick={() => navigate("/projects")}>Back to projects</Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const projectTasks = tasks.filter((task) => {
    if (typeof task.projectid === "string") {
      return task.projectid === project._id;
    }
    return task.projectid?._id === project._id;
  });
  const members = project.member ?? [];
  const existingMemberIds = [
    project.admin?._id,
    ...members.map((member) => member._id),
  ].filter(Boolean) as string[];
  const dueDateLabel = new Date(project.dueDate).toLocaleDateString();
  const ownerLabel = project.admin
    ? `${project.admin.firstName} ${project.admin.lastName}`
    : "Unassigned";
  const statusCount = {
    pending: projectTasks.filter((task) => task.status === "Pending").length,
    progress: projectTasks.filter((task) => task.status === "Progress").length,
    review: projectTasks.filter((task) => task.status === "Review").length,
    complete: projectTasks.filter((task) => task.status === "Complete").length,
  };

  return (
    <AppShell>
      <PageHeader
        title={project.title}
        description={project.description}
        actions={
          role === "ADMIN"
            ? [
                { label: "Add member", onClick: () => setAddMemberOpen(true) },
                { label: "New task", onClick: () => setIsTaskOpen(true) },
              ]
            : undefined
        }
      />
      {role === "ADMIN" ? (
        <AddProjectMemberDialog
          projectId={project._id}
          existingMemberIds={existingMemberIds}
          open={addMemberOpen}
          onOpenChange={setAddMemberOpen}
        />
      ) : null}
      <TaskEditorDialog
        open={isTaskOpen}
        onOpenChange={setIsTaskOpen}
        mode="create"
        defaultProjectId={project._id}
      />
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Project details</h3>
              <Badge variant="secondary">Active</Badge>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/60 p-4">
                <p className="text-xs uppercase text-muted-foreground">Owner</p>
                <p className="mt-1 text-sm font-medium">{ownerLabel}</p>
              </div>
              <div className="rounded-xl border border-border/60 p-4">
                <p className="text-xs uppercase text-muted-foreground">Deadline</p>
                <p className="mt-1 text-sm font-medium">{dueDateLabel}</p>
              </div>
              <div className="rounded-xl border border-border/60 p-4">
                <p className="text-xs uppercase text-muted-foreground">Members</p>
                <p className="mt-1 text-sm font-medium">{members.length}</p>
              </div>
              <div className="rounded-xl border border-border/60 p-4">
                <p className="text-xs uppercase text-muted-foreground">Task status</p>
                <p className="mt-1 text-sm font-medium">
                  {statusCount.pending} pending · {statusCount.progress} in progress · {statusCount.review} review · {statusCount.complete} done
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Tasks</h3>
              <Badge variant="outline">{projectTasks.length}</Badge>
            </div>
            <div className="mt-4 grid gap-3">
              {projectTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tasks yet.</p>
              ) : (
                projectTasks.map((task) => (
                  <Link
                    key={task._id}
                    to={`/tasks/${task._id}`}
                    className="rounded-xl border border-border/60 p-4 transition hover:bg-muted/40"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{task.title}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{task.status}</Badge>
                        <Badge variant="secondary">{task.priority}</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{task.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        {task.assignedTo
                          ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}`
                          : "Unassigned"}
                      </span>
                      <span>·</span>
                      <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">Team members</h3>
            <div className="mt-4 space-y-3">
              {members.length === 0 ? (
                <p className="text-sm text-muted-foreground">No members yet.</p>
              ) : (
                members.map((member) => (
                  <div key={member._id} className="flex items-center justify-between rounded-xl border border-border/60 p-3">
                    <div>
                      <p className="text-sm font-medium">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Member</Badge>
                      {role === "ADMIN" ? (
                        <button
                          type="button"
                          className="rounded-md border border-[#4a1f2f] bg-[#2a0f1c] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.2px] text-white shadow-inset-btn transition duration-200 hover:border-[#7a2c44]"
                          onClick={async () => {
                            const result = await dispatch(
                              removeProjectMemberItem({ id: project._id, memberId: member._id })
                            );
                            if (removeProjectMemberItem.fulfilled.match(result)) {
                              toast.success("Member removed");
                            } else if (removeProjectMemberItem.rejected.match(result)) {
                              toast.error(result.payload as string);
                            }
                          }}
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
