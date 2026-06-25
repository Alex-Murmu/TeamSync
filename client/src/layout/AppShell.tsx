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
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="flex">
        <aside className="hidden min-h-screen w-72 flex-col gap-6 border-r border-white/5 bg-[#0a0a0c]/95 px-6 py-8 lg:flex">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c6af7" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
              </svg>
              <span className="text-sm font-semibold text-white">TeamSync</span>
            </div>
            <Badge variant="secondary" className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-white/60">{role}</Badge>
          </div>
          <div className="rounded-xl border border-white/6 bg-white/[0.02] p-4">
            <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2">Signed in</p>
            <p className="text-sm font-medium text-white/80">
              {user ? `${user.firstName} ${user.lastName}` : ""}
            </p>
            <p className="text-xs text-white/30 mt-0.5">{user?.email}</p>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3 py-2 text-sm transition",
                    isActive
                      ? "bg-[#7c6af7]/10 text-[#a78bfa]"
                      : "text-white/40 hover:bg-white/5 hover:text-white/70"
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
              className="w-full rounded-lg px-3 py-2 text-sm text-white/35 transition hover:bg-white/5 hover:text-white/70"
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