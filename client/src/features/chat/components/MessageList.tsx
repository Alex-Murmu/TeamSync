import { useAppSelector, useAppDispatch } from "@shared/hooks/redux";
import { getMessages } from "../api/chatApi";
import { Skeleton } from "@shared/ui";
import { useEffect } from "react";

interface MessageListProps {
  conversationId: string;
}

export function MessageList({ conversationId }: MessageListProps) {
  const dispatch = useAppDispatch();
  const { messages, isLoading } = useAppSelector((state) => state.chat);

  useEffect(() => {
    if (conversationId) {
      dispatch(getMessages({ conversationId }));
    }
  }, [dispatch, conversationId]);

  if (isLoading && messages.length === 0) {
    return (
      <div className="space-y-4 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} height="h-12" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 text-sm py-8">
          No messages yet
        </div>
      ) : (
        messages.map((msg) => (
          <div
            key={msg._id}
            className="flex flex-col gap-1 max-w-xs bg-gray-100 rounded-lg p-3 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]"
          >
            <p className="text-xs font-medium text-gray-700">{msg.sender?.name}</p>
            <p className="text-gray-900 text-sm">{msg.content}</p>
            <p className="text-xs text-gray-500">
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
