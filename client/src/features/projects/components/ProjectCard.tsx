import { Card, Badge } from "@shared/ui";

interface ProjectCardProps {
  _id: string;
  name: string;
  description?: string;
  status: string;
  membersCount: number;
  onClick: (id: string) => void;
}

const statusColors: Record<string, string> = {
  active: "success",
  archived: "warning",
  planning: "info",
};

export function ProjectCard({
  _id,
  name,
  description,
  status,
  membersCount,
  onClick,
}: ProjectCardProps) {
  return (
    <Card
      elevation="sm"
      onClick={() => onClick(_id)}
      className="p-4 cursor-pointer transition-all hover:shadow-[0_6px_12px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)]"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <Badge
          variant={statusColors[status.toLowerCase()] as any}
          size="sm"
          className="capitalize"
        >
          {status}
        </Badge>
      </div>
      {description && (
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{description}</p>
      )}
      <p className="text-gray-500 text-xs">{membersCount} members</p>
    </Card>
  );
}
