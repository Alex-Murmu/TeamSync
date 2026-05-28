import { useAppSelector, useAppDispatch } from "@shared/hooks/redux";
import { Workspace } from "@shared/validations/workspace.zod";
import { getWorkspaces, getWorkspaceById } from "../api/workspaceApi";
import { Skeleton } from "@shared/ui";
import { WorkspaceCard } from "./WorkspaceCard";
import { useEffect } from "react";
import { toast } from "sonner";

export function WorkspaceList() {
  const dispatch = useAppDispatch();
  const { workspaces, isLoading, error } = useAppSelector((state) => state.workspace);

  useEffect(() => {
    dispatch(getWorkspaces()).catch(() => {});
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSelectWorkspace = (workspace: Workspace) => {
    dispatch(getWorkspaceById(workspace._id)).catch(() => {});
  };

  if (isLoading && workspaces.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} height="h-24" />
        ))}
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No workspaces yet</p>
        <p className="text-gray-500 text-sm mt-2">Create one to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {workspaces.map((workspace) => (
        <WorkspaceCard
          key={workspace._id}
          {...workspace}
          members={workspace.members}
          onClick={() => handleSelectWorkspace(workspace)}
        />
      ))}
    </div>
  );
}
