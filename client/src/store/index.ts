import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice";
import projectsReducer from "@/store/slices/projectsSlice";
import tasksReducer from "@/store/slices/tasksSlice";
import membersReducer from "@/store/slices/membersSlice";
import workspaceReducer from "@features/workspaces/slices/workspaceSlice";
import chatReducer from "@features/chat/slices/chatSlice";
import callReducer from "@features/calls/slices/callSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
    members: membersReducer,
    workspace: workspaceReducer,
    chat: chatReducer,
    call: callReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
