import { useEffect, useState } from "react";
import AppShell from "@/layout/AppShell";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StartDirectMessageDialog from "@/components/actions/StartDirectMessageDialog";
import { listConversations } from "@/api/endpoints/conversations";
import { useAppSelector } from "@/store/hooks";
import { toast } from "sonner";

interface Conversation {
  _id: string;
  type: "direct" | "group";
  title?: string;
  members: { _id: string; firstName: string; lastName: string; email: string }[];
  createdBy: { _id: string; firstName: string; lastName: string; email: string };
  lastMessageAt?: string;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    listConversations()
      .then(({ data }) => {
        setConversations(data?.data ?? []);
        if (data?.data?.length > 0) setActiveConv(data.data[0]);
      })
      .catch(() => toast.error("Failed to load conversations"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <PageHeader
        title="Messages"
        description="Team chat with conversations and direct messages."
      />
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => toast.info("New channel coming soon")}>New channel</Button>
        <StartDirectMessageDialog label="Start DM" />
      </div>
      <section className="grid gap-4 lg:grid-cols-[260px_1fr_260px]">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground">Conversations</h3>
              <Badge variant="secondary">{conversations.length}</Badge>
            </div>
            <div className="mt-4 space-y-2">
              {loading ? (
                <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
              ) : conversations.length === 0 ? (
                <p className="text-sm text-muted-foreground">No conversations yet.</p>
              ) : (
                conversations.map((conv) => {
                  const otherMembers = conv.members.filter((m) => m._id !== user?.id);
                  const displayName =
                    conv.type === "direct"
                      ? otherMembers.map((m) => `${m.firstName} ${m.lastName}`).join(", ")
                      : conv.title ?? "Group";
                  return (
                    <button
                      key={conv._id}
                      onClick={() => setActiveConv(conv)}
                      className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition hover:bg-muted ${
                        activeConv?._id === conv._id ? "border-primary bg-primary/10" : "border-border/60"
                      }`}
                    >
                      <span className="text-sm font-medium">{displayName}</span>
                      <Badge variant={conv.type === "direct" ? "secondary" : "default"}>
                        {conv.type}
                      </Badge>
                    </button>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex h-full flex-col p-6">
            {activeConv ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {activeConv.type === "direct"
                        ? activeConv.members
                            .filter((m) => m._id !== user?.id)
                            .map((m) => `${m.firstName} ${m.lastName}`)
                            .join(", ")
                        : activeConv.title ?? "Conversation"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {activeConv.members.length} participants
                    </p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="mt-4 flex-1 rounded-xl border border-border/60 p-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Messages will appear here. Select a conversation to start chatting.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-border/60 bg-background p-3">
                  <Input placeholder="Type a message..." />
                  <Button onClick={() => toast.info("Messaging coming soon")}>Send</Button>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-muted-foreground">Select a conversation to start chatting.</p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">Members</h3>
            <div className="mt-4 space-y-3">
              {activeConv ? (
                activeConv.members.map((member) => (
                  <div key={member._id} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium">{member.firstName} {member.lastName}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Select a conversation to see members.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
