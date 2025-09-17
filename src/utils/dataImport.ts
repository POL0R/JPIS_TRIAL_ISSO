import { supabase } from '../lib/supabase';
import type { Sport, Team, Match } from '../types';

// This is a utility for importing data from Excel files
// In a real implementation, you would use a library like xlsx to parse Excel files

export const importSportData = async (sportSlug: string, teams: any[], matches: any[]) => {
  try {
    // Get the sport
    const { data: sport, error: sportError } = await supabase
      .from('sports')
      .select('*')
      .eq('slug', sportSlug)
      .single();

    if (sportError) throw sportError;
    if (!sport) throw new Error('Sport not found');

    // Import teams
    const teamMap = new Map<string, string>();
    
    for (const teamData of teams) {
      const { data: existingTeam } = await supabase
        .from('teams')
        .select('id')
        .eq('sport_id', sport.id)
        .eq('short_code', teamData.short_code)
        .single();

      if (existingTeam) {
        teamMap.set(teamData.short_code, existingTeam.id);
      } else {
        const { data: newTeam, error: teamError } = await supabase
          .from('teams')
          .insert({
            sport_id: sport.id,
            name: teamData.name,
            short_code: teamData.short_code,
            group_name: teamData.group_name
          })
          .select()
          .single();

        if (teamError) throw teamError;
        teamMap.set(teamData.short_code, newTeam.id);
      }
    }

    // Import matches
    for (const matchData of matches) {
      const homeTeamId = teamMap.get(matchData.home_team_code);
      const awayTeamId = teamMap.get(matchData.away_team_code);

      if (!homeTeamId || !awayTeamId) {
        console.warn(`Skipping match: team not found`, matchData);
        continue;
      }

      // Check if match already exists
      const { data: existingMatch } = await supabase
        .from('matches')
        .select('id')
        .eq('sport_id', sport.id)
        .eq('home_team_id', homeTeamId)
        .eq('away_team_id', awayTeamId)
        .eq('starts_at', matchData.starts_at)
        .single();

      if (!existingMatch) {
        const { error: matchError } = await supabase
          .from('matches')
          .insert({
            sport_id: sport.id,
            stage: matchData.stage,
            starts_at: matchData.starts_at,
            venue: matchData.venue,
            status: 'Upcoming',
            home_team_id: homeTeamId,
            away_team_id: awayTeamId,
            home_score: 0,
            away_score: 0
          });

        if (matchError) {
          console.error('Error importing match:', matchError);
        }
      }
    }

    console.log(`Successfully imported data for ${sport.name}`);
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
};

// Example data structure for import
export const exampleFootballTeams = [
  { name: 'JPIS', short_code: 'JPIS', group_name: 'A' },
  { name: 'Team B', short_code: 'TB', group_name: 'A' },
  // ... more teams
];

export const exampleFootballMatches = [
  {
    home_team_code: 'JPIS',
    away_team_code: 'TB',
    stage: 'Group',
    starts_at: '2025-09-19T10:00:00Z',
    venue: 'Main Field'
  },
  // ... more matches
];

// Usage example:
// await importSportData('football-u19', exampleFootballTeams, exampleFootballMatches);
