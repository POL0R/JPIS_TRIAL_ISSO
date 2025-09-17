// Import script for matches
// Run this in your browser console after setting up Supabase

import { importSportData } from './src/utils/dataImport.js';

// Example data - replace with your actual data
const footballTeams = [
  { name: 'JPIS', short_code: 'JPIS', group_name: 'A' },
  { name: 'Team B', short_code: 'TB', group_name: 'A' },
  { name: 'Team C', short_code: 'TC', group_name: 'B' },
  { name: 'Team D', short_code: 'TD', group_name: 'B' }
];

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
  },
  {
    home_team_code: 'JPIS',
    away_team_code: 'TC',
    stage: 'Group',
    starts_at: '2025-09-20T10:00:00Z',
    venue: 'Main Field'
  },
  {
    home_team_code: 'TB',
    away_team_code: 'TD',
    stage: 'Group',
    starts_at: '2025-09-20T12:00:00Z',
    venue: 'Field 2'
  }
];

// Import the data
try {
  await importSportData('football-u19', footballTeams, footballMatches);
  console.log('✅ Football data imported successfully!');
} catch (error) {
  console.error('❌ Error importing data:', error);
}
