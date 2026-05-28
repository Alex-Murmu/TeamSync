import { useAppSelector, useAppDispatch } from "@shared/hooks/redux";
import { Skeleton } from "@shared/ui";
import { ProjectCard } from "./ProjectCard";
import { useEffect } from "react";
import { fetchProjects } from "@/store/slices/projectsSlice";

interface ProjectListProps {
  workspaceId?: string;
}

export function ProjectList({ workspaceId }: ProjectListProps) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.projects.items);
  const status = useAppSelector((state) => state.projects.status);

  useEffect(() => {
    dispatch(fetchProjects(workspaceId));
  }, [dispatch, workspaceId]);

  if (status === "loading" && items.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} height="h-28" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No projects yet</p>
        <p className="text-gray-500 text-sm mt-2">Create one to organize your work</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((project) => (
        <ProjectCard
          key={project._id}
          _id={project._id}
          name={project.title}
          description={project.description}
          status="active"
          membersCount={project.member?.length ?? 0}
          onClick={(projectId: string) => {}}
        />
      ))}
    </div>
  );
}
