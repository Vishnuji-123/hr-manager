import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
  created_at: string;
}

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Employee[];
    },
  });
}

export function useAddEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (emp: Omit<Employee, "id" | "created_at">) => {
      const { data, error } = await supabase.from("employees").insert(emp).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
      toast({ title: "Employee added successfully" });
    },
    onError: (err: any) => {
      const msg = err.message?.includes("employees_employee_id_key")
        ? "Employee ID already exists"
        : err.message?.includes("employees_email_key")
        ? "Email already exists"
        : err.message || "Failed to add employee";
      toast({ title: "Error", description: msg, variant: "destructive" });
    },
  });
}

export function useDeleteEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("employees").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
      toast({ title: "Employee deleted" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete employee", variant: "destructive" });
    },
  });
}
