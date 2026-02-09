import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Users, CalendarCheck, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/employees", label: "Employees", icon: Users },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col bg-sidebar border-r border-sidebar-border">
        <div className="p-5 border-b border-sidebar-border">
          <h1 className="text-lg font-bold text-sidebar-primary-foreground font-display tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground text-sm font-bold">
              HR
            </div>
            HRMS Lite
          </h1>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/50">Admin Panel v1.0</p>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <nav className="flex justify-around py-2">
          {navItems.map((item) => {
            const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors rounded-lg",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
