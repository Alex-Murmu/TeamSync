import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { assignTask, createTask, deleteTask, getTask, getTasks, updateTask } from "@/api/endpoints/tasks";
import { AxiosError } from "axios";

interface TaskItem {
  _id: string;
  title: string;
  description?: string;
  projectid: { _id: string; title: string } | string;
  assignedTo?: { _id: string; firstName: string; lastName: string; email: string };
  status: "Pending" | "Progress" | "Review" | "Complete";
  priority: "High" | "Moderate" | "Low";
  dueDate: string;
}

interface TasksState {
  items: TaskItem[];
  active: TaskItem | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  active: null,
  status: "idle",
  error: null,
};

function extractErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof AxiosError && err.response?.data?.message) {
    return typeof err.response.data.message === "string"
      ? err.response.data.message
      : JSON.stringify(err.response.data.message);
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export const fetchTasks = createAsyncThunk("tasks/list", async (_, { rejectWithValue }) => {
  try {
    const { data } = await getTasks();
    return data?.data as TaskItem[];
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err, "Failed to fetch tasks"));
  }
});

export const fetchTask = createAsyncThunk("tasks/get", async (id: string, { rejectWithValue }) => {
  try {
    const { data } = await getTask(id);
    return data?.data as TaskItem;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err, "Failed to fetch task"));
  }
});

export const createTaskItem = createAsyncThunk(
  "tasks/create",
  async (
    payload: {
      title: string;
      description?: string;
      projectId: string;
      priority: "High" | "Moderate" | "Low";
      dueDate: string;
      status?: "Pending" | "Progress" | "Review" | "Complete";
      assignedTo?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await createTask(payload);
      return data?.data as TaskItem;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Failed to create task"));
    }
  }
);

export const updateTaskItem = createAsyncThunk(
  "tasks/update",
  async (
    payload: { id: string; title?: string; description?: string; status?: "Pending" | "Progress" | "Review" | "Complete"; priority?: "High" | "Moderate" | "Low"; dueDate?: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await updateTask(payload.id, payload);
      return data?.data as TaskItem;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Failed to update task"));
    }
  }
);

export const assignTaskItem = createAsyncThunk(
  "tasks/assign",
  async (payload: { id: string; assignedTo: string }, { rejectWithValue }) => {
    try {
      const { data } = await assignTask(payload.id, payload.assignedTo);
      return data?.data as TaskItem;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Failed to assign task"));
    }
  }
);

export const deleteTaskItem = createAsyncThunk("tasks/delete", async (id: string, { rejectWithValue }) => {
  try {
    await deleteTask(id);
    return id;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err, "Failed to delete task"));
  }
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTaskError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<TaskItem[]>) => {
        state.items = action.payload;
        state.status = "idle";
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to fetch tasks";
      })
      .addCase(fetchTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTask.fulfilled, (state, action: PayloadAction<TaskItem>) => {
        state.active = action.payload;
        state.status = "idle";
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to fetch task";
      })
      .addCase(createTaskItem.pending, (state) => {
        state.error = null;
      })
      .addCase(createTaskItem.fulfilled, (state, action: PayloadAction<TaskItem>) => {
        state.items.unshift(action.payload);
      })
      .addCase(createTaskItem.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to create task";
      })
      .addCase(updateTaskItem.pending, (state) => {
        state.error = null;
      })
      .addCase(updateTaskItem.fulfilled, (state, action: PayloadAction<TaskItem>) => {
        state.items = state.items.map((item) => (item._id === action.payload._id ? action.payload : item));
        state.active = action.payload;
      })
      .addCase(updateTaskItem.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to update task";
      })
      .addCase(assignTaskItem.pending, (state) => {
        state.error = null;
      })
      .addCase(assignTaskItem.fulfilled, (state, action: PayloadAction<TaskItem>) => {
        state.items = state.items.map((item) => (item._id === action.payload._id ? action.payload : item));
        state.active = action.payload;
      })
      .addCase(assignTaskItem.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to assign task";
      })
      .addCase(deleteTaskItem.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteTaskItem.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteTaskItem.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to delete task";
      });
  },
});

export const { clearTaskError } = tasksSlice.actions;
export default tasksSlice.reducer;
