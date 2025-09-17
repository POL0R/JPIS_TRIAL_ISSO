// Debug script to test Supabase queries
// Run this in your browser console

import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2';

const supabaseUrl = 'https://rapomzbwiyqgxtzilclz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhcG9temJ3aXlxZ3h0emlsY2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMDE4NDAsImV4cCI6MjA3MzU3Nzg0MH0.CKyQPN6rtNrtbAfowF8_GEKD-m_RyYSrTGJzs6wauhw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugMatches() {
    console.log('🔍 Debugging Supabase queries...');
    
    try {
        // Test 1: Get sports
        console.log('\n1. Testing sports...');
        const { data: sports, error: sportsError } = await supabase
            .from('sports')
            .select('*');
        
        if (sportsError) {
            console.error('❌ Sports error:', sportsError);
            return;
        }
        
        console.log('✅ Sports found:', sports?.length || 0);
        console.log('Sports:', sports);
        
        if (sports?.length === 0) {
            console.log('⚠️ No sports found. Run database-schema.sql first.');
            return;
        }
        
        const footballSport = sports.find(s => s.slug === 'football-u19');
        if (!footballSport) {
            console.log('❌ Football sport not found');
            return;
        }
        
        console.log('✅ Football sport found:', footballSport);
        
        // Test 2: Get teams
        console.log('\n2. Testing teams...');
        const { data: teams, error: teamsError } = await supabase
            .from('teams')
            .select('*')
            .eq('sport_id', footballSport.id);
        
        if (teamsError) {
            console.error('❌ Teams error:', teamsError);
            return;
        }
        
        console.log('✅ Teams found:', teams?.length || 0);
        
        // Test 3: Get matches (simple query first)
        console.log('\n3. Testing matches (simple)...');
        const { data: matchesSimple, error: matchesSimpleError } = await supabase
            .from('matches')
            .select('*')
            .eq('sport_id', footballSport.id);
        
        if (matchesSimpleError) {
            console.error('❌ Simple matches error:', matchesSimpleError);
            return;
        }
        
        console.log('✅ Simple matches found:', matchesSimple?.length || 0);
        
        // Test 4: Get matches with joins
        console.log('\n4. Testing matches with joins...');
        const { data: matchesWithJoins, error: matchesJoinsError } = await supabase
            .from('matches')
            .select(`
                *,
                home_team:teams!home_team_id(*),
                away_team:teams!away_team_id(*),
                sport:sports!sport_id(*)
            `)
            .eq('sport_id', footballSport.id);
        
        if (matchesJoinsError) {
            console.error('❌ Matches with joins error:', matchesJoinsError);
            console.log('This is likely the issue!');
            return;
        }
        
        console.log('✅ Matches with joins found:', matchesWithJoins?.length || 0);
        console.log('Sample match:', matchesWithJoins?.[0]);
        
        if (matchesWithJoins?.length === 0) {
            console.log('⚠️ No matches found. Import match data using the SQL files.');
        } else {
            console.log('🎉 Everything is working! The issue might be in the React app.');
        }
        
    } catch (error) {
        console.error('❌ Unexpected error:', error);
    }
}

debugMatches();
