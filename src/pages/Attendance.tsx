import { useState } from "react";
import { CalendarCheck, CheckCircle2, XCircle } from "lucide-react";
import { useEmployees } from "@/hooks/useEmployees";
import { useAttendance, useMarkAttendance } from "@/hooks/useAttendance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function Attendance() {
  const { data: employees, isLoading: empLoading } = useEmployees();
  const [selectedEmp, setSelectedEmp] = useState<string>("");
  const { data: records, isLoading: attLoading } = useAttendance(selectedEmp);
  const markAttendance = useMarkAttendance();
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [status, setStatus] = useState<string>("Present");

  const presentCount = records?.filter((r) => r.status === "Present").length ?? 0;
  const absentCount = records?.filter((r) => r.status === "Absent").length ?? 0;

  const handleMark = async () => {
    if (!selectedEmp || !date || !status) return;
    await markAttendance.mutateAsync({ employee_id: selectedEmp, date, status });
  };

  const selectedEmployee = employees?.find((e) => e.id === selectedEmp);

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-header">Attendance</h1>
        <p className="page-description">Track daily employee attendance</p>
      </div>

      {/* Mark attendance form */}
      <div className="bg-card rounded-xl border border-border p-5 mb-6">
        <h2 className="text-base font-semibold font-display mb-4">Mark Attendance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <Label>Employee</Label>
            <Select value={selectedEmp} onValueChange={setSelectedEmp}>
              <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
              <SelectContent>
                {empLoading ? (
                  <div className="p-2 text-sm text-muted-foreground">Loading...</div>
                ) : employees?.length ? (
                  employees.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.full_name} ({e.employee_id})
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground">No employees</div>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Present">Present</SelectItem>
                <SelectItem value="Absent">Absent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleMark} disabled={!selectedEmp || markAttendance.isPending}>
            {markAttendance.isPending ? "Saving..." : "Mark"}
          </Button>
        </div>
      </div>

      {/* Attendance records */}
      {selectedEmp && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="stat-card flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Present</p>
                <p className="text-xl font-bold font-display">{presentCount}</p>
              </div>
            </div>
            <div className="stat-card flex items-center gap-3">
              <XCircle className="w-5 h-5 text-destructive" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Absent</p>
                <p className="text-xl font-bold font-display">{absentCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border">
              <h3 className="text-sm font-semibold">
                Records for {selectedEmployee?.full_name}
              </h3>
            </div>
            {attLoading ? (
              <div className="p-4 space-y-2">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
              </div>
            ) : !records?.length ? (
              <div className="text-center py-12">
                <CalendarCheck className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No attendance records yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r) => (
                      <tr key={r.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3">{format(new Date(r.date), "MMM dd, yyyy")}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                            r.status === "Present"
                              ? "bg-success/10 text-success"
                              : "bg-destructive/10 text-destructive"
                          }`}>
                            {r.status === "Present" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {!selectedEmp && (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <CalendarCheck className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Select an employee to view and mark attendance</p>
        </div>
      )}
    </div>
  );
}
