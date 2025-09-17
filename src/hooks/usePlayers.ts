import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { TeamPlayer } from '../types';

export const useTeamPlayers = (teamId?: string) => {
  return useQuery({
    queryKey: ['team-players', teamId],
    queryFn: async (): Promise<TeamPlayer[]> => {
      if (!teamId) return [];
      const { data, error } = await supabase
        .from('team_players')
        .select('*')
        .eq('team_id', teamId)
        .order('name', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!teamId,
    staleTime: 60_000,
  });
};

export const useUpsertPlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, name, jerseyNumber }: { teamId: string; name: string; jerseyNumber?: number | null }) => {
      const trimmed = name.trim();
      if (!trimmed) return null;
      const { data, error } = await supabase
        .from('team_players')
        .upsert({ team_id: teamId, name: trimmed, jersey_number: jerseyNumber ?? null }, { onConflict: 'team_id,name' })
        .select('id, team_id, name, jersey_number')
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['team-players', variables.teamId] });
    }
  });
};

export const useBasketballAwards = (sportId?: string) => {
  // leaderboards per sport (boys/girls divisions) can be queried by joining matches->sports later
  return {
    // placeholder for future: get leaderboard by counting player_name occurrences scoped to basketball sport
  };
};


