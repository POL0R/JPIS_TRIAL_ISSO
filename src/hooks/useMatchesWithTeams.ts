import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Match, MatchFilters } from '../types';

export const useMatchesWithTeams = (sportId: string, filters: MatchFilters = {}) => {
  return useQuery({
    queryKey: ['matchesWithTeams', { sportId, ...filters }],
    queryFn: async (): Promise<Match[]> => {
      // First get matches
      let matchesQuery = supabase
        .from('matches')
        .select('*')
        .eq('sport_id', sportId)
        .order('starts_at', { ascending: true });
      
      // Apply filters
      if (filters.teamId) {
        matchesQuery = matchesQuery.or(`home_team_id.eq.${filters.teamId},away_team_id.eq.${filters.teamId}`);
      }
      
      if (filters.date) {
        const startOfDay = new Date(filters.date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(filters.date);
        endOfDay.setHours(23, 59, 59, 999);
        
        matchesQuery = matchesQuery
          .gte('starts_at', startOfDay.toISOString())
          .lte('starts_at', endOfDay.toISOString());
      }
      
      if (filters.stage) {
        matchesQuery = matchesQuery.eq('stage', filters.stage);
      }
      
      const { data: matches, error: matchesError } = await matchesQuery;
      if (matchesError) {
        console.error('Matches query error:', matchesError);
        throw matchesError;
      }
      
      if (!matches || matches.length === 0) {
        return [];
      }
      
      // Get all unique team IDs
      const teamIds = new Set<string>();
      matches.forEach(match => {
        teamIds.add(match.home_team_id);
        teamIds.add(match.away_team_id);
      });
      
      // Get teams data
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .in('id', Array.from(teamIds));
      
      if (teamsError) {
        console.error('Teams query error:', teamsError);
        throw teamsError;
      }
      
      // Get sport data
      const { data: sport, error: sportError } = await supabase
        .from('sports')
        .select('*')
        .eq('id', sportId)
        .single();
      
      if (sportError) {
        console.error('Sport query error:', sportError);
        throw sportError;
      }
      
      // Combine matches with team data
      const matchesWithTeams: Match[] = matches.map(match => ({
        ...match,
        home_team: teams?.find(team => team.id === match.home_team_id),
        away_team: teams?.find(team => team.id === match.away_team_id),
        sport: sport
      }));
      
      console.log('Matches with teams:', matchesWithTeams);
      return matchesWithTeams;
    },
    enabled: !!sportId,
    staleTime: 30 * 1000,
  });
};
