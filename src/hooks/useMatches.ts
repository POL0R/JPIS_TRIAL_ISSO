import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Match, MatchFilters } from '../types';

export const useMatches = (sportId: string, filters: MatchFilters = {}) => {
  return useQuery({
    queryKey: ['matches', { sportId, ...filters }],
    queryFn: async (): Promise<Match[]> => {
      let query = supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!home_team_id(*),
          away_team:teams!away_team_id(*),
          sport:sports!sport_id(*)
        `)
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
      if (error) throw error;
      return data || [];
    },
    enabled: !!sportId,
    staleTime: 30 * 1000, // 30 seconds for more frequent updates
    refetchInterval: 15 * 1000, // Refetch every 15 seconds
  });
};

export const useMatch = (matchId: string) => {
  return useQuery({
    queryKey: ['match', matchId],
    queryFn: async (): Promise<Match | null> => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!home_team_id(*),
          away_team:teams!away_team_id(*),
          sport:sports!sport_id(*)
        `)
        .eq('id', matchId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return data;
    },
    enabled: !!matchId,
    staleTime: 30 * 1000,
  });
};
