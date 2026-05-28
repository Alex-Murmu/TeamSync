import { useAppSelector, useAppDispatch } from "@shared/hooks/redux";
import { Skeleton } from "@shared/ui";
import { TaskCard } from "./TaskCard";
import { useEffect } from "react";
import { fetchTasks } from "@/store/slices/tasksSlice";

export function TaskList() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.tasks.items);
  const status = useAppSelector((state) => state.tasks.status);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (status === "loading" && items.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} height="h-32" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No tasks yet</p>
        <p className="text-gray-500 text-sm mt-2">Create one to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((task) => (
        <TaskCard
          key={task._id}
          _id={task._id}
          title={task.title}
          description={task.description}
          status={task.status}
          priority={task.priority}
          dueDate={task.dueDate}
          onClick={(taskId: string) => {}}
        />
      ))}
    </div>
  );
}
