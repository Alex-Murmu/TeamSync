import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@shared/api/axiosInstance";
import {
  Conversation,
  Message,
  CreateDirectConversationInput,
  CreateGroupConversationInput,
  SendMessageInput,
} from "@shared/validations/chat.zod";

export const createDirectConversation = createAsyncThunk<
  Conversation,
  CreateDirectConversationInput,
  { rejectValue: string }
>("chat/createDirect", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<{ success: boolean; data: Conversation }>(
      "/conversations/direct",
      data
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to create conversation");
  }
});

export const createGroupConversation = createAsyncThunk<
  Conversation,
  CreateGroupConversationInput,
  { rejectValue: string }
>("chat/createGroup", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<{ success: boolean; data: Conversation }>(
      "/conversations/group",
      data
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to create group conversation");
  }
});

export const getConversations = createAsyncThunk<Conversation[], void, { rejectValue: string }>(
  "chat/getConversations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<{ success: boolean; data: Conversation[] }>(
        "/conversations"
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch conversations");
    }
  }
);

export const getConversationById = createAsyncThunk<Conversation, string, { rejectValue: string }>(
  "chat/getById",
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<{ success: boolean; data: Conversation }>(
        `/conversations/${conversationId}`
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch conversation");
    }
  }
);

export const getMessages = createAsyncThunk<
  Message[],
  { conversationId: string; page?: number; limit?: number },
  { rejectValue: string }
>("chat/getMessages", async ({ conversationId, page = 1, limit = 20 }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<{
      success: boolean;
      data: { messages: Message[] };
    }>(`/conversations/${conversationId}/messages?page=${page}&limit=${limit}`);
    return response.data.data.messages;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch messages");
  }
});

export const sendMessage = createAsyncThunk<
  Message,
  { conversationId: string; data: SendMessageInput },
  { rejectValue: string }
>("chat/sendMessage", async ({ conversationId, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<{ success: boolean; data: Message }>(
      `/conversations/${conversationId}/messages`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to send message");
  }
});

export const markConversationRead = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("chat/markRead", async (conversationId, { rejectWithValue }) => {
  try {
    await axiosInstance.post(`/conversations/${conversationId}/read`);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to mark conversation as read");
  }
});
