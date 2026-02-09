import { useState } from "react";
import { Plus, Trash2, Search, Users } from "lucide-react";
import { useEmployees, useAddEmployee, useDeleteEmployee } from "@/hooks/useEmployees";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { z } from "zod";

const employeeSchema = z.object({
  employee_id: z.string().trim().min(1, "Employee ID is required").max(50),
  full_name: z.string().trim().min(1, "Full name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  department: z.string().trim().min(1, "Department is required"),
});

const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations", "Design", "Support"];

export default function Employees() {
  const { data: employees, isLoading } = useEmployees();
  const addEmployee = useAddEmployee();
  const deleteEmployee = useDeleteEmployee();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ employee_id: "", full_name: "", email: "", department: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = employees?.filter(
    (e) =>
      e.full_name.toLowerCase().includes(search.toLowerCase()) ||
      e.employee_id.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = employeeSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    await addEmployee.mutateAsync(result.data as { employee_id: string; full_name: string; email: string; department: string });
    setForm({ employee_id: "", full_name: "", email: "", department: "" });
    setOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="page-header">Employees</h1>
          <p className="page-description">Manage your team members</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">Add New Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div>
                <Label htmlFor="employee_id">Employee ID</Label>
                <Input id="employee_id" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} placeholder="EMP-001" />
                {errors.employee_id && <p className="text-xs text-destructive mt-1">{errors.employee_id}</p>}
              </div>
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="John Doe" />
                {errors.full_name && <p className="text-xs text-destructive mt-1">{errors.full_name}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@company.com" />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label>Department</Label>
                <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })}>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.department && <p className="text-xs text-destructive mt-1">{errors.department}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={addEmployee.isPending}>
                {addEmployee.isPending ? "Adding..." : "Add Employee"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div>
      ) : !filtered?.length ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">{search ? "No matching employees found" : "No employees yet. Add one to get started."}</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">ID</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Department</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr key={emp.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{emp.employee_id}</td>
                    <td className="px-4 py-3 font-medium">{emp.full_name}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{emp.email}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">{emp.department}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteEmployee.mutate(emp.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
