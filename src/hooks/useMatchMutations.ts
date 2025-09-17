import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { BasketballScoreForm, FootballGoalForm } from '../types';

export const useBasketballScoreMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ matchId, playerName, jerseyNumber, teamId }: { matchId: string; playerName: string; jerseyNumber?: number | null; teamId?: string }) => {
      // Upsert basketball award (highest scorer of the game)
      const { data: authData, error: authErr } = await supabase.auth.getUser();
      if (authErr) throw authErr;

      const { data, error } = await supabase
        .from('basketball_awards')
        .upsert({
          match_id: matchId,
          team_id: teamId ?? null,
          player_name: playerName,
          jersey_number: jerseyNumber ?? null,
          created_by: authData.user?.id || null,
        }, { onConflict: 'match_id' })
        .select('id')
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch match data
      queryClient.invalidateQueries({ queryKey: ['match', variables.matchId] });
      queryClient.invalidateQueries({
        predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === 'matchesWithTeams',
      });
    },
  });
};

export const useFootballGoalMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      matchId, 
      teamId, 
      playerName, 
      minute, 
      ownGoal 
    }: { matchId: string } & FootballGoalForm) => {
      // 1) Get match teams
      const { data: match, error: matchErr } = await supabase
        .from('matches')
        .select('home_team_id, away_team_id, status')
        .eq('id', matchId)
        .single();
      if (matchErr) throw matchErr;

      const { data: authData, error: authErr } = await supabase.auth.getUser();
      if (authErr) throw authErr;

      // 2) Insert goal row
      const { error: insertErr } = await supabase
        .from('football_goals')
        .insert({
          match_id: matchId,
          team_id: teamId,
          player_name: playerName,
          minute: minute,
          own_goal: ownGoal || false,
          created_by: authData.user?.id || null,
        });
      if (insertErr) throw insertErr;

      // 3) Fetch all goals for this match
      const { data: goals, error: goalsErr } = await supabase
        .from('football_goals')
        .select('team_id, own_goal')
        .eq('match_id', matchId);
      if (goalsErr) throw goalsErr;

      // 4) Recompute scores client-side
      const homeId = match.home_team_id;
      const awayId = match.away_team_id;
      let homeScore = 0;
      let awayScore = 0;
      for (const g of goals || []) {
        if (g.team_id === homeId && !g.own_goal) homeScore += 1;
        if (g.team_id === awayId && g.own_goal) homeScore += 1;
        if (g.team_id === awayId && !g.own_goal) awayScore += 1;
        if (g.team_id === homeId && g.own_goal) awayScore += 1;
      }

      // 5) Update match scores and status
      const nextStatus = match.status === 'Upcoming' ? 'Live' : match.status;
      const { data: upd, error: updErr } = await supabase
        .from('matches')
        .update({ home_score: homeScore, away_score: awayScore, status: nextStatus })
        .eq('id', matchId)
        .select('id')
        .single();
      if (updErr) throw updErr;

      return upd;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch match data and goals
      queryClient.invalidateQueries({ queryKey: ['match', variables.matchId] });
      queryClient.invalidateQueries({ queryKey: ['football-goals', variables.matchId] });
      queryClient.invalidateQueries({ queryKey: ['top-scorers'] });
      queryClient.invalidateQueries({
        predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === 'matchesWithTeams',
      });
    },
  });
};

export const useFinalizeMatchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (matchId: string) => {
      const { data, error } = await supabase
        .from('matches')
        .update({ status: 'Final' })
        .eq('id', matchId)
        .select('id')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, matchId) => {
      // Invalidate and refetch match data
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['match', matchId] });
    },
  });
};

export const useMatchStatusNoteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ matchId, status, note }: { matchId: string; status: 'Live' | 'Upcoming' | 'Final'; note?: string | null }) => {
      const { data, error } = await supabase
        .from('matches')
        .update({ status, status_note: note ?? null })
        .eq('id', matchId)
        .select('id')
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['match', variables.matchId] });
      queryClient.invalidateQueries({ predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === 'matchesWithTeams' });
    },
  });
};

