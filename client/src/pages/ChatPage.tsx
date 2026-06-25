import { useState } from "react";
import { useParams } from "react-router-dom";
import { ConversationList } from "@features/chat/components/ConversationList";
import { MessageList } from "@features/chat/components/MessageList";
import { SendMessageForm } from "@features/chat/components/SendMessageForm";
import { CreateConversationDialog } from "@features/chat/components/CreateConversationDialog";
import { useAppSelector } from "@shared/hooks/redux";
import { Button } from "@shared/ui";

export function ChatPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { currentConversation } = useAppSelector((state) => state.chat);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 flex flex-col border-r border-gray-200 bg-white">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
            >
              +
            </Button>
          </div>
          <ConversationList />
        </div>

        {currentConversation ? (
          <div className="flex-1 flex flex-col bg-white">
            <div className="border-b border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900">
                {currentConversation.title ||
                  currentConversation.members?.map((m: any) => m).join(", ")}
              </h3>
            </div>
            <MessageList conversationId={currentConversation._id} />
            <SendMessageForm conversationId={currentConversation._id} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <p className="text-gray-500">Select a conversation to start chatting</p>
          </div>
        )}
      </div>

      <CreateConversationDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
