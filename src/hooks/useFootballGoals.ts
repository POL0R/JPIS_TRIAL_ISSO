import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { FootballGoal, TopScorer } from '../types';

export const useFootballGoals = (matchId: string) => {
  return useQuery({
    queryKey: ['football-goals', matchId],
    queryFn: async (): Promise<FootballGoal[]> => {
      const { data, error } = await supabase
        .from('football_goals')
        .select(`
          *,
          team:teams!team_id(*)
        `)
        .eq('match_id', matchId)
        .order('minute', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!matchId,
    staleTime: 30 * 1000,
  });
};

export const useTopScorers = (sportId: string) => {
  return useQuery({
    queryKey: ['top-scorers', sportId],
    queryFn: async (): Promise<TopScorer[]> => {
      const { data, error } = await supabase
        .from('football_top_scorers')
        .select('*')
        .order('goals', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!sportId,
    staleTime: 60 * 1000, // 1 minute
  });
};
