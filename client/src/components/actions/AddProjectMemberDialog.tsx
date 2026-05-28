import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addProjectMemberItem, clearProjectError } from "@/store/slices/projectsSlice";
import { fetchMembers } from "@/store/slices/membersSlice";
import { toast } from "sonner";

interface AddProjectMemberDialogProps {
  projectId: string;
  existingMemberIds: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddProjectMemberDialog({
  projectId,
  existingMemberIds,
  open,
  onOpenChange,
}: AddProjectMemberDialogProps) {
  const dispatch = useAppDispatch();
  const [memberId, setMemberId] = useState("");
  const [loading, setLoading] = useState(false);
  const members = useAppSelector((state) => state.members.items);
  const projectError = useAppSelector((state) => state.projects.error);

  useEffect(() => {
    if (open) {
      dispatch(fetchMembers());
    }
  }, [dispatch, open]);

  useEffect(() => {
    if (projectError && open) {
      toast.error(projectError);
      dispatch(clearProjectError());
    }
  }, [dispatch, open, projectError]);

  const availableMembers = useMemo(
    () => members.filter((member) => !existingMemberIds.includes(member._id)),
    [existingMemberIds, members]
  );

  const submit = async () => {
    if (!memberId) {
      toast.error("Please select a member");
      return;
    }
    setLoading(true);
    const result = await dispatch(addProjectMemberItem({ id: projectId, memberId }));
    setLoading(false);

    if (addProjectMemberItem.fulfilled.match(result)) {
      toast.success("Member added successfully");
      setMemberId("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add member</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          >
            <option value="">Select member</option>
            {availableMembers.map((member) => (
              <option key={member._id} value={member._id}>
                {member.firstName} {member.lastName}
              </option>
            ))}
          </select>
          {availableMembers.length === 0 ? (
            <p className="text-xs text-muted-foreground">All available members are already in this project.</p>
          ) : null}
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={loading || availableMembers.length === 0}>
            {loading ? "Adding..." : "Add member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
