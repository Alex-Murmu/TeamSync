import { useEffect, useState } from "react";
import AppShell from "@/layout/AppShell";
import PageHeader from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StartCallDialog from "@/components/actions/StartCallDialog";
import { listConversations } from "@/api/endpoints/conversations";
import { toast } from "sonner";

interface CallRoom {
  _id: string;
  name: string;
  status: "Live" | "Idle";
}

export default function CallsPage() {
  const [rooms, setRooms] = useState<CallRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listConversations()
      .then(({ data }) => {
        const convs = data?.data ?? [];
        setRooms(
          convs.map((c: any) => ({
            _id: c._id,
            name: c.title ?? "Group Call",
            status: "Idle" as const,
          }))
        );
      })
      .catch(() => toast.error("Failed to load call rooms"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <PageHeader
        title="Calls"
        description="Voice and video rooms for team collaboration."
      />
      <div className="flex flex-wrap gap-3">
        <StartCallDialog label="Create room" />
        <Button variant="secondary" onClick={() => toast.info("Schedule call coming soon")}>Schedule call</Button>
      </div>
      <section className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">Call rooms</h3>
            <div className="mt-4 space-y-3">
              {loading ? (
                <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
              ) : rooms.length === 0 ? (
                <p className="text-sm text-muted-foreground">No call rooms yet. Create one to start.</p>
              ) : (
                rooms.map((room) => (
                  <div key={room._id} className="rounded-xl border border-border/60 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{room.name}</p>
                      <Badge variant="secondary">{room.status}</Badge>
                    </div>
                    <Button
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => toast.info("Call functionality coming soon")}
                    >
                      Join
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex h-full flex-col p-6">
            {rooms.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{rooms[0].name}</h3>
                    <p className="text-xs text-muted-foreground">Voice + Video</p>
                  </div>
                  <Badge variant="default">Idle</Badge>
                </div>
                <div className="mt-4 flex flex-1 items-center justify-center rounded-xl border border-dashed border-border/70">
                  <p className="text-sm text-muted-foreground">
                    Join a call room to see participants and controls.
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="destructive" onClick={() => toast.info("Leave call coming soon")}>Leave</Button>
                  <Button variant="secondary" onClick={() => toast.info("Mute coming soon")}>Mute</Button>
                  <Button variant="secondary" onClick={() => toast.info("Camera coming soon")}>Camera</Button>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-muted-foreground">No active call rooms.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
