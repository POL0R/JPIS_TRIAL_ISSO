import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Match, MatchFilters } from '../types';

// Simplified version without joins for debugging
export const useMatchesSimple = (sportId: string, filters: MatchFilters = {}) => {
  return useQuery({
    queryKey: ['matches-simple', { sportId, ...filters }],
    queryFn: async (): Promise<Match[]> => {
      let query = supabase
        .from('matches')
        .select('*')
        .eq('sport_id', sportId)
        .order('starts_at', { ascending: true });
      
      // Apply filters
      if (filters.teamId) {
        query = query.or(`home_team_id.eq.${filters.teamId},away_team_id.eq.${filters.teamId}`);
      }
      
      if (filters.date) {
        const startOfDay = new Date(filters.date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(filters.date);
        endOfDay.setHours(23, 59, 59, 999);
        
        query = query
          .gte('starts_at', startOfDay.toISOString())
          .lte('starts_at', endOfDay.toISOString());
      }
      
      if (filters.stage) {
        query = query.eq('stage', filters.stage);
      }
      
      const { data, error } = await query;
      if (error) {
        console.error('Matches query error:', error);
        throw error;
      }
      
      console.log('Raw matches data:', data);
      return data || [];
    },
    enabled: !!sportId,
    staleTime: 30 * 1000,
  });
};
