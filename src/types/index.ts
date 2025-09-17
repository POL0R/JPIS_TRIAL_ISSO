// Database types
export interface Sport {
  id: string;
  kind: 'FOOTBALL' | 'BASKETBALL';
  division: string; // e.g., 'U19', 'U17'
  gender: 'Boys' | 'Girls' | 'None';
  slug: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  sport_id: string;
  name: string;
  short_code: string;
  group_name?: string; // A, B, etc.
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  sport_id: string;
  stage: 'Group' | 'Quarterfinal' | 'Semifinal' | 'Final';
  starts_at: string; // ISO datetime
  venue: string;
  status: 'Upcoming' | 'Live' | 'Final';
  status_note?: string | null; // e.g., 'HT'
  home_team_id: string;
  away_team_id: string;
  home_score: number;
  away_score: number;
  created_at: string;
  updated_at: string;
  // Relations
  home_team?: Team;
  away_team?: Team;
  sport?: Sport;
}

export interface FootballGoal {
  id: string;
  match_id: string;
  team_id: string;
  player_name: string;
  minute: number;
  own_goal: boolean;
  created_by: string;
  created_at: string;
  // Relations
  team?: Team;
}

export interface Profile {
  id: string;
  user_id: string;
  role: 'Viewer' | 'Scorer' | 'Admin';
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  approved: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  team?: Team;
  profile?: Profile;
}

export interface TopScorer {
  player_name: string;
  team_name: string;
  team_short_code: string;
  goals: number;
}

// UI State types
export interface MatchFilters {
  teamId?: string;
  date?: string; // YYYY-MM-DD format
  stage?: 'Group' | 'Quarterfinal' | 'Semifinal' | 'Final';
}

export interface ScoreboardState {
  sport: Sport | null;
  teams: Team[];
  matches: Match[];
  topScorers: TopScorer[];
  filters: MatchFilters;
  loading: boolean;
  error: string | null;
}

// Auth types
export interface User {
  id: string;
  email?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  teamMemberships: TeamMember[];
  loading: boolean;
}

// Permission types
export interface PermissionCheck {
  canEditMatch: (matchId: string) => boolean;
  canApproveRequests: boolean;
  canSetRoles: boolean;
  canFinalizeMatch: (matchId: string) => boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  error: string | null;
}

// Form types
export interface BasketballScoreForm {
  homeScore: number;
  awayScore: number;
}

export interface FootballGoalForm {
  teamId: string;
  playerName: string;
  minute: number;
  ownGoal: boolean;
}

export interface TeamPlayer {
  id: string;
  team_id: string;
  name: string;
  jersey_number?: number | null;
  created_at: string;
  updated_at: string;
}

// Route params
export interface ScoreboardParams {
  slug: string;
}

// Query params for filters
export interface ScoreboardSearchParams {
  team?: string;
  date?: string;
  stage?: string;
}
