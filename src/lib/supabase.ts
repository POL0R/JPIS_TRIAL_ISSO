import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types (will be generated from Supabase)
export type Database = {
  public: {
    Tables: {
      sports: {
        Row: {
          id: string;
          kind: 'FOOTBALL' | 'BASKETBALL';
          division: string;
          gender: 'Boys' | 'Girls' | 'None';
          slug: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          kind: 'FOOTBALL' | 'BASKETBALL';
          division: string;
          gender: 'Boys' | 'Girls' | 'None';
          slug: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          kind?: 'FOOTBALL' | 'BASKETBALL';
          division?: string;
          gender?: 'Boys' | 'Girls' | 'None';
          slug?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      teams: {
        Row: {
          id: string;
          sport_id: string;
          name: string;
          short_code: string;
          group_name?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sport_id: string;
          name: string;
          short_code: string;
          group_name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sport_id?: string;
          name?: string;
          short_code?: string;
          group_name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      matches: {
        Row: {
          id: string;
          sport_id: string;
          stage: 'Group' | 'Quarterfinal' | 'Semifinal' | 'Final';
          starts_at: string;
          venue: string;
          status: 'Upcoming' | 'Live' | 'Final';
          home_team_id: string;
          away_team_id: string;
          home_score: number;
          away_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sport_id: string;
          stage: 'Group' | 'Quarterfinal' | 'Semifinal' | 'Final';
          starts_at: string;
          venue: string;
          status?: 'Upcoming' | 'Live' | 'Final';
          home_team_id: string;
          away_team_id: string;
          home_score?: number;
          away_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sport_id?: string;
          stage?: 'Group' | 'Quarterfinal' | 'Semifinal' | 'Final';
          starts_at?: string;
          venue?: string;
          status?: 'Upcoming' | 'Live' | 'Final';
          home_team_id?: string;
          away_team_id?: string;
          home_score?: number;
          away_score?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      football_goals: {
        Row: {
          id: string;
          match_id: string;
          team_id: string;
          player_name: string;
          minute: number;
          own_goal: boolean;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          match_id: string;
          team_id: string;
          player_name: string;
          minute: number;
          own_goal?: boolean;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          match_id?: string;
          team_id?: string;
          player_name?: string;
          minute?: number;
          own_goal?: boolean;
          created_by?: string;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          role: 'Viewer' | 'Scorer' | 'Admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role?: 'Viewer' | 'Scorer' | 'Admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: 'Viewer' | 'Scorer' | 'Admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      team_members: {
        Row: {
          id: string;
          team_id: string;
          user_id: string;
          approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          user_id: string;
          approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          user_id?: string;
          approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      football_top_scorers: {
        Row: {
          player_name: string;
          team_name: string;
          team_short_code: string;
          goals: number;
        };
      };
    };
    Functions: {
      set_basketball_score: {
        Args: {
          match_id: string;
          home_score: number;
          away_score: number;
        };
        Returns: {
          success: boolean;
          message: string;
        };
      };
      add_football_goal: {
        Args: {
          match_id: string;
          team_id: string;
          player_name: string;
          minute: number;
          own_goal?: boolean;
        };
        Returns: {
          success: boolean;
          message: string;
        };
      };
      finalize_match: {
        Args: {
          match_id: string;
        };
        Returns: {
          success: boolean;
          message: string;
        };
      };
      user_can_edit_match: {
        Args: {
          match_id: string;
        };
        Returns: boolean;
      };
    };
  };
};
