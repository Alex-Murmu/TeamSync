import { createSlice } from "@reduxjs/toolkit";
import type { Conversation, Message } from "@shared/validations/chat.zod";
import {
  createDirectConversation,
  createGroupConversation,
  getConversations,
  getConversationById,
  getMessages,
  sendMessage,
  markConversationRead,
} from "../api/chatApi";

interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Create Direct Conversation
    builder
      .addCase(createDirectConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createDirectConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations.push(action.payload);
        state.currentConversation = action.payload;
        state.messages = [];
      })
      .addCase(createDirectConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create conversation";
      });

    // Create Group Conversation
    builder
      .addCase(createGroupConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGroupConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations.push(action.payload);
        state.currentConversation = action.payload;
        state.messages = [];
      })
      .addCase(createGroupConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create group conversation";
      });

    // Get Conversations
    builder
      .addCase(getConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch conversations";
      });

    // Get Conversation By ID
    builder
      .addCase(getConversationById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getConversationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentConversation = action.payload;
      })
      .addCase(getConversationById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch conversation";
      });

    // Get Messages
    builder
      .addCase(getMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch messages";
      });

    // Send Message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to send message";
      });

    // Mark Conversation Read
    builder
      .addCase(markConversationRead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markConversationRead.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(markConversationRead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to mark conversation as read";
      });
  },
});

export const { clearError, setCurrentConversation } = chatSlice.actions;
export default chatSlice.reducer;
