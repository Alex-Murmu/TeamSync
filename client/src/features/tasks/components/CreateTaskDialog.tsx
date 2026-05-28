import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@shared/hooks/redux";
import { Button, Input, Modal } from "@shared/ui";
import { createTaskItem } from "@/store/slices/tasksSlice";
import { toast } from "sonner";

interface CreateTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
}

export function CreateTaskDialog({
  isOpen,
  onClose,
  projectId,
}: CreateTaskDialogProps) {
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.tasks.error);
  const status = useAppSelector((state) => state.tasks.status);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Moderate" as "High" | "Moderate" | "Low",
    status: "Pending" as "Pending" | "Progress" | "Review" | "Complete",
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
      createTaskItem({
        title: formData.title,
        description: formData.description,
        projectId: projectId || "",
        priority: formData.priority,
        dueDate: formData.dueDate,
        status: formData.status,
      })
    );
    if (createTaskItem.fulfilled.match(result)) {
      toast.success("Task created successfully.");
      setFormData({
        title: "",
        description: "",
        priority: "Moderate",
        status: "Pending",
        dueDate: "",
      });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      priority: "Moderate",
      status: "Pending",
      dueDate: "",
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Task"
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
          label="Task Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="My Task"
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
            placeholder="Task details..."
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] focus:outline-none focus:border-blue-500 focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.1),0_0_0_3px_rgba(59,130,246,0.1)] transition-all duration-200 resize-none"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] focus:outline-none focus:border-blue-500 focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.1),0_0_0_3px_rgba(59,130,246,0.1)] transition-all duration-200"
            >
              <option value="Low">Low</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] focus:outline-none focus:border-blue-500 focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.1),0_0_0_3px_rgba(59,130,246,0.1)] transition-all duration-200"
            >
              <option value="Pending">Pending</option>
              <option value="Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Complete">Complete</option>
            </select>
          </div>
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
