import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  CreateTaskSchema,
  UpdateTaskSchema,
  type CreateTaskInput,
  type UpdateTaskInput,
} from "@/shared/validations/task.zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createTaskItem, updateTaskItem } from "@/store/slices/tasksSlice";
import { fetchProjects } from "@/store/slices/projectsSlice";
import { fetchMembers } from "@/store/slices/membersSlice";

const statusOptions = ["Pending", "Progress", "Review", "Complete"] as const;
const priorityOptions = ["High", "Moderate", "Low"] as const;

type TaskFormValues = CreateTaskInput & UpdateTaskInput;

interface TaskEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  task?: {
    _id: string;
    title: string;
    description?: string;
    projectid: { _id: string; title: string } | string;
    assignedTo?: { _id: string; firstName: string; lastName: string; email: string };
    status: "Pending" | "Progress" | "Review" | "Complete";
    priority: "High" | "Moderate" | "Low";
    dueDate: string;
  };
  defaultProjectId?: string;
}

function toDateInput(value?: string) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
}

export function TaskEditorDialog({
  open,
  onOpenChange,
  mode,
  task,
  defaultProjectId,
}: TaskEditorDialogProps) {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.projects.items);
  const members = useAppSelector((state) => state.members.items);

  const resolver = zodResolver(CreateTaskSchema);

  const defaultValues = useMemo<TaskFormValues>(() => {
    if (mode === "edit" && task) {
      return {
        title: task.title,
        description: task.description ?? "",
        projectId: typeof task.projectid === "string" ? task.projectid : task.projectid._id,
        assignedTo: task.assignedTo?._id ?? "",
        status: task.status,
        priority: task.priority,
        dueDate: toDateInput(task.dueDate),
      };
    }
    return {
      title: "",
      description: "",
      projectId: defaultProjectId ?? "",
      assignedTo: "",
      status: "Pending",
      priority: "Moderate",
      dueDate: "",
    };
  }, [defaultProjectId, mode, task]);

  const form = useForm<TaskFormValues>({
    resolver,
    defaultValues,
  });

  useEffect(() => {
    if (!open) return;
    dispatch(fetchProjects(undefined));
    dispatch(fetchMembers());
    form.reset(defaultValues);
  }, [dispatch, form, open, defaultValues]);

  const onSubmit = form.handleSubmit(async (values) => {
    if (mode === "create") {
      const result = await dispatch(
        createTaskItem({
          title: values.title,
          description: values.description || undefined,
          projectId: values.projectId,
          status: values.status,
          priority: values.priority,
          dueDate: values.dueDate,
          assignedTo: values.assignedTo || undefined,
        })
      );
      if (createTaskItem.fulfilled.match(result)) {
        toast.success("Task created");
        onOpenChange(false);
        form.reset();
      } else {
        toast.error(result.payload as string);
      }
      return;
    }

    if (!task) return;

    const result = await dispatch(
      updateTaskItem({
        id: task._id,
        title: values.title,
        description: values.description || undefined,
        status: values.status,
        priority: values.priority,
        dueDate: values.dueDate,
      })
    );

    if (updateTaskItem.fulfilled.match(result)) {
      toast.success("Task updated");
      onOpenChange(false);
    } else {
      toast.error(result.payload as string);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-[#2d214d] bg-[#1f1633] text-white">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold uppercase tracking-[0.2px]">
            {mode === "create" ? "Create task" : "Edit task"}
          </DialogTitle>
        </DialogHeader>

        <form className="grid gap-4" onSubmit={onSubmit}>
          <div>
            <label className="text-xs uppercase tracking-[0.2px] text-[#c8b9e6]">Title</label>
            <input
              {...form.register("title")}
              className="mt-2 w-full rounded-lg border border-[#2d214d] bg-[#150f23] px-3 py-2 text-sm text-white shadow-[inset_0_1px_0_rgba(0,0,0,0.4)] focus:border-[#6b4aa5] focus:outline-none focus:ring-2 focus:ring-[#6b4aa5]"
              placeholder="Task title"
            />
            {form.formState.errors.title?.message && (
              <p className="mt-1 text-xs text-[#f0b4c4]">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.2px] text-[#c8b9e6]">Description</label>
            <textarea
              {...form.register("description")}
              className="mt-2 min-h-[90px] w-full rounded-lg border border-[#2d214d] bg-[#150f23] px-3 py-2 text-sm text-white shadow-[inset_0_1px_0_rgba(0,0,0,0.4)] focus:border-[#6b4aa5] focus:outline-none focus:ring-2 focus:ring-[#6b4aa5]"
              placeholder="What needs to be done?"
            />
          </div>

          {mode === "create" ? (
            <div>
              <label className="text-xs uppercase tracking-[0.2px] text-[#c8b9e6]">Project</label>
              <select
                {...form.register("projectId")}
                className="mt-2 w-full rounded-lg border border-[#2d214d] bg-[#150f23] px-3 py-2 text-sm text-white shadow-[inset_0_1px_0_rgba(0,0,0,0.4)] focus:border-[#6b4aa5] focus:outline-none focus:ring-2 focus:ring-[#6b4aa5]"
              >
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.title}
                  </option>
                ))}
              </select>
              {form.formState.errors.projectId?.message && (
                <p className="mt-1 text-xs text-[#f0b4c4]">
                  {form.formState.errors.projectId.message}
                </p>
              )}
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.2px] text-[#c8b9e6]">Assignee</label>
              <select
                {...form.register("assignedTo")}
                className="mt-2 w-full rounded-lg border border-[#2d214d] bg-[#150f23] px-3 py-2 text-sm text-white shadow-[inset_0_1px_0_rgba(0,0,0,0.4)] focus:border-[#6b4aa5] focus:outline-none focus:ring-2 focus:ring-[#6b4aa5]"
              >
                <option value="">Unassigned</option>
                {members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.firstName} {member.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.2px] text-[#c8b9e6]">Priority</label>
              <select
                {...form.register("priority")}
                className="mt-2 w-full rounded-lg border border-[#2d214d] bg-[#150f23] px-3 py-2 text-sm text-white shadow-[inset_0_1px_0_rgba(0,0,0,0.4)] focus:border-[#6b4aa5] focus:outline-none focus:ring-2 focus:ring-[#6b4aa5]"
              >
                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.2px] text-[#c8b9e6]">Status</label>
              <select
                {...form.register("status")}
                className="mt-2 w-full rounded-lg border border-[#2d214d] bg-[#150f23] px-3 py-2 text-sm text-white shadow-[inset_0_1px_0_rgba(0,0,0,0.4)] focus:border-[#6b4aa5] focus:outline-none focus:ring-2 focus:ring-[#6b4aa5]"
              >
                {statusOptions.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.2px] text-[#c8b9e6]">Due date</label>
              <input
                type="date"
                {...form.register("dueDate")}
                className="mt-2 w-full rounded-lg border border-[#2d214d] bg-[#150f23] px-3 py-2 text-sm text-white shadow-[inset_0_1px_0_rgba(0,0,0,0.4)] focus:border-[#6b4aa5] focus:outline-none focus:ring-2 focus:ring-[#6b4aa5]"
              />
              {form.formState.errors.dueDate?.message && (
                <p className="mt-1 text-xs text-[#f0b4c4]">
                  {form.formState.errors.dueDate.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="border-t border-[#2d214d] bg-[#150f23]">
            <button
              type="button"
              className="rounded-lg border border-[#2d214d] bg-[#150f23] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2px] text-white shadow-inset-btn transition duration-200 hover:border-[#5c4496]"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg border border-[#3a2a60] bg-[#1f1633] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2px] text-white shadow-inset-btn transition duration-200 hover:border-[#5c4496]"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Saving..." : "Save"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
