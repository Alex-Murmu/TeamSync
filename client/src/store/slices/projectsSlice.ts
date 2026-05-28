import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  addProjectMember,
  createProject,
  deleteProject,
  getProject,
  updateProject,
  removeProjectMember,
} from "@/api/endpoints/projects";
import api from "@/api/client";
import { AxiosError } from "axios";

interface ProjectMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface ProjectItem {
  _id: string;
  title: string;
  description?: string;
  admin: ProjectMember;
  member: ProjectMember[];
  dueDate: string;
}

interface ProjectsState {
  items: ProjectItem[];
  active: ProjectItem | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: ProjectsState = {
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

export const fetchProjects = createAsyncThunk("projects/list", async (workspaceId?: string, { rejectWithValue }) => {
  try {
    const url = workspaceId ? `/projects?workspaceId=${workspaceId}` : "/projects";
    const { data } = await api.get(url);
    return data?.data as ProjectItem[];
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err, "Failed to fetch projects"));
  }
});

export const fetchProject = createAsyncThunk("projects/get", async (id: string, { rejectWithValue }) => {
  try {
    const { data } = await getProject(id);
    return data?.data as ProjectItem;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err, "Failed to fetch project"));
  }
});

export const createProjectItem = createAsyncThunk(
  "projects/create",
  async (payload: { title: string; description?: string; dueDate: string; workspaceId?: string }, { rejectWithValue }) => {
    try {
      const { data } = await createProject(payload);
      return data?.data as ProjectItem;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Failed to create project"));
    }
  }
);

export const updateProjectItem = createAsyncThunk(
  "projects/update",
  async (payload: { id: string; title?: string; description?: string; dueDate?: string }, { rejectWithValue }) => {
    try {
      const { data } = await updateProject(payload.id, payload);
      return data?.data as ProjectItem;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Failed to update project"));
    }
  }
);

export const deleteProjectItem = createAsyncThunk("projects/delete", async (id: string, { rejectWithValue }) => {
  try {
    await deleteProject(id);
    return id;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err, "Failed to delete project"));
  }
});

export const addProjectMemberItem = createAsyncThunk(
  "projects/addMember",
  async (payload: { id: string; memberId: string }, { rejectWithValue }) => {
    try {
      const { data } = await addProjectMember(payload.id, payload.memberId);
      return data?.data as ProjectItem;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Failed to add member"));
    }
  }
);

export const removeProjectMemberItem = createAsyncThunk(
  "projects/removeMember",
  async (payload: { id: string; memberId: string }, { rejectWithValue }) => {
    try {
      const { data } = await removeProjectMember(payload.id, payload.memberId);
      return data?.data as ProjectItem;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Failed to remove member"));
    }
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearProjectError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<ProjectItem[]>) => {
        state.items = action.payload;
        state.status = "idle";
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to fetch projects";
      })
      .addCase(fetchProject.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action: PayloadAction<ProjectItem>) => {
        state.active = action.payload;
        state.status = "idle";
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to fetch project";
      })
      .addCase(createProjectItem.pending, (state) => {
        state.error = null;
      })
      .addCase(createProjectItem.fulfilled, (state, action: PayloadAction<ProjectItem>) => {
        state.items.unshift(action.payload);
      })
      .addCase(createProjectItem.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to create project";
      })
      .addCase(updateProjectItem.pending, (state) => {
        state.error = null;
      })
      .addCase(updateProjectItem.fulfilled, (state, action: PayloadAction<ProjectItem>) => {
        state.items = state.items.map((item) => (item._id === action.payload._id ? action.payload : item));
        state.active = action.payload;
      })
      .addCase(updateProjectItem.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to update project";
      })
      .addCase(deleteProjectItem.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteProjectItem.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteProjectItem.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to delete project";
      })
      .addCase(addProjectMemberItem.pending, (state) => {
        state.error = null;
      })
      .addCase(addProjectMemberItem.fulfilled, (state, action: PayloadAction<ProjectItem>) => {
        state.items = state.items.map((item) => (item._id === action.payload._id ? action.payload : item));
        state.active = action.payload;
      })
      .addCase(addProjectMemberItem.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to add member";
      });
    builder
      .addCase(removeProjectMemberItem.pending, (state) => {
        state.error = null;
      })
      .addCase(removeProjectMemberItem.fulfilled, (state, action: PayloadAction<ProjectItem>) => {
        state.items = state.items.map((item) => (item._id === action.payload._id ? action.payload : item));
        state.active = action.payload;
      })
      .addCase(removeProjectMemberItem.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to remove member";
      });
  },
});

export const { clearProjectError } = projectsSlice.actions;
export default projectsSlice.reducer;
