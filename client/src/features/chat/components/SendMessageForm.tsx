import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@shared/hooks/redux";
import { clearError } from "../slices/chatSlice";
import { sendMessage } from "../api/chatApi";
import { Button, Input } from "@shared/ui";

interface SendMessageFormProps {
  conversationId: string;
}

export function SendMessageForm({ conversationId }: SendMessageFormProps) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.chat);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    dispatch(sendMessage({ conversationId, data: { content: message } })).then(() => {
      setMessage("");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
      {error && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
          {error}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] focus:outline-none focus:border-blue-500 focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.1),0_0_0_3px_rgba(59,130,246,0.1)] transition-all duration-200"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          disabled={!message.trim()}
        >
          Send
        </Button>
      </div>
    </form>
  );
}
