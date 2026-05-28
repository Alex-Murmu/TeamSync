import AppShell from "@/layout/AppShell";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <AppShell>
      <PageHeader
        title="Settings"
        description="Customize workspace preferences and notifications."
      />
      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <div className="mt-4 space-y-4">
              {[
                "Task updates",
                "Project milestones",
                "Message mentions",
                "Weekly summary",
              ].map((item) => (
                <div key={item} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item}</p>
                    <p className="text-xs text-muted-foreground">Email + in-app</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">Workspace</h3>
            <div className="mt-4 space-y-4">
              {[
                "Show timeline previews",
                "Enable workload insights",
                "Allow member requests",
              ].map((item, index) => (
                <div key={item} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item}</p>
                    <p className="text-xs text-muted-foreground">Org level setting</p>
                  </div>
                  <Switch defaultChecked={index !== 2} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
