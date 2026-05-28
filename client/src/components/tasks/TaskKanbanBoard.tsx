import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTasks, updateTaskItem } from "@/store/slices/tasksSlice";

const columns = [
  { key: "Pending", label: "Todo" },
  { key: "Progress", label: "In Progress" },
  { key: "Review", label: "Review" },
  { key: "Complete", label: "Done" },
] as const;

const priorityTone: Record<string, string> = {
  High: "text-[#ffb4b4]",
  Moderate: "text-[#ffd58a]",
  Low: "text-[#9bd7b0]",
};

export function TaskKanbanBoard() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.items);
  const status = useAppSelector((state) => state.tasks.status);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof tasks>();
    columns.forEach((column) => map.set(column.key, []));
    tasks.forEach((task) => {
      const bucket = map.get(task.status) ?? map.get("Pending");
      bucket?.push(task);
    });
    return map;
  }, [tasks]);

  const handleStatusChange = async (taskId: string, nextStatus: typeof columns[number]["key"]) => {
    const result = await dispatch(updateTaskItem({ id: taskId, status: nextStatus }));
    if (updateTaskItem.fulfilled.match(result)) {
      toast.success("Task updated");
    } else if (updateTaskItem.rejected.match(result)) {
      toast.error(result.payload as string);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {columns.map((column) => {
        const items = grouped.get(column.key) ?? [];
        return (
          <section
            key={column.key}
            className="rounded-xl border border-[#2d214d] bg-[#1f1633] p-4 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2px] text-[#9c89c5]">{column.label}</p>
              <span className="rounded-full border border-[#2d214d] bg-[#150f23] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.2px] text-white">
                {items.length}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {status === "loading" && items.length === 0 ? (
                <div className="h-24 animate-pulse rounded-lg bg-[#2a1d44]" />
              ) : items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-[#2d214d] bg-[#150f23] p-4 text-xs uppercase tracking-[0.2px] text-[#c8b9e6]">
                  No tasks
                </div>
              ) : (
                items.map((task) => (
                  <article
                    key={task._id}
                    className="rounded-lg border border-[#2d214d] bg-[#150f23] p-4 shadow-[inset_0_1px_0_rgba(0,0,0,0.35)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-white">{task.title}</h3>
                      <span
                        className={`text-[11px] uppercase tracking-[0.2px] ${priorityTone[task.priority] ?? "text-white"}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    {task.description && (
                      <p className="mt-2 text-xs text-[#c8b9e6] line-clamp-2">{task.description}</p>
                    )}
                    <div className="mt-3 flex items-center justify-between text-xs text-[#c8b9e6]">
                      <span>
                        {task.assignedTo
                          ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}`
                          : "Unassigned"}
                      </span>
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-3">
                      <label className="text-[10px] uppercase tracking-[0.2px] text-[#9c89c5]">Status</label>
                      <select
                        className="mt-2 w-full rounded-lg border border-[#2d214d] bg-[#1f1633] px-2 py-2 text-xs text-white shadow-[inset_0_1px_0_rgba(0,0,0,0.4)] focus:border-[#6b4aa5] focus:outline-none focus:ring-2 focus:ring-[#6b4aa5]"
                        value={task.status}
                        onChange={(event) => handleStatusChange(task._id, event.target.value as typeof columns[number]["key"])}
                      >
                        {columns.map((option) => (
                          <option key={option.key} value={option.key}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
