import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createCallSession } from "../api/callApi";
import { clearError } from "../slices/callSlice";
import { Button, Modal } from "@/shared/ui";

interface StartCallDialogProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId?: string;
}

export function StartCallDialog({
  isOpen,
  onClose,
  conversationId,
}: StartCallDialogProps) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.call);
  const [participantIds, setParticipantIds] = useState<string[]>([]);

  const handleSubmit = async () => {
    dispatch(
      createCallSession({
        conversationId: conversationId || "",
        type: "voice",
      })
    ).then(() => {
      setParticipantIds([]);
      onClose();
    });
  };

  const handleClose = () => {
    dispatch(clearError());
    setParticipantIds([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Start Call"
      actions={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>
            Start Call
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
        <p className="text-sm text-gray-600">
          {conversationId
            ? "Starting a call in this conversation"
            : "Enter participant IDs to start a call"}
        </p>
      </div>
    </Modal>
  );
}
