import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    },
  });
}

export function usePeople(teamId?: string) {
  return useQuery({
    queryKey: ['people', teamId],
    queryFn: async () => {
      let query = supabase
        .from('people')
        .select('*')
        .order('name');

      if (teamId) {
        query = query.eq('team_id', teamId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useBehaviors(teamId?: string) {
  return useQuery({
    queryKey: ['behaviors', teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('behaviors')
        .select('*')
        .order('display_order');

      if (error) throw error;

      // Filtra: comportamenti core + comportamenti specifici del team
      if (teamId) {
        return data.filter(b => b.type === 'core' || b.team_id === teamId);
      }

      return data;
    },
  });
}
