import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@shared/api/axiosInstance";
import type { Task, CreateTaskInput, UpdateTaskInput } from "@shared/validations/task.zod";

export const createTask = createAsyncThunk<Task, CreateTaskInput, { rejectValue: string }>(
  "task/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<{ success: boolean; data: Task }>(
        "/tasks",
        data
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create task");
    }
  }
);

export const getTasks = createAsyncThunk<Task[], void, { rejectValue: string }>(
  "task/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<{ success: boolean; data: Task[] }>("/tasks");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch tasks");
    }
  }
);

export const getTaskById = createAsyncThunk<Task, string, { rejectValue: string }>(
  "task/getById",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<{ success: boolean; data: Task }>(
        `/tasks/${taskId}`
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch task");
    }
  }
);

export const updateTask = createAsyncThunk<
  Task,
  { taskId: string; data: UpdateTaskInput },
  { rejectValue: string }
>("task/update", async ({ taskId, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch<{ success: boolean; data: Task }>(
      `/tasks/${taskId}`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to update task");
  }
});

export const deleteTask = createAsyncThunk<string, string, { rejectValue: string }>(
  "task/delete",
  async (taskId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/tasks/${taskId}`);
      return taskId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete task");
    }
  }
);

export const assignTask = createAsyncThunk<
  Task,
  { taskId: string; assignedTo: string },
  { rejectValue: string }
>("task/assign", async ({ taskId, assignedTo }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch<{ success: boolean; data: Task }>(
      `/tasks/${taskId}/assign`,
      { assignedTo }
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to assign task");
  }
});
