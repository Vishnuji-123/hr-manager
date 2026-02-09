import { Users, CalendarCheck, Building2, TrendingUp } from "lucide-react";
import { useEmployees } from "@/hooks/useEmployees";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: employees, isLoading } = useEmployees();

  const totalEmployees = employees?.length ?? 0;
  const departments = new Set(employees?.map((e) => e.department)).size;

  const stats = [
    { label: "Total Employees", value: totalEmployees, icon: Users, color: "text-primary" },
    { label: "Departments", value: departments, icon: Building2, color: "text-accent" },
    { label: "Active System", value: "Online", icon: TrendingUp, color: "text-success" },
    { label: "Attendance Module", value: "Active", icon: CalendarCheck, color: "text-primary" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-header">Dashboard</h1>
        <p className="page-description">Overview of your HR management system</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) =>
          isLoading ? (
            <Skeleton key={stat.label} className="h-28 rounded-xl" />
          ) : (
            <div key={stat.label} className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </span>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold font-display">{stat.value}</p>
            </div>
          )
        )}
      </div>

      {!isLoading && totalEmployees === 0 && (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No employees yet</h3>
          <p className="text-muted-foreground text-sm">
            Head to the Employees section to add your first team member.
          </p>
        </div>
      )}

      {!isLoading && totalEmployees > 0 && (
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-lg font-semibold font-display mb-4">Recent Employees</h2>
          <div className="space-y-3">
            {employees?.slice(0, 5).map((emp) => (
              <div key={emp.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-sm">{emp.full_name}</p>
                  <p className="text-xs text-muted-foreground">{emp.email}</p>
                </div>
                <span className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full font-medium">
                  {emp.department}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
