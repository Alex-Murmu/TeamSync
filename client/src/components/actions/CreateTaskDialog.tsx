import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearTaskError, createTaskItem, fetchTasks } from "@/store/slices/tasksSlice";
import { fetchProjects } from "@/store/slices/projectsSlice";
import { toast } from "sonner";

export default function CreateTaskDialog({ label }: { label: string }) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [priority, setPriority] = useState("Moderate");
  const [dueDate, setDueDate] = useState("");
  const projects = useAppSelector((state) => state.projects.items);
  const taskError = useAppSelector((state) => state.tasks.error);

  useEffect(() => {
    if (taskError && open) {
      toast.error(taskError);
      dispatch(clearTaskError());
    }
  }, [taskError, dispatch, open]);

  useEffect(() => {
    dispatch(fetchProjects(undefined));
  }, [dispatch]);

  const submit = async () => {
    if (!title || !projectId || !priority || !dueDate) return;
    const result = await dispatch(
      createTaskItem({
        title,
        description: description || undefined,
        projectId,
        priority: priority as "High" | "Moderate" | "Low",
        dueDate,
      })
    );
    if (createTaskItem.fulfilled.match(result)) {
      await dispatch(fetchTasks());
      setOpen(false);
      setTitle("");
      setDescription("");
      setProjectId("");
      setPriority("Moderate");
      setDueDate("");
      toast.success("Task created successfully");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{label}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <Input placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.title}
              </option>
            ))}
          </select>
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="High">High</option>
            <option value="Moderate">Moderate</option>
            <option value="Low">Low</option>
          </select>
          <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <DialogFooter>
          <Button onClick={submit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
