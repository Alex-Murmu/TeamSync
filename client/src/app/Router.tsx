import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "@pages/LandingPage";
import { LoginPage } from "@pages/LoginPage";
import SignupPage from "@pages/SignupPage";
import DashboardPage from "@pages/DashboardPage";
import { WorkspacesPage } from "@pages/WorkspacesPage";
import { WorkspaceInviteAcceptPage } from "@pages/WorkspaceInviteAcceptPage";
import { ProjectsPage } from "@pages/ProjectsPage";
import { TasksPage } from "@pages/TasksPage";
import { ChatPage } from "@pages/ChatPage";
import { NotFoundPage } from "@pages/NotFoundPage";
import  TeamPage  from "@pages/TeamPage";
import  MessagesPage  from "@pages/MessagesPage";
import  CallsPage  from "@pages/CallsPage";
import  ProfilePage  from "@pages/ProfilePage";
import  SettingsPage  from "@pages/SettingsPage";
import ProtectedRoute from "@/routes/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/workspaces/invite/:token/accept",
    element: <WorkspaceInviteAcceptPage />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><DashboardPage /></ProtectedRoute>,
  },
  {
    path: "/workspaces",
    element: <ProtectedRoute><WorkspacesPage /></ProtectedRoute>,
  },
  {
    path: "/workspaces/:workspaceId/projects",
    element: <ProtectedRoute><ProjectsPage /></ProtectedRoute>,
  },
  {
    path: "/projects",
    element: <ProtectedRoute><ProjectsPage /></ProtectedRoute>,
  },
  {
    path: "/projects/:projectId/tasks",
    element: <ProtectedRoute><TasksPage /></ProtectedRoute>,
  },
  {
    path: "/tasks",
    element: <ProtectedRoute><TasksPage /></ProtectedRoute>,
  },
  {
    path: "/chat",
    element: <ProtectedRoute><ChatPage /></ProtectedRoute>,
  },
  {
    path: "/chat/:conversationId",
    element: <ProtectedRoute><ChatPage /></ProtectedRoute>,
  },
  {
    path: "/team",
    element: <ProtectedRoute><TeamPage /></ProtectedRoute>,
  },
  {
    path: "/messages",
    element: <ProtectedRoute><MessagesPage /></ProtectedRoute>,
  },
  {
    path: "/calls",
    element: <ProtectedRoute><CallsPage /></ProtectedRoute>,
  },
  {
    path: "/profile",
    element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
  },
  {
    path: "/settings",
    element: <ProtectedRoute><SettingsPage /></ProtectedRoute>,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
