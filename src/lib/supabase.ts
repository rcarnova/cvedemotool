import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Types ───────────────────────────────────────────────────────────────────

export type EvalLevel = "training" | "on_track" | "example";

export interface Team {
  id: string;
  name: string;
  manager_id: string;
  created_at: string;
}

export interface Person {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  team_id: string;
}

export interface Behavior {
  id: string;
  name: string;
  category: "dna" | "team";
  description: string;
  indicators: string[];
}

export interface Evaluation {
  id: string;
  person_id: string;
  behavior_id: string;
  level: EvalLevel;
  evaluated_by: string;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  person_id: string;
  behavior_id: string;
  text: string;
  level: EvalLevel;
  author: "manager" | "employee";
  created_at: string;
}

// ─── RPC response types ──────────────────────────────────────────────────────

export interface CompanyOverviewRow {
  team_name: string;
  manager_name: string;
  behavior_name: string;
  training_count: number;
  on_track_count: number;
  example_count: number;
  total_evaluated: number;
}

export interface TeamComparisonRow {
  team_name: string;
  manager_name: string;
  avg_score: number;
  total_evaluations: number;
  strongest_behavior: string;
  weakest_behavior: string;
}
