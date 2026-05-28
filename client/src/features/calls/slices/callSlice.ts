import { createSlice } from "@reduxjs/toolkit";
import type { CallSession } from "@shared/validations/call.zod";
import {
  createCallSession,
  joinCallSession,
  leaveCallSession,
  endCallSession,
} from "../api/callApi";

interface CallState {
  callSessions: CallSession[];
  currentCallSession: CallSession | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CallState = {
  callSessions: [],
  currentCallSession: null,
  isLoading: false,
  error: null,
};

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentCallSession: (state, action) => {
      state.currentCallSession = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Create Call Session
    builder
      .addCase(createCallSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCallSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCallSession = action.payload;
      })
      .addCase(createCallSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create call session";
      });

    // Join Call Session
    builder
      .addCase(joinCallSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(joinCallSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCallSession = action.payload;
      })
      .addCase(joinCallSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to join call session";
      });

    // Leave Call Session
    builder
      .addCase(leaveCallSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(leaveCallSession.fulfilled, (state) => {
        state.isLoading = false;
        state.currentCallSession = null;
      })
      .addCase(leaveCallSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to leave call session";
      });

    // End Call Session
    builder
      .addCase(endCallSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(endCallSession.fulfilled, (state) => {
        state.isLoading = false;
        state.currentCallSession = null;
      })
      .addCase(endCallSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to end call session";
      });
  },
});

export const { clearError, setCurrentCallSession } = callSlice.actions;
export default callSlice.reducer;
