import { useState } from "react";
import { WorkspaceList } from "@features/workspaces/components/WorkspaceList";
import { CreateWorkspaceDialog } from "@features/workspaces/components/CreateWorkspaceDialog";
import { WorkspaceMembersPanel } from "@features/workspaces/components/WorkspaceMembersPanel";

export function WorkspacesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#150f23] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2px] text-[#9c89c5]">Workspace hub</p>
            <h1 className="text-3xl font-semibold text-white">Workspaces</h1>
          </div>
          <button
            type="button"
            className="rounded-lg border border-[#3a2a60] bg-[#1f1633] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2px] text-white shadow-inset-btn transition duration-200 hover:border-[#5c4496]"
            onClick={() => setIsCreateOpen(true)}
          >
            New Workspace
          </button>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-xl border border-[#2d214d] bg-[#1f1633] p-6">
            <WorkspaceList />
          </div>
          <WorkspaceMembersPanel />
        </div>
      </div>
      <CreateWorkspaceDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
