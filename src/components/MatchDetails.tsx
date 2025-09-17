import { createPortal } from 'react-dom';
import { format } from 'date-fns';
import { useMatch } from '../hooks/useMatches';
import { useFootballGoals } from '../hooks/useFootballGoals';
import { useTeamPlayers } from '../hooks/usePlayers';
import { useMemo } from 'react';

interface MatchDetailsProps {
  matchId: string;
  isFootball: boolean;
  onClose: () => void;
}

const MatchDetails = ({ matchId, isFootball, onClose }: MatchDetailsProps) => {
  const { data: match, isLoading, error } = useMatch(matchId);
  const { data: goals = [] } = useFootballGoals(matchId);
  // Unconditional hooks before any return to keep order stable
  const homeTeamId = match?.home_team_id;
  const awayTeamId = match?.away_team_id;
  const { data: homePlayers = [] } = useTeamPlayers(homeTeamId);
  const { data: awayPlayers = [] } = useTeamPlayers(awayTeamId);
  const homeJersey = useMemo(() => {
    const map = new Map<string, number | null>();
    homePlayers.forEach(p => map.set(p.name, p.jersey_number ?? null));
    return map;
  }, [homePlayers]);
  const awayJersey = useMemo(() => {
    const map = new Map<string, number | null>();
    awayPlayers.forEach(p => map.set(p.name, p.jersey_number ?? null));
    return map;
  }, [awayPlayers]);

  // (removed duplicated declarations)

  if (isLoading) {
    return createPortal(
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2147483647,
        }}
      >
        <div className="bg-white rounded-xl2 p-6 max-w-2xl w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-2 text-gray-600">Loading match...</p>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  if (error || !match) {
    return createPortal(
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2147483647,
        }}
      >
        <div className="bg-white rounded-xl2 p-6 max-w-2xl w-full mx-4 text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Unable to load match</h3>
          <button onClick={onClose} className="px-4 py-2 bg-gray-700 text-white rounded-full">Close</button>
        </div>
      </div>,
      document.body
    );
  }

  const kickoff = format(new Date(match.starts_at), 'EEE, dd MMM • hh:mm a');

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2147483647,
      }}
    >
      <div className="bg-surface text-textPrimary rounded-xl2 p-6 md:p-8 w-full max-w-3xl mx-4 shadow-soft">
        <div className="flex justify-between items-start mb-4">
          <div className="text-textPrimary/80 text-sm">{kickoff} • {match.venue}</div>
          <button onClick={onClose} className="text-textPrimary/70 hover:text-textPrimary">✕</button>
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          <div className="text-right pr-4">
            <div className="text-xl font-semibold truncate">{match.home_team?.name}</div>
            <div className="opacity-70 text-sm">Home</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold">{match.home_score} - {match.away_score}</div>
            <div className="opacity-70 text-sm mt-1">{match.stage}</div>
          </div>
          <div className="pl-4">
            <div className="text-xl font-semibold truncate">{match.away_team?.name}</div>
            <div className="opacity-70 text-sm">Away</div>
          </div>
        </div>

        {isFootball && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-3">Goals</h4>
            {goals.length === 0 ? (
              <p className="text-textPrimary/70">No goals yet.</p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {goals.map((g) => {
                  const jersey = g.team_id === homeTeamId ? homeJersey.get(g.player_name) : awayJersey.get(g.player_name);
                  return (
                  <div key={g.id} className="flex items-center justify-between p-3 rounded-lg bg-surfaceDeep">
                    <div>
                      <div className="font-medium">
                        {g.player_name}{jersey != null ? ` #${jersey}` : ''}
                        {g.own_goal && <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">OG</span>}
                      </div>
                      <div className="text-sm text-textPrimary/70">{g.team?.name}</div>
                    </div>
                    <div className="text-right text-limePrimary font-bold">{g.minute}'</div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default MatchDetails;


