import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useMatch } from '../hooks/useMatches';
import { useFootballGoals } from '../hooks/useFootballGoals';
import { useTeamPlayers, useUpsertPlayer } from '../hooks/usePlayers';
import { useFootballGoalMutation, useMatchStatusNoteMutation } from '../hooks/useMatchMutations';
import { useFinalizeMatchMutation } from '../hooks/useMatchMutations';
import { usePermissions } from '../hooks/usePermissions';
import Toast from './Toast';

interface FootballScoreEditorProps {
  matchId: string;
  onClose: () => void;
}

const FootballScoreEditor = ({ matchId, onClose }: FootballScoreEditorProps) => {
  const { data: match, isLoading, error: matchError } = useMatch(matchId);
  const { data: goals = [] } = useFootballGoals(matchId);
  const { isAdmin } = usePermissions();
  
  const [playerName, setPlayerName] = useState('');
  const [minute, setMinute] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [ownGoal, setOwnGoal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away'>('home');
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [savedPlayerMinutes, setSavedPlayerMinutes] = useState<Record<string, string>>({});

  console.log('FootballScoreEditor render:', { matchId, match, isLoading, matchError, isAdmin });

  const goalMutation = useFootballGoalMutation();
  const finalizeMutation = useFinalizeMatchMutation();
  const statusNoteMutation = useMatchStatusNoteMutation();
  const upsertPlayer = useUpsertPlayer();

  const currentTeamId = match ? (selectedTeam === 'home' ? match.home_team_id : match.away_team_id) : undefined;
  const { data: teamPlayers = [] } = useTeamPlayers(currentTeamId);

  // Auto-fill jersey when selecting an existing player name
  useEffect(() => {
    const existing = teamPlayers.find((p) => p.name === playerName.trim());
    if (existing && existing.jersey_number != null) {
      setJerseyNumber(String(existing.jersey_number));
    }
  }, [playerName, teamPlayers]);

  const handleQuickAddGoal = async (player: { id: string; name: string }) => {
    if (!match || !currentTeamId) return;
    const minuteStr = savedPlayerMinutes[player.id] || '';
    const minuteNum = parseInt(minuteStr);
    if (isNaN(minuteNum) || minuteNum < 0 || minuteNum > 120) {
      setError('Provide a valid minute (0-120) for quick add');
      return;
    }
    setError(null);
    try {
      await goalMutation.mutateAsync({
        matchId,
        teamId: currentTeamId,
        playerName: player.name,
        minute: minuteNum,
        ownGoal: false,
      });
      setToast({ message: `Goal added for ${player.name}!`, type: 'success' });
      setSavedPlayerMinutes((prev) => ({ ...prev, [player.id]: '' }));
    } catch (err: any) {
      setError(err.message || 'Failed to add goal');
      setToast({ message: err.message || 'Failed to add goal', type: 'error' });
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Player name is required');
      return;
    }

    const minuteNum = parseInt(minute);
    if (isNaN(minuteNum) || minuteNum < 0 || minuteNum > 120) {
      setError('Minute must be between 0 and 120');
      return;
    }

    if (!match) return;

    const teamId = selectedTeam === 'home' ? match.home_team_id : match.away_team_id;

    try {
      const existing = teamPlayers.find((p) => p.name === playerName.trim());

      // Jersey number is compulsory for new players
      let jerseyNumToSave: number | null = null;
      if (existing) {
        jerseyNumToSave = existing.jersey_number ?? (jerseyNumber ? parseInt(jerseyNumber) : null);
      } else {
        if (!jerseyNumber) {
          setError('Jersey number is required for new players');
          return;
        }
        const jn = parseInt(jerseyNumber);
        if (isNaN(jn) || jn < 0 || jn > 99) {
          setError('Jersey number must be between 0 and 99');
          return;
        }
        jerseyNumToSave = jn;
      }

      // Save/Update player directory entry
      await upsertPlayer.mutateAsync({ teamId, name: playerName, jerseyNumber: jerseyNumToSave });

      await goalMutation.mutateAsync({
        matchId,
        teamId,
        playerName: playerName.trim(),
        minute: minuteNum,
        ownGoal
      });
      
      // Reset form
      setPlayerName('');
      setMinute('');
      setOwnGoal(false);
      setJerseyNumber('');
      setError(null);
      setToast({ message: 'Goal added successfully!', type: 'success' });
    } catch (err: any) {
      setError(err.message || 'Failed to add goal');
      setToast({ message: err.message || 'Failed to add goal', type: 'error' });
    }
  };

  const handleFinalize = async () => {
    if (!isAdmin) return;
    
    try {
      await finalizeMutation.mutateAsync(matchId);
      setToast({ message: 'Match finalized successfully!', type: 'success' });
      setTimeout(() => onClose(), 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to finalize match');
      setToast({ message: err.message || 'Failed to finalize match', type: 'error' });
    }
  };

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
        <div className="rounded-xl2 bg-surface text-white p-6 max-w-2xl w-full mx-4 shadow-soft">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-white/80">Loading match...</p>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  if (matchError || !match) {
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
        <div className="rounded-xl2 bg-surface text-white p-6 max-w-2xl w-full mx-4 shadow-soft">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Error</h3>
            <p className="text-white/80 mb-4">
              {matchError?.message || 'Match not found'}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-accentGreen text-white rounded-full hover:bg-accentGreen/90"
            >
              Close
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  }

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
      <div className="rounded-xl2 bg-surface text-white p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-soft">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Edit Football Score</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Match Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="font-medium text-gray-900">{match.home_team?.name}</p>
            <p className="text-sm text-gray-600">vs</p>
            <p className="font-medium text-gray-900">{match.away_team?.name}</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {match.home_score} - {match.away_score}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {match.stage} • {match.venue}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Goal Form */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Goal</h3>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="home"
                      checked={selectedTeam === 'home'}
                      onChange={(e) => setSelectedTeam(e.target.value as 'home')}
                      className="mr-2"
                    />
                    {match.home_team?.name}
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="away"
                      checked={selectedTeam === 'away'}
                      onChange={(e) => setSelectedTeam(e.target.value as 'away')}
                      className="mr-2"
                    />
                    {match.away_team?.name}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Player Name
                </label>
                <input
                  type="text"
                  list="team-player-suggestions"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter player for ${selectedTeam === 'home' ? match.home_team?.short_code : match.away_team?.short_code}`}
                />
                <datalist id="team-player-suggestions">
                  {teamPlayers.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.jersey_number ? `#${p.jersey_number} ` : ''}{p.name}
                    </option>
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jersey Number (optional)</label>
                <input
                  type="number"
                  min="0"
                  value={jerseyNumber}
                  onChange={(e) => setJerseyNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minute
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0-120"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={ownGoal}
                    onChange={(e) => setOwnGoal(e.target.checked)}
                    className="mr-2"
                  />
                  Own Goal
                </label>
              </div>

              <button
                type="submit"
                disabled={goalMutation.isPending}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                {goalMutation.isPending ? 'Adding Goal...' : 'Add Goal'}
              </button>
            </form>
          </div>

          {/* Goals List + Saved Players Quick Add */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Events</h3>
            {goals.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No goals scored yet</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {goal.player_name}
                        {goal.own_goal && (
                          <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            OG
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-600">
                        {goal.team?.name} • {goal.minute}'
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Saved Players for this team */}
            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Saved Players ({selectedTeam === 'home' ? match.home_team?.short_code : match.away_team?.short_code})</h4>
              {teamPlayers.length === 0 ? (
                <p className="text-gray-600 text-sm">No saved players yet. Adding a goal will save the name.</p>
              ) : (
                <div className="space-y-2">
                  {teamPlayers.map((p) => (
                    <div key={p.id} className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        max="120"
                        value={savedPlayerMinutes[p.id] || ''}
                        onChange={(e) => setSavedPlayerMinutes((prev) => ({ ...prev, [p.id]: e.target.value }))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="min"
                      />
                      <button
                        type="button"
                        onClick={() => handleQuickAddGoal(p)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        + {p.name}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Match Status Quick Actions */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={async () => {
              try {
                await statusNoteMutation.mutateAsync({ matchId, status: 'Live', note: null });
                setToast({ message: 'Match set to Live', type: 'success' });
              } catch (e: any) {
                setToast({ message: e.message || 'Failed to set Live', type: 'error' });
              }
            }}
            className="px-3 py-2 rounded-md bg-white/10 hover:bg-white/15"
          >
            Start Game
          </button>
          <button
            type="button"
            onClick={async () => {
              try {
                await statusNoteMutation.mutateAsync({ matchId, status: 'Live', note: 'HT' });
                setToast({ message: 'Half Time set', type: 'success' });
              } catch (e: any) {
                setToast({ message: e.message || 'Failed to set HT', type: 'error' });
              }
            }}
            className="px-3 py-2 rounded-md bg-white/10 hover:bg-white/15"
          >
            Half Time
          </button>
          <button
            type="button"
            onClick={async () => {
              try {
                await statusNoteMutation.mutateAsync({ matchId, status: 'Live', note: '2nd Half' });
                setToast({ message: '2nd Half set', type: 'success' });
              } catch (e: any) {
                setToast({ message: e.message || 'Failed to set 2nd Half', type: 'error' });
              }
            }}
            className="px-3 py-2 rounded-md bg-white/10 hover:bg-white/15"
          >
            2nd Half
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          
          {isAdmin && match.status !== 'Final' && (
            <button
              onClick={handleFinalize}
              disabled={finalizeMutation.isPending}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-gray-400 transition-colors"
            >
              {finalizeMutation.isPending ? 'Finalizing...' : 'Finalize Match'}
            </button>
          )}
        </div>
      </div>
      
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>,
    document.body
  );
};

export default FootballScoreEditor;
