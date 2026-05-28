import AppShell from "@/layout/AppShell";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/store/hooks";

export default function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <AppShell>
      <PageHeader title="Profile" description="Manage your personal details." />
      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">Account</h3>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium">
                  {user ? `${user.firstName} ${user.lastName}` : ""}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <Badge variant="secondary">{user?.role}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">Preferences</h3>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-border/60 p-4">
                <p className="text-sm font-medium">Timezone</p>
                <p className="text-xs text-muted-foreground">UTC +1</p>
              </div>
              <div className="rounded-xl border border-border/60 p-4">
                <p className="text-sm font-medium">Working hours</p>
                <p className="text-xs text-muted-foreground">09:00 - 18:00</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
