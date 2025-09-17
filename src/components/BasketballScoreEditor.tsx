import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useMatch } from '../hooks/useMatches';
import { useBasketballScoreMutation } from '../hooks/useMatchMutations';
import { useTeamPlayers, useUpsertPlayer } from '../hooks/usePlayers';
import { useFinalizeMatchMutation } from '../hooks/useMatchMutations';
import { usePermissions } from '../hooks/usePermissions';
import Toast from './Toast';

interface BasketballScoreEditorProps {
  matchId: string;
  onClose: () => void;
}

const BasketballScoreEditor = ({ matchId, onClose }: BasketballScoreEditorProps) => {
  const { data: match, isLoading, error: matchError } = useMatch(matchId);
  const { isAdmin } = usePermissions();
  const [playerName, setPlayerName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away'>('home');
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  console.log('BasketballScoreEditor render:', { matchId, match, isLoading, matchError, isAdmin });
  
  console.log('About to return JSX for BasketballScoreEditor');

  const scoreMutation = useBasketballScoreMutation();
  const upsertPlayer = useUpsertPlayer();
  const finalizeMutation = useFinalizeMatchMutation();

  const currentTeamId = match ? (selectedTeam === 'home' ? match.home_team_id : match.away_team_id) : undefined;
  const { data: teamPlayers = [] } = useTeamPlayers(currentTeamId);

  // Auto-fill jersey for existing player
  useEffect(() => {
    const existing = teamPlayers.find((p) => p.name === playerName.trim());
    if (existing && existing.jersey_number != null) {
      setJerseyNumber(String(existing.jersey_number));
    }
  }, [playerName, teamPlayers]);

  const handleSave = async () => {
    if (!playerName.trim()) {
      setError('Highest scorer name is required');
      return;
    }
    const teamId = currentTeamId;
    if (!teamId) return;

    // jersey required for new players
    const existing = teamPlayers.find((p) => p.name === playerName.trim());
    let jerseyNumToSave: number | null = existing?.jersey_number ?? null;
    if (!existing) {
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

    try {
      // Save player directory
      await upsertPlayer.mutateAsync({ teamId, name: playerName.trim(), jerseyNumber: jerseyNumToSave });

      // Save highest scorer for this match
      await scoreMutation.mutateAsync({
        matchId,
        playerName: playerName.trim(),
        jerseyNumber: jerseyNumToSave,
        teamId,
      });

      setToast({ message: 'Highest scorer saved!', type: 'success' });
      setTimeout(() => onClose(), 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to save highest scorer');
      setToast({ message: err.message || 'Failed to save highest scorer', type: 'error' });
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
        <div className="rounded-xl2 bg-surface text-white p-6 max-w-md w-full mx-4 shadow-soft">
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
        <div className="rounded-xl2 bg-surface text-white p-6 max-w-md w-full mx-4 shadow-soft">
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
      <div className="rounded-xl2 bg-surface text-white p-6 max-w-md w-full mx-4 shadow-soft">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Edit Score</h2>
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
            <p className="text-sm text-gray-600 mt-2">
              {match.stage} • {match.venue}
            </p>
          </div>
        </div>

        {/* Highest Scorer Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Team</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Highest Scorer</label>
            <input
              type="text"
              list="bb-player-suggestions"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter player for ${selectedTeam === 'home' ? match.home_team?.short_code : match.away_team?.short_code}`}
            />
            <datalist id="bb-player-suggestions">
              {teamPlayers.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.jersey_number ? `#${p.jersey_number} ` : ''}{p.name}
                </option>
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jersey Number</label>
            <input
              type="number"
              min="0"
              value={jerseyNumber}
              onChange={(e) => setJerseyNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          
          <div className="flex space-x-2">
            {isAdmin && match.status !== 'Final' && (
              <button
                onClick={handleFinalize}
                disabled={finalizeMutation.isPending}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-gray-400 transition-colors"
              >
                {finalizeMutation.isPending ? 'Finalizing...' : 'Finalize'}
              </button>
            )}
            
            <button
              onClick={handleSave}
              disabled={scoreMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {scoreMutation.isPending ? 'Saving...' : 'Save Highest Scorer'}
            </button>
          </div>
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

export default BasketballScoreEditor;
