import AppShell from "@/layout/AppShell";
import PageHeader from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMembers } from "@/store/slices/membersSlice";
import { toast } from "sonner";

export default function TeamPage() {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.user?.role);
  const members = useAppSelector((state) => state.members.items);
  const status = useAppSelector((state) => state.members.status);

  useEffect(() => {
    dispatch(fetchMembers());
  }, [dispatch]);

  return (
    <AppShell>
      <PageHeader
        title="Team"
        description="Review teammate workloads and contact details."
        actions={
          role === "ADMIN"
            ? [{ label: "Invite member", onClick: () => toast.info("Invite member coming soon") }]
            : undefined
        }
      />
      {status === "loading" ? (
        <section className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-5 w-2/3 rounded bg-muted" />
                  <div className="h-4 w-1/2 rounded bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      ) : members.length === 0 ? (
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">No team members found.</p>
            </CardContent>
          </Card>
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {members.map((member) => (
            <Card key={member._id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                  <Badge variant={member.role === "ADMIN" ? "default" : "secondary"}>
                    {member.role}
                  </Badge>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  {(member.skills ?? []).length > 0 ? member.skills?.join(" · ") : "No skills set"}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </AppShell>
  );
}
