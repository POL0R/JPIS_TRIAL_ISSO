import { useParams, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSportBySlug } from '../hooks/useSports';
import { useTeams } from '../hooks/useTeams';
import { useMatches } from '../hooks/useMatches';
import { useMatchesSimple } from '../hooks/useMatchesSimple';
import { useMatchesWithTeams } from '../hooks/useMatchesWithTeams';
import { useTopScorers } from '../hooks/useFootballGoals';
import { usePermissions } from '../hooks/usePermissions';
import MatchCard from '../components/MatchCard';
import HeaderBar from '../components/HeaderBar';
import HeroMatchCard from '../components/HeroMatchCard';
import UpcomingTile from '../components/UpcomingTile';
import MatchDetails from '../components/MatchDetails';
import MatchFilters from '../components/MatchFilters';
import DateStrip from '../components/DateStrip';
import TeamScroller from '../components/TeamScroller';
import TopScorersPanel from '../components/TopScorersPanel';
import GroupTables from '../components/GroupTables';
import KnockoutBracket from '../components/KnockoutBracket';
import BasketballScoreEditor from '../components/BasketballScoreEditor';
import FootballScoreEditor from '../components/FootballScoreEditor';
import type { MatchFilters as MatchFiltersType } from '../types';

const ScoreboardPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'games' | 'leaders' | 'groups' | 'knockout'>('games');
  const [page, setPage] = useState(1);
  const pageSize = 5;
  
  // Get sport data
  const { data: sport, isLoading: sportLoading, error: sportError } = useSportBySlug(slug || '');
  
  // Get teams for this sport
  const { data: teams = [] } = useTeams(sport?.id);
  
  // Parse filters from URL
  const filters: MatchFiltersType = {
    teamId: searchParams.get('team') || undefined,
    date: searchParams.get('date') || undefined,
    stage: (searchParams.get('stage') as any) || undefined,
  };
  
  // Get matches with filters and team data
  const { 
    data: matches = [], 
    isLoading: matchesLoading, 
    error: matchesError 
  } = useMatchesWithTeams(sport?.id || '', filters);
  
  // Get top scorers for football
  const { data: topScorers = [] } = useTopScorers(sport?.id || '');
  
  const { canEditMatch, canEditMatchStatus } = usePermissions();

  // Update URL when filters change
  const updateFilters = (newFilters: Partial<MatchFiltersType>) => {
    const updatedFilters = { ...filters, ...newFilters };
    const params = new URLSearchParams();
    
    if (updatedFilters.teamId) params.set('team', updatedFilters.teamId);
    if (updatedFilters.date) params.set('date', updatedFilters.date);
    if (updatedFilters.stage) params.set('stage', updatedFilters.stage);
    
    setSearchParams(params);
  };

  // Debug logging
  console.log('ScoreboardPage Debug:', {
    sport,
    sportLoading,
    sportError,
    matches,
    matchesLoading,
    matchesError,
    filters
  });

  if (sportLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading scoreboard...</p>
        </div>
      </div>
    );
  }

  if (sportError || !sport) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Sport Not Found</h1>
          <p className="text-gray-600">The requested sport could not be found.</p>
        </div>
      </div>
    );
  }

  const isFootball = sport.kind === 'FOOTBALL';
  const liveMatches = matches.filter(m => m.status === 'Live');
  const list = matches.filter(m => m.status !== 'Live');
  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const start = (page - 1) * pageSize;
  const pagedMatches = list.slice(start, start + pageSize);

  return (
    <div className="min-h-screen bg-bgDark">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className={isFootball ? 'rounded-xl2 p-0.5 bg-footballGrad' : ''}>
          <div className={isFootball ? 'rounded-xl2 bg-limeGrad text-bgDark' : ''}>
            <HeaderBar title={sport.name} subtitle="Live scores and standings" />
          </div>
        </div>

        {/* Filters - only on Games view */}
        {viewMode === 'games' && (
          <div className="mb-6">
            <MatchFilters
              teams={teams}
              filters={filters}
              onFiltersChange={updateFilters}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Date strip and Team scroller only on Games view */}
            {viewMode === 'games' && (
              <>
                <DateStrip
                  selectedDate={filters.date}
                  onChange={(d) => updateFilters({ date: d })}
                  minDate={'2025-09-18'}
                  maxDate={'2025-09-22'}
                />
                <TeamScroller
                  teams={teams}
                  selectedTeamId={filters.teamId}
                  onChange={(teamId) => updateFilters({ teamId })}
                />
              </>
            )}
            {/* Highlight ALL live matches */}
            {viewMode === 'games' && liveMatches.length > 0 && (
              <div className="space-y-4">
                {liveMatches.map((lm) => (
                  <div key={lm.id} className={isFootball ? 'rounded-xl2 p-0.5 bg-footballGrad' : ''}>
                    <HeroMatchCard match={lm} onEdit={() => setSelectedMatch(lm.id)} />
                  </div>
                ))}
              </div>
            )}
            {/* Games list / Leaders / Groups / Knockout */}
            {viewMode === 'leaders' && isFootball ? (
              <div className="space-y-4">
                <TopScorersPanel topScorers={topScorers} />
              </div>
            ) : viewMode === 'groups' && isFootball ? (
              <GroupTables teams={teams} matches={matches} />
            ) : viewMode === 'knockout' && isFootball ? (
              <KnockoutBracket teams={teams} matches={matches} />
            ) : matchesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading matches...</p>
              </div>
            ) : matchesError ? (
              <div className="text-center py-8">
                <p className="text-red-600">Error loading matches</p>
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No matches found for the selected filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pagedMatches.map((m) => (
                  <div key={m.id}>
                    <UpcomingTile match={m} onClick={() => setSelectedMatch(m.id)} />
                  </div>
                ))}

                <div className="flex items-center justify-between pt-2">
                  <button
                    className="px-3 py-1.5 rounded-full bg-surfaceDeep text-textPrimary/80 hover:bg-surface"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                  <div className="text-textPrimary/70 text-sm">Page {page} / {totalPages}</div>
                  <button
                    className="px-3 py-1.5 rounded-full bg-surfaceDeep text-textPrimary/80 hover:bg-surface"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right controls: Stage dropdown */}
          <div className="flex justify-end">
            <div>
              <label className="block text-sm font-medium text-textPrimary/80 mb-1">Stage</label>
              <select
                value={filters.stage || ''}
                onChange={(e) => updateFilters({ stage: (e.target.value || undefined) as any })}
                className="px-3 py-2 rounded-md bg-bgDark border border-white/10 text-textPrimary focus:outline-none focus:ring-2 focus:ring-limePrimary/50"
              >
                <option value="">All Stages</option>
                <option value="Group">Group</option>
                <option value="Quarterfinal">Quarterfinal</option>
                <option value="Semifinal">Semifinal</option>
                <option value="Final">Final</option>
              </select>
            </div>
          </div>
        </div>
        

        {/* Details for viewers, editor for admins */}
        {selectedMatch && (
          <div>
            {canEditMatch({} as any) ? (
              isFootball ? (
                <FootballScoreEditor matchId={selectedMatch} onClose={() => setSelectedMatch(null)} />
              ) : (
                <BasketballScoreEditor matchId={selectedMatch} onClose={() => setSelectedMatch(null)} />
              )
            ) : (
              <MatchDetails matchId={selectedMatch} isFootball={isFootball} onClose={() => setSelectedMatch(null)} />
            )}
          </div>
        )}
      </div>
      {/* Bottom switcher (games <-> top scorers) */}
      {isFootball && (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-full bg-surface/80 backdrop-blur shadow-soft border border-white/10">
            <button
              className={`px-4 py-1.5 rounded-full text-sm ${viewMode==='games' ? 'bg-limePrimary text-bgDark' : 'text-textPrimary/80 hover:text-textPrimary'}`}
              onClick={() => setViewMode('games')}
            >
              Games
            </button>
            <button
              className={`px-4 py-1.5 rounded-full text-sm ${viewMode==='leaders' ? 'bg-limePrimary text-bgDark' : 'text-textPrimary/80 hover:text-textPrimary'}`}
              onClick={() => setViewMode('leaders')}
            >
              Top Scorers
            </button>
            <button
              className={`px-4 py-1.5 rounded-full text-sm ${viewMode==='groups' ? 'bg-limePrimary text-bgDark' : 'text-textPrimary/80 hover:text-textPrimary'}`}
              onClick={() => setViewMode('groups')}
            >
              Group Tables
            </button>
            <button
              className={`px-4 py-1.5 rounded-full text-sm ${viewMode==='knockout' ? 'bg-limePrimary text-bgDark' : 'text-textPrimary/80 hover:text-textPrimary'}`}
              onClick={() => setViewMode('knockout')}
            >
              Knockout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreboardPage;
