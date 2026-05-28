import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { listUsers } from "@/api/endpoints/users";
import { AxiosError } from "axios";

interface MemberItem {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  skills?: string[];
}

interface MembersState {
  items: MemberItem[];
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: MembersState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchMembers = createAsyncThunk("members/list", async (_, { rejectWithValue }) => {
  try {
    const { data } = await listUsers();
    return data?.data as MemberItem[];
  } catch (err) {
    const message =
      err instanceof AxiosError && err.response?.data?.message
        ? err.response.data.message
        : "Failed to fetch members";
    return rejectWithValue(message);
  }
});

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    clearMemberError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMembers.fulfilled, (state, action: PayloadAction<MemberItem[]>) => {
        state.items = action.payload;
        state.status = "idle";
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to fetch members";
      });
  },
});

export const { clearMemberError } = membersSlice.actions;
export default membersSlice.reducer;
