import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProjects } from "@/store/slices/projectsSlice";
import { createGroupConversation } from "@/api/endpoints/conversations";
import { createCallSession } from "@/api/endpoints/calls";
import { toast } from "sonner";

export default function StartCallDialog({ label }: { label: string }) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"voice" | "video">("voice");
  const [loading, setLoading] = useState(false);
  const projects = useAppSelector((state) => state.projects.items);

  useEffect(() => {
    if (open) dispatch(fetchProjects());
  }, [dispatch, open]);

  const submit = async () => {
    if (!projectId || !title) {
      toast.error("Please enter a title and select a project");
      return;
    }
    setLoading(true);
    try {
      const { data } = await createGroupConversation({ title, projectId, memberIds: [] });
      const conversationId = data?.data?._id as string | undefined;
      if (!conversationId) {
        toast.error("Failed to create conversation");
        return;
      }
      await createCallSession({ conversationId, type });
      toast.success("Call room created");
      setOpen(false);
    } catch {
      toast.error("Failed to start call");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{label}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start call</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <Input placeholder="Call title" value={title} onChange={(e) => setTitle(e.target.value)} />
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
            value={type}
            onChange={(e) => setType(e.target.value as "voice" | "video")}
          >
            <option value="voice">Voice</option>
            <option value="video">Video</option>
          </select>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={loading}>
            {loading ? "Starting..." : "Start"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
