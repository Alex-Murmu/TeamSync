import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@shared/hooks/redux";
import { createWorkspace } from "../api/workspaceApi";
import { clearError } from "../slices/workspaceSlice";
import { Button, Input, Modal } from "@shared/ui";

interface CreateWorkspaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateWorkspaceDialog({ isOpen, onClose }: CreateWorkspaceDialogProps) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.workspace);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;
    dispatch(createWorkspace(formData)).then(() => {
      setFormData({ name: "", description: "" });
      onClose();
    });
  };

  const handleClose = () => {
    dispatch(clearError());
    setFormData({ name: "", description: "" });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Workspace"
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
          label="Workspace Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="My Workspace"
          autoFocus
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What's this workspace for?"
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] focus:outline-none focus:border-blue-500 focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.1),0_0_0_3px_rgba(59,130,246,0.1)] transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 resize-none"
            rows={3}
          />
        </div>
      </div>
    </Modal>
  );
}
