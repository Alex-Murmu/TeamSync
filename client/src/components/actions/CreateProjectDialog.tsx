import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearProjectError, createProjectItem, fetchProjects } from "@/store/slices/projectsSlice";
import { toast } from "sonner";
import { useEffect } from "react";

export default function CreateProjectDialog({ label }: { label: string }) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const projectError = useAppSelector((state) => state.projects.error);

  useEffect(() => {
    if (projectError && open) {
      toast.error(projectError);
      dispatch(clearProjectError());
    }
  }, [projectError, dispatch, open]);

  const submit = async () => {
    if (!title || !dueDate) return;
    const result = await dispatch(
      createProjectItem({ title, description: description || undefined, dueDate })
    );
    if (createProjectItem.fulfilled.match(result)) {
      await dispatch(fetchProjects());
      setOpen(false);
      setTitle("");
      setDescription("");
      setDueDate("");
      toast.success("Project created successfully");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{label}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <Input placeholder="Project title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <DialogFooter>
          <Button onClick={submit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
