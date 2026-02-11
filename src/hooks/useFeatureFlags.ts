import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

type FeatureFlags = {
  peer_notes: boolean;
  employee_self_notes: boolean;
  ai_insights: boolean;
  ceo_dashboard: boolean;
};

export function useFeatureFlags() {
  return useQuery({
    queryKey: ['feature-flags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('id, enabled');

      if (error) throw error;

      // Converti array in oggetto { id: enabled }
      return data.reduce((acc, flag) => ({
        ...acc,
        [flag.id]: flag.enabled,
      }), {} as FeatureFlags);
    },
    // Cache per 5 minuti (i feature flags cambiano raramente)
    staleTime: 5 * 60 * 1000,
  });
}
