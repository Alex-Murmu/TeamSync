import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@shared/hooks/redux";
import { clearError } from "../slices/chatSlice";
import { createDirectConversation } from "../api/chatApi";
import { Button, Input, Modal } from "@shared/ui";
import { toast } from "sonner";

interface CreateConversationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateConversationDialog({
  isOpen,
  onClose,
}: CreateConversationDialogProps) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.chat);
  const [participantEmail, setParticipantEmail] = useState("");

  const handleSubmit = async () => {
    if (!participantEmail.trim()) return;
    const result = await dispatch(
      createDirectConversation({ participantEmail })
    );
    if (createDirectConversation.fulfilled.match(result)) {
      toast.success("Conversation started");
      setParticipantEmail("");
      onClose();
    }
  };

  const handleClose = () => {
    dispatch(clearError());
    setParticipantEmail("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Start Conversation"
      actions={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>
            Create
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        <Input
          label="Participant Email"
          type="email"
          value={participantEmail}
          onChange={(e) => setParticipantEmail(e.target.value)}
          placeholder="user@example.com"
          autoFocus
        />
      </div>
    </Modal>
  );
}
