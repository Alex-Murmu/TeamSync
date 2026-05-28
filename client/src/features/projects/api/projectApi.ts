import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@shared/api/axiosInstance";
import type { Project, CreateProjectInput, UpdateProjectInput } from "@shared/validations/project.zod";

export const createProject = createAsyncThunk<Project, CreateProjectInput, { rejectValue: string }>(
  "project/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<{ success: boolean; data: Project }>(
        "/projects",
        data
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create project");
    }
  }
);

export const getProjects = createAsyncThunk<Project[], string | undefined, { rejectValue: string }>(
  "project/getAll",
  async (workspaceId, { rejectWithValue }) => {
    try {
      const url = workspaceId ? `/projects?workspaceId=${workspaceId}` : "/projects";
      const response = await axiosInstance.get<{ success: boolean; data: Project[] }>(url);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch projects");
    }
  }
);

export const getProjectById = createAsyncThunk<Project, string, { rejectValue: string }>(
  "project/getById",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<{ success: boolean; data: Project }>(
        `/projects/${projectId}`
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch project");
    }
  }
);

export const updateProject = createAsyncThunk<
  Project,
  { projectId: string; data: UpdateProjectInput },
  { rejectValue: string }
>("project/update", async ({ projectId, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch<{ success: boolean; data: Project }>(
      `/projects/${projectId}`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to update project");
  }
});

export const deleteProject = createAsyncThunk<string, string, { rejectValue: string }>(
  "project/delete",
  async (projectId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/projects/${projectId}`);
      return projectId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete project");
    }
  }
);

export const addProjectMember = createAsyncThunk<
  Project,
  { projectId: string; memberId: string },
  { rejectValue: string }
>("project/addMember", async ({ projectId, memberId }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch<{ success: boolean; data: Project }>(
      `/projects/${projectId}/member`,
      { memberId }
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to add member");
  }
});

export const removeProjectMember = createAsyncThunk<
  Project,
  { projectId: string; memberId: string },
  { rejectValue: string }
>("project/removeMember", async ({ projectId, memberId }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete<{ success: boolean; data: Project }>(
      `/projects/${projectId}/member/${memberId}`
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to remove member");
  }
});
