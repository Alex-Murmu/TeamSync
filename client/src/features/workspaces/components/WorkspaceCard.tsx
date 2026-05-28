import { Card, Badge } from "@shared/ui";
import type { WorkspaceMember } from "@shared/validations/workspace.zod";

interface WorkspaceCardProps {
  _id: string;
  name: string;
  description?: string;
  members: WorkspaceMember[];
  onClick: (id: string) => void;
}

export function WorkspaceCard({
  _id,
  name,
  description,
  members,
  onClick,
}: WorkspaceCardProps) {
  const membersCount = members.length;
  return (
    <Card
      elevation="sm"
      onClick={() => onClick(_id)}
      className="p-4 cursor-pointer transition-all hover:shadow-[0_6px_12px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)]"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <Badge variant="info" size="sm">
          {membersCount} member{membersCount !== 1 ? "s" : ""}
        </Badge>
      </div>
      {description && (
        <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
      )}
    </Card>
  );
}
