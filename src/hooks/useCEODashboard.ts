import { useQuery } from "@tanstack/react-query";
import {
  supabase,
  type CompanyOverviewRow,
  type TeamComparisonRow,
} from "@/lib/supabase";

// ─── Company overview (all teams × behaviors) ────────────────────────────────

export function useCompanyOverview() {
  return useQuery({
    queryKey: ["ceo", "company-overview"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_company_overview");
      if (error) throw error;
      return data as CompanyOverviewRow[];
    },
  });
}

// ─── Team comparison (ranking / benchmarking) ────────────────────────────────

export function useTeamComparison() {
  return useQuery({
    queryKey: ["ceo", "team-comparison"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_team_comparison");
      if (error) throw error;
      return data as TeamComparisonRow[];
    },
  });
}
