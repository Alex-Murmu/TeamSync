import { useState } from "react";
import { useParams } from "react-router-dom";
import { TaskKanbanBoard } from "@/components/tasks/TaskKanbanBoard";
import { TaskEditorDialog } from "@/components/tasks/TaskEditorDialog";

export function TasksPage() {
  const { projectId } = useParams();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#150f23] p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2px] text-[#9c89c5]">Task board</p>
            <h1 className="text-3xl font-semibold text-white">Tasks</h1>
          </div>
          <button
            type="button"
            className="rounded-lg border border-[#3a2a60] bg-[#1f1633] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2px] text-white shadow-inset-btn transition duration-200 hover:border-[#5c4496]"
            onClick={() => setIsCreateOpen(true)}
          >
            New Task
          </button>
        </div>
        <TaskKanbanBoard />
      </div>
      <TaskEditorDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        mode="create"
        defaultProjectId={projectId}
      />
    </div>
  );
}
