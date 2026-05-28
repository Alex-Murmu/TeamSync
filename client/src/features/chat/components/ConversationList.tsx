import { useAppSelector, useAppDispatch } from "@shared/hooks/redux";
import { getConversations } from "../api/chatApi";
import { setCurrentConversation } from "../slices/chatSlice";
import { Card } from "@shared/ui";
import { useEffect } from "react";
import { toast } from "sonner";

export function ConversationList() {
  const dispatch = useAppDispatch();
  const { conversations, currentConversation, error } = useAppSelector((state) => state.chat);

  useEffect(() => {
    dispatch(getConversations()).catch(() => {});
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="h-full flex flex-col border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No conversations yet
          </div>
        ) : (
          conversations.map((conv) => (
            <Card
              key={conv._id}
              elevation="sm"
              onClick={() => dispatch(setCurrentConversation(conv))}
              className={`mx-2 my-1 p-3 cursor-pointer transition-all ${
                currentConversation?._id === conv._id
                  ? "bg-blue-50 border-blue-200"
                  : "hover:bg-gray-50"
              }`}
            >
              <p className="font-medium text-gray-900 text-sm">
                {conv.name || conv.participants.map((p: any) => p.name).join(", ")}
              </p>
              <p className="text-gray-500 text-xs truncate">
                {conv.lastMessage || "No messages yet"}
              </p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
