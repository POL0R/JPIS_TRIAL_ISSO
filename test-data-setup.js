// Quick test data setup script
// Run this in your browser console after setting up Supabase

// Test teams for Football U19
const footballTeams = [
  { name: 'JPIS', short_code: 'JPIS', group_name: 'A' },
  { name: 'Team B', short_code: 'TB', group_name: 'A' },
  { name: 'Team C', short_code: 'TC', group_name: 'B' },
  { name: 'Team D', short_code: 'TD', group_name: 'B' }
];

// Test matches
const footballMatches = [
  {
    home_team_code: 'JPIS',
    away_team_code: 'TB',
    stage: 'Group',
    starts_at: '2025-09-19T10:00:00Z',
    venue: 'Main Field'
  },
  {
    home_team_code: 'TC',
    away_team_code: 'TD',
    stage: 'Group',
    starts_at: '2025-09-19T12:00:00Z',
    venue: 'Field 2'
  }
];

console.log('Test data ready. Use these in your import function.');
