import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@shared/api/axiosInstance";
import {
  Workspace,
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  InviteMemberInput,
  UpdateMemberRoleInput,
} from "@shared/validations/workspace.zod";

export const createWorkspace = createAsyncThunk<Workspace, CreateWorkspaceInput, { rejectValue: string }>(
  "workspace/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<{ success: boolean; data: Workspace }>(
        "/workspaces",
        data
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create workspace");
    }
  }
);

export const getWorkspaces = createAsyncThunk<Workspace[], void, { rejectValue: string }>(
  "workspace/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<{ success: boolean; data: Workspace[] }>(
        "/workspaces"
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch workspaces");
    }
  }
);

export const getWorkspaceById = createAsyncThunk<Workspace, string, { rejectValue: string }>(
  "workspace/getById",
  async (workspaceId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<{ success: boolean; data: Workspace }>(
        `/workspaces/${workspaceId}`
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch workspace");
    }
  }
);

export const updateWorkspace = createAsyncThunk<
  Workspace,
  { workspaceId: string; data: UpdateWorkspaceInput },
  { rejectValue: string }
>("workspace/update", async ({ workspaceId, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch<{ success: boolean; data: Workspace }>(
      `/workspaces/${workspaceId}`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to update workspace");
  }
});

export const deleteWorkspace = createAsyncThunk<string, string, { rejectValue: string }>(
  "workspace/delete",
  async (workspaceId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/workspaces/${workspaceId}`);
      return workspaceId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete workspace");
    }
  }
);

export const inviteMember = createAsyncThunk<
  Workspace,
  { workspaceId: string; data: InviteMemberInput },
  { rejectValue: string }
>("workspace/invite", async ({ workspaceId, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<{ success: boolean; data: Workspace }>(
      `/workspaces/${workspaceId}/invite`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to send invitation");
  }
});

export const updateMemberRole = createAsyncThunk<
  Workspace,
  { workspaceId: string; memberId: string; data: UpdateMemberRoleInput },
  { rejectValue: string }
>("workspace/updateRole", async ({ workspaceId, memberId, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch<{ success: boolean; data: Workspace }>(
      `/workspaces/${workspaceId}/members/${memberId}/role`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to update member role");
  }
});

export const removeMember = createAsyncThunk<
  Workspace,
  { workspaceId: string; memberId: string },
  { rejectValue: string }
>("workspace/removeMember", async ({ workspaceId, memberId }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete<{ success: boolean; data: Workspace }>(
      `/workspaces/${workspaceId}/members/${memberId}`
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to remove member");
  }
});

export const acceptInvitation = createAsyncThunk<
  Workspace,
  { token: string },
  { rejectValue: string }
>("workspace/acceptInvite", async ({ token }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<{ success: boolean; data: Workspace }>(
      `/workspaces/invite/${token}/accept`
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to accept invitation");
  }
});
