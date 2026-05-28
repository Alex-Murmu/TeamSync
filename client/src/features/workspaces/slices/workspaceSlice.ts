import { createSlice } from "@reduxjs/toolkit";
import type { Workspace } from "@shared/validations/workspace.zod";
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  inviteMember,
  updateMemberRole,
  removeMember,
  acceptInvitation,
} from "../api/workspaceApi";

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WorkspaceState = {
  workspaces: [],
  currentWorkspace: null,
  isLoading: false,
  error: null,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentWorkspace: (state, action) => {
      state.currentWorkspace = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Create Workspace
    builder
      .addCase(createWorkspace.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workspaces.push(action.payload);
        state.currentWorkspace = action.payload;
      })
      .addCase(createWorkspace.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create workspace";
      });

    // Get Workspaces
    builder
      .addCase(getWorkspaces.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getWorkspaces.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workspaces = action.payload;
      })
      .addCase(getWorkspaces.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch workspaces";
      });

    // Get Workspace By ID
    builder
      .addCase(getWorkspaceById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getWorkspaceById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentWorkspace = action.payload;
      })
      .addCase(getWorkspaceById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch workspace";
      });

    // Update Workspace
    builder
      .addCase(updateWorkspace.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateWorkspace.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.workspaces.findIndex((w) => w._id === action.payload._id);
        if (index !== -1) {
          state.workspaces[index] = action.payload;
        }
        if (state.currentWorkspace?._id === action.payload._id) {
          state.currentWorkspace = action.payload;
        }
      })
      .addCase(updateWorkspace.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update workspace";
      });

    // Delete Workspace
    builder
      .addCase(deleteWorkspace.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteWorkspace.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workspaces = state.workspaces.filter((w) => w._id !== action.payload);
        if (state.currentWorkspace?._id === action.payload) {
          state.currentWorkspace = null;
        }
      })
      .addCase(deleteWorkspace.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to delete workspace";
      });

    // Invite Member
    builder
      .addCase(inviteMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(inviteMember.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.workspaces.findIndex((w) => w._id === action.payload._id);
        if (index !== -1) state.workspaces[index] = action.payload;
        if (state.currentWorkspace?._id === action.payload._id) {
          state.currentWorkspace = action.payload;
        }
      })
      .addCase(inviteMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to invite member";
      });

    // Update Member Role
    builder
      .addCase(updateMemberRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateMemberRole.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.workspaces.findIndex((w) => w._id === action.payload._id);
        if (index !== -1) state.workspaces[index] = action.payload;
        if (state.currentWorkspace?._id === action.payload._id) {
          state.currentWorkspace = action.payload;
        }
      })
      .addCase(updateMemberRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update member role";
      });

    // Remove Member
    builder
      .addCase(removeMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.workspaces.findIndex((w) => w._id === action.payload._id);
        if (index !== -1) state.workspaces[index] = action.payload;
        if (state.currentWorkspace?._id === action.payload._id) {
          state.currentWorkspace = action.payload;
        }
      })
      .addCase(removeMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to remove member";
      });

    // Accept Invitation
    builder
      .addCase(acceptInvitation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(acceptInvitation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentWorkspace = action.payload;
        const exists = state.workspaces.find((workspace) => workspace._id === action.payload._id);
        if (!exists) {
          state.workspaces.push(action.payload);
        }
      })
      .addCase(acceptInvitation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to accept invitation";
      });
  },
});

export const { clearError, setCurrentWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;
