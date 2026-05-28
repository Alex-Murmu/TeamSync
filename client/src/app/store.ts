import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@features/auth/slices/authSlice";
import workspaceReducer from "@features/workspaces/slices/workspaceSlice";
import projectReducer from "@features/projects/slices/projectSlice";
import taskReducer from "@features/tasks/slices/taskSlice";
import chatReducer from "@features/chat/slices/chatSlice";
import callReducer from "@features/calls/slices/callSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workspace: workspaceReducer,
    project: projectReducer,
    task: taskReducer,
    chat: chatReducer,
    call: callReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
