import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@shared/api/axiosInstance";
import type { CallSession, CreateCallSessionInput, JoinCallSessionInput } from "@shared/validations/call.zod";

export const createCallSession = createAsyncThunk<
  CallSession,
  CreateCallSessionInput,
  { rejectValue: string }
>("call/createSession", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<{ success: boolean; data: CallSession }>(
      "/calls",
      data
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to create call session");
  }
});

export const joinCallSession = createAsyncThunk<
  CallSession,
  JoinCallSessionInput,
  { rejectValue: string }
>("call/joinSession", async ({ callSessionId }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<{ success: boolean; data: CallSession }>(
      `/calls/${callSessionId}/join`
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to join call session");
  }
});

export const leaveCallSession = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("call/leaveSession", async (callSessionId, { rejectWithValue }) => {
  try {
    await axiosInstance.post(`/calls/${callSessionId}/leave`);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to leave call session");
  }
});

export const endCallSession = createAsyncThunk<void, string, { rejectValue: string }>(
  "call/endSession",
  async (callSessionId, { rejectWithValue }) => {
    try {
      await axiosInstance.post(`/calls/${callSessionId}/end`);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to end call session");
    }
  }
);
