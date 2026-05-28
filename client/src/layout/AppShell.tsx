import { NavLink, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/store/slices/authSlice";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Overview" },
  { to: "/projects", label: "Projects" },
  { to: "/tasks", label: "Tasks" },
  { to: "/team", label: "Team" },
  { to: "/messages", label: "Messages" },
  { to: "/calls", label: "Calls" },
  { to: "/profile", label: "Profile" },
  { to: "/settings", label: "Settings" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);
  const role = user?.role ?? "MEMBER";
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        <aside className="hidden min-h-screen w-72 flex-col gap-6 border-r border-border/60 bg-background/95 px-6 py-8 lg:flex">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">TeamSync</p>
              <h1 className="text-xl font-semibold">Command Center</h1>
            </div>
            <Badge variant="secondary">{role}</Badge>
          </div>
          <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Signed in</p>
            <p className="mt-2 text-sm font-medium">
              {user ? `${user.firstName} ${user.lastName}` : ""}
            </p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-xl px-4 py-2 text-sm transition",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto">
            <button
              onClick={async () => {
                await dispatch(logoutUser());
                navigate("/login");
              }}
              className="w-full rounded-xl px-4 py-2 text-sm text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
            >
              Logout
            </button>
          </div>
        </aside>
        <main className="flex-1 px-4 py-6 md:px-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
