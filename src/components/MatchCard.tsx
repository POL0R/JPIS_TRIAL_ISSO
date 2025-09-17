import { format } from 'date-fns';
import type { Match } from '../types';

interface MatchCardProps {
  match: Match;
  canEdit: boolean;
  canEditStatus: boolean;
  onEditClick: () => void;
}

const MatchCard = ({ match, canEdit, canEditStatus, onEditClick }: MatchCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-gray-100 text-gray-800';
      case 'Live':
        return 'bg-red-100 text-red-800';
      case 'Final':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Group':
        return 'bg-blue-100 text-blue-800';
      case 'Quarterfinal':
        return 'bg-purple-100 text-purple-800';
      case 'Semifinal':
        return 'bg-orange-100 text-orange-800';
      case 'Final':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Match Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}
              >
                {match.status}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(match.stage)}`}
              >
                {match.stage}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {format(new Date(match.starts_at), 'MMM dd, yyyy')} at{' '}
              {format(new Date(match.starts_at), 'HH:mm')}
            </div>
          </div>

          {/* Teams and Score */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <p className="font-semibold text-gray-900">{match.home_team?.name}</p>
                  <p className="text-sm text-gray-600">{match.home_team?.short_code}</p>
                </div>
                
                <div className="px-4">
                  <div className="text-3xl font-bold text-gray-900">
                    {match.home_score} - {match.away_score}
                  </div>
                </div>
                
                <div className="text-center flex-1">
                  <p className="font-semibold text-gray-900">{match.away_team?.name}</p>
                  <p className="text-sm text-gray-600">{match.away_team?.short_code}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Venue */}
          <div className="mt-3 text-sm text-gray-600">
            📍 {match.venue}
          </div>
        </div>

        {/* Edit Button (always visible for admins; editor enforces final lock) */}
        {canEdit && (
          <div className="mt-4 md:mt-0 md:ml-6">
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEditClick(); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit Score
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
