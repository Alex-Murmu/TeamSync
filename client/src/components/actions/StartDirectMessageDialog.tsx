import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProjects } from "@/store/slices/projectsSlice";
import { createDirectConversation } from "@/api/endpoints/conversations";
import { fetchMembers } from "@/store/slices/membersSlice";
import { toast } from "sonner";

export default function StartDirectMessageDialog({ label }: { label: string }) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [loading, setLoading] = useState(false);
  const projects = useAppSelector((state) => state.projects.items);
  const members = useAppSelector((state) => state.members.items);

  useEffect(() => {
    if (open) {
      dispatch(fetchProjects(undefined));
      dispatch(fetchMembers());
    }
  }, [dispatch, open]);

  const submit = async () => {
    if (!projectId || !memberId) {
      toast.error("Please select both a project and a member");
      return;
    }
    setLoading(true);
    try {
      await createDirectConversation({ participantId: memberId, projectId });
      toast.success("Direct message started");
      setOpen(false);
    } catch {
      toast.error("Failed to start direct message");
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
          <DialogTitle>Start direct message</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
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
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          >
            <option value="">Select member</option>
            {members.map((member) => (
              <option key={member._id} value={member._id}>
                {member.firstName} {member.lastName}
              </option>
            ))}
          </select>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={loading}>
            {loading ? "Starting..." : "Start DM"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
