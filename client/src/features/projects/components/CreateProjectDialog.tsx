import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@shared/hooks/redux";
import { Button, Input, Modal } from "@shared/ui";
import { createProjectItem } from "@/store/slices/projectsSlice";
import { toast } from "sonner";

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId?: string;
}

export function CreateProjectDialog({
  isOpen,
  onClose,
  workspaceId,
}: CreateProjectDialogProps) {
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.projects.error);
  const status = useAppSelector((state) => state.projects.status);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) return;
    const result = await dispatch(
      createProjectItem({
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        workspaceId,
      })
    );
    if (createProjectItem.fulfilled.match(result)) {
      toast.success("Project created successfully.");
      setFormData({ title: "", description: "", dueDate: "" });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({ title: "", description: "", dueDate: "" });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Project"
      actions={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={status === "loading"}>
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
          label="Project Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="My Project"
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
            placeholder="What's this project about?"
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] focus:outline-none focus:border-blue-500 focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.1),0_0_0_3px_rgba(59,130,246,0.1)] transition-all duration-200 resize-none"
            rows={3}
          />
        </div>
        <Input
          label="Due Date"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
        />
      </div>
    </Modal>
  );
}
