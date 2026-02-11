import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, type Evaluation, type Note, type EvalLevel } from "@/lib/supabase";

// ─── Fetch evaluations for a person ─────────────────────────────────────────

export function useEvaluations(personId: string | null) {
  return useQuery({
    queryKey: ["evaluations", personId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("evaluations")
        .select("*")
        .eq("person_id", personId!);
      if (error) throw error;
      return data as Evaluation[];
    },
    enabled: !!personId,
  });
}

// ─── Fetch all evaluations for a team ────────────────────────────────────────

export function useTeamEvaluations(personIds: string[]) {
  return useQuery({
    queryKey: ["evaluations", "team", personIds],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("evaluations")
        .select("*")
        .in("person_id", personIds);
      if (error) throw error;
      return data as Evaluation[];
    },
    enabled: personIds.length > 0,
  });
}

// ─── Save or update an evaluation (upsert) ──────────────────────────────────

export function useSaveEvaluation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      personId,
      behaviorId,
      level,
      evaluatedBy,
    }: {
      personId: string;
      behaviorId: string;
      level: EvalLevel;
      evaluatedBy: string;
    }) => {
      const { data, error } = await supabase
        .from("evaluations")
        .upsert(
          {
            person_id: personId,
            behavior_id: behaviorId,
            level,
            evaluated_by: evaluatedBy,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "person_id,behavior_id" }
        )
        .select()
        .single();
      if (error) throw error;
      return data as Evaluation;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["evaluations", variables.personId] });
      queryClient.invalidateQueries({ queryKey: ["evaluations", "team"] });
    },
  });
}

// ─── Fetch notes for a person ────────────────────────────────────────────────

export function useNotes(personId: string | null) {
  return useQuery({
    queryKey: ["notes", personId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("person_id", personId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Note[];
    },
    enabled: !!personId,
  });
}

// ─── Save a new note ─────────────────────────────────────────────────────────

export function useSaveNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      personId,
      behaviorId,
      text,
      level,
      author,
    }: {
      personId: string;
      behaviorId: string;
      text: string;
      level: EvalLevel;
      author: "manager" | "employee";
    }) => {
      const { data, error } = await supabase
        .from("notes")
        .insert({
          person_id: personId,
          behavior_id: behaviorId,
          text,
          level,
          author,
        })
        .select()
        .single();
      if (error) throw error;
      return data as Note;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notes", variables.personId] });
    },
  });
}
