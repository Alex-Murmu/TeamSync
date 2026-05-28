import { useState } from "react";
import { useParams } from "react-router-dom";
import { ProjectList } from "@features/projects/components/ProjectList";
import { CreateProjectDialog } from "@features/projects/components/CreateProjectDialog";
import { Button } from "@shared/ui";

export function ProjectsPage() {
  const { workspaceId } = useParams();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <Button
            variant="primary"
            onClick={() => setIsCreateOpen(true)}
          >
            New Project
          </Button>
        </div>
        <ProjectList workspaceId={workspaceId} />
      </div>
      <CreateProjectDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        workspaceId={workspaceId}
      />
    </div>
  );
}
