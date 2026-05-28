import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMe, login, register, type LoginPayload } from "@/api/endpoints/auth";
import { AxiosError } from "axios";
import api from "@/api/client";

interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  skills?: string[];
}

interface AuthState {
  user: AuthUser | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
  isInitialized: false,
};

function extractErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof AxiosError && err.response?.data?.message) {
    return err.response.data.message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const { data } = await login(payload);
      const user = data?.data as AuthUser;
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
      return user;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Login failed"));
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    payload: { firstName: string; lastName: string; email: string; password: string; role?: "ADMIN" | "MEMBER" },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await register(payload);
      const user = data?.data as AuthUser;
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
      return user;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Registration failed"));
    }
  }
);

export const fetchMe = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getMe();
      const user = data?.data as AuthUser;
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
      return user;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Failed to fetch user"));
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/user/logout");
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Logout failed"));
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = action.payload as AuthUser;
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload as AuthUser;
        state.status = "idle";
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Registration failed";
      })
      .addCase(fetchMe.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload as AuthUser;
        state.status = "idle";
        state.isInitialized = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.status = "failed";
        state.user = null;
        state.isInitialized = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
        state.error = null;
        state.isInitialized = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.status = "idle";
        state.error = null;
        state.isInitialized = false;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
