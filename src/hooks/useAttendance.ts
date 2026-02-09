import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  status: string;
  created_at: string;
}

export function useAttendance(employeeId?: string) {
  return useQuery({
    queryKey: ["attendance", employeeId],
    queryFn: async () => {
      let query = supabase.from("attendance").select("*").order("date", { ascending: false });
      if (employeeId) query = query.eq("employee_id", employeeId);
      const { data, error } = await query;
      if (error) throw error;
      return data as AttendanceRecord[];
    },
    enabled: !!employeeId,
  });
}

export function useMarkAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (record: { employee_id: string; date: string; status: string }) => {
      const { data, error } = await supabase
        .from("attendance")
        .upsert(record, { onConflict: "employee_id,date" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["attendance"] });
      toast({ title: "Attendance marked" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message || "Failed to mark attendance", variant: "destructive" });
    },
  });
}
