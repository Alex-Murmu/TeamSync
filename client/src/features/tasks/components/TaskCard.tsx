import { Card, Badge } from "@shared/ui";

interface TaskCardProps {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assignedTo?: { name: string };
  dueDate?: string;
  onClick: (id: string) => void;
}

const priorityColors: Record<string, string> = {
  low: "info",
  moderate: "warning",
  high: "danger",
};

const statusColors: Record<string, string> = {
  pending: "default",
  progress: "info",
  review: "warning",
  complete: "success",
};

export function TaskCard({
  _id,
  title,
  description,
  status,
  priority,
  assignedTo,
  dueDate,
  onClick,
}: TaskCardProps) {
  const statusKey = status.toLowerCase();
  const priorityKey = priority.toLowerCase();

  return (
    <Card
      elevation="sm"
      onClick={() => onClick(_id)}
      className="p-4 cursor-pointer transition-all hover:shadow-[0_6px_12px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)]"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-base font-semibold text-gray-900 flex-1">{title}</h3>
        <Badge
          variant={priorityColors[priorityKey] as any}
          size="sm"
          className="ml-2 capitalize"
        >
          {priority}
        </Badge>
      </div>

      {description && (
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{description}</p>
      )}

      <div className="flex items-center justify-between">
        <Badge variant={statusColors[statusKey] as any} size="sm" className="capitalize">
          {status}
        </Badge>
        {assignedTo && (
          <span className="text-xs text-gray-500">{assignedTo.name}</span>
        )}
      </div>

      {dueDate && (
        <p className="text-xs text-gray-400 mt-2">Due: {new Date(dueDate).toLocaleDateString()}</p>
      )}
    </Card>
  );
}
