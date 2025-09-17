import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Team } from '../types';

export const useTeams = (sportId?: string) => {
  return useQuery({
    queryKey: ['teams', sportId],
    queryFn: async (): Promise<Team[]> => {
      let query = supabase
        .from('teams')
        .select('*')
        .order('name');
      
      if (sportId) {
        query = query.eq('sport_id', sportId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!sportId,
    staleTime: 5 * 60 * 1000,
  });
};
