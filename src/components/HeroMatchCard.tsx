import { format } from 'date-fns';
import type { Match } from '../types';

interface HeroMatchCardProps {
  match: Match;
  onEdit?: () => void;
}

const HeroMatchCard = ({ match, onEdit }: HeroMatchCardProps) => {
  const kickoff = format(new Date(match.starts_at), 'EEE, dd MMM • hh:mm a');
  const isLive = match.status === 'Live';
  const statusChip = isLive ? (
    <span className="px-3 py-1 rounded-full bg-liveRed/20 text-liveRed text-xs md:text-sm">LIVE</span>
  ) : (
    <span className="px-3 py-1 rounded-full bg-textPrimary/10 text-textPrimary text-xs md:text-sm">{match.status}</span>
  );
  const note = match.status === 'Live' ? (match.status_note === 'HT' ? 'Half Time' : match.status_note || '') : '';
  const noteChip = note ? (
    <span className="px-2 py-0.5 rounded-full bg-white/10 text-textPrimary text-xs md:text-sm">{note}</span>
  ) : null;

  const cardClasses = `rounded-xl2 bg-surface shadow-soft text-textPrimary relative overflow-hidden ${isLive ? 'ring-2 ring-liveRed/40' : ''}`;

  return (
    <div className={cardClasses}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_60%)] pointer-events-none" />
      <div className={`relative p-6 md:p-10 ${isLive ? 'min-h-72 md:min-h-80' : 'min-h-56 md:min-h-64'}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            {statusChip}
            {noteChip}
            <span className="opacity-70 text-sm md:text-base">{kickoff}</span>
          </div>
          {onEdit && (
            <button onClick={onEdit} className="px-4 py-2 rounded-full bg-accentGreen hover:bg-accentGreen/90 text-white">Edit</button>
          )}
        </div>

        <div className="mt-6 grid grid-cols-3 items-center">
          <div className="text-right pr-4">
            <div className="text-xl md:text-2xl font-semibold truncate">{match.home_team?.name}</div>
            <div className="opacity-70 text-sm">Home</div>
          </div>

          <div className="text-center">
            <div className={`font-extrabold ${isLive ? 'text-5xl md:text-6xl' : 'text-4xl md:text-5xl'}`}>{match.home_score} - {match.away_score}</div>
            <div className="opacity-70 text-sm mt-1">📍 {match.venue}</div>
          </div>

          <div className="pl-4">
            <div className="text-xl md:text-2xl font-semibold truncate">{match.away_team?.name}</div>
            <div className="opacity-70 text-sm">Away</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroMatchCard;


