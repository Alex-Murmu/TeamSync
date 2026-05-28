import AppShell from "@/layout/AppShell";
import PageHeader from "@/components/common/PageHeader";
import CreateProjectDialog from "@/components/actions/CreateProjectDialog";
import { TaskEditorDialog } from "@/components/tasks/TaskEditorDialog";
import StartDirectMessageDialog from "@/components/actions/StartDirectMessageDialog";
import StartCallDialog from "@/components/actions/StartCallDialog";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProjects } from "@/store/slices/projectsSlice";
import { fetchTasks } from "@/store/slices/tasksSlice";
import { fetchMembers } from "@/store/slices/membersSlice";
import { useState } from "react";
import { toast } from "sonner";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const navigate = useNavigate();
  const role = useAppSelector((state) => state.auth.user?.role);
  const projects = useAppSelector((state) => state.projects.items);
  const tasks = useAppSelector((state) => state.tasks.items);
  const members = useAppSelector((state) => state.members.items);
  const projectsStatus = useAppSelector((state) => state.projects.status);
  const tasksStatus = useAppSelector((state) => state.tasks.status);
  const membersStatus = useAppSelector((state) => state.members.status);
  const projectsError = useAppSelector((state) => state.projects.error);
  const tasksError = useAppSelector((state) => state.tasks.error);
  const membersError = useAppSelector((state) => state.members.error);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks());
    dispatch(fetchMembers());
  }, [dispatch]);

  useEffect(() => {
    if (projectsError) toast.error(projectsError);
  }, [projectsError]);

  useEffect(() => {
    if (tasksError) toast.error(tasksError);
  }, [tasksError]);

  useEffect(() => {
    if (membersError) toast.error(membersError);
  }, [membersError]);

  const openTasks = tasks.filter((task) => task.status !== "Complete");
  const isLoading = projectsStatus === "loading" || tasksStatus === "loading" || membersStatus === "loading";

  return (
    <AppShell>
      <PageHeader
        title="Team overview"
        description="Monitor active projects, task health, and team focus in one view."
      />
      <div className="flex flex-wrap gap-3">
        <CreateProjectDialog label="New project" />
        <button
          type="button"
          className="rounded-lg border border-[#3a2a60] bg-[#1f1633] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2px] text-white shadow-inset-btn transition duration-200 hover:border-[#5c4496]"
          onClick={() => setIsTaskOpen(true)}
        >
          Create task
        </button>
        <StartDirectMessageDialog label="Start DM" />
        <StartCallDialog label="Start call" />
      </div>
      <TaskEditorDialog open={isTaskOpen} onOpenChange={setIsTaskOpen} mode="create" />
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Active projects", value: projects.length, to: "/projects" },
          { label: "Open tasks", value: openTasks.length, to: "/tasks" },
          { label: "Team members", value: members.length, to: "/team" },
        ].map((item) => (
          <Card
            key={item.label}
            className="cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md"
            onClick={() => navigate(item.to)}
          >
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold">
                {isLoading ? (
                  <span className="animate-pulse text-muted-foreground">...</span>
                ) : (
                  item.value
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Project health</h3>
              <Badge variant="secondary">Admin view</Badge>
            </div>
            <div className="mt-4 space-y-4">
              {isLoading ? (
                <p className="text-sm text-muted-foreground animate-pulse">Loading projects...</p>
              ) : projects.length === 0 ? (
                <p className="text-sm text-muted-foreground">No projects yet.</p>
              ) : (
                projects.map((project) => (
                  <div key={project._id} className="rounded-xl border border-border/60 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{project.title}</p>
                        <p className="text-xs text-muted-foreground">{project.description}</p>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">My focus</h3>
              <Badge variant="secondary">{role}</Badge>
            </div>
            <div className="mt-4 space-y-3">
              {isLoading ? (
                <p className="text-sm text-muted-foreground animate-pulse">Loading tasks...</p>
              ) : openTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No open tasks.</p>
              ) : (
                openTasks.slice(0, 4).map((task) => (
                  <div key={task._id} className="rounded-xl border border-border/60 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{task.title}</p>
                      <Badge variant="outline">{task.priority}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Due {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
              {role === "ADMIN" ? (
                <div className="rounded-xl border border-dashed border-border/80 p-4 text-sm text-muted-foreground">
                  Admins can assign tasks, update milestones, and adjust team capacity.
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border/80 p-4 text-sm text-muted-foreground">
                  Members see personal priorities and upcoming reviews here.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
