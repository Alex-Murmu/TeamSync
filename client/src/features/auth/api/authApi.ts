import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@shared/api/axiosInstance";
import type { LoginInput, RegisterInput, User } from "@shared/validations/auth.zod";

export const loginUser = createAsyncThunk<
  { user: User; token: string },
  LoginInput,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<{
      success: boolean;
      data: { id: string; firstName: string; lastName: string; email: string; role: string };
      message: string;
    }>("/user/login", credentials);

    if (!response.data.success) {
      return rejectWithValue(response.data.message);
    }

    const token = response.headers["set-cookie"]?.join(";") || "";
    localStorage.setItem("authToken", token);

    const user: User = {
      _id: response.data.data.id,
      firstName: response.data.data.firstName,
      lastName: response.data.data.lastName,
      email: response.data.data.email,
      isEmailVerified: true,
    };

    localStorage.setItem("user", JSON.stringify(user));

    return { user, token };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Login failed. Please try again."
    );
  }
});

export const registerUser = createAsyncThunk<
  { user: User; token: string },
  RegisterInput,
  { rejectValue: string }
>("auth/register", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<{
      success: boolean;
      data: { id: string; firstName: string; lastName: string; email: string };
      message: string;
    }>("/user/register", credentials);

    if (!response.data.success) {
      return rejectWithValue(response.data.message);
    }

    const token = response.headers["set-cookie"]?.join(";") || "";
    localStorage.setItem("authToken", token);

    const user: User = {
      _id: response.data.data.id,
      firstName: response.data.data.firstName,
      lastName: response.data.data.lastName,
      email: response.data.data.email,
      isEmailVerified: false,
    };

    localStorage.setItem("user", JSON.stringify(user));

    return { user, token };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Registration failed. Please try again."
    );
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/user/logout");
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Logout failed. Please try again."
      );
    }
  }
);

export const getCurrentUser = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<{
        success: boolean;
        data: {
          _id: string;
          firstName: string;
          lastName: string;
          email: string;
          isEmailVerified: boolean;
        };
      }>("/user/me");

      if (!response.data.success) {
        return rejectWithValue("Failed to fetch current user");
      }

      const user: User = {
        _id: response.data.data._id,
        firstName: response.data.data.firstName,
        lastName: response.data.data.lastName,
        email: response.data.data.email,
        isEmailVerified: response.data.data.isEmailVerified,
      };

      return user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch current user"
      );
    }
  }
);
