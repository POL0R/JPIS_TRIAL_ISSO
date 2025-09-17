import { format } from 'date-fns';
import type { Match } from '../types';

const UpcomingTile = ({ match, onClick }: { match: Match; onClick?: () => void }) => {
  const day = format(new Date(match.starts_at), 'EEE, dd MMM');
  const time = format(new Date(match.starts_at), 'hh:mm a');
  const isFinal = match.status === 'Final';
  const isLive = match.status === 'Live';
  const note = isLive ? (match.status_note === 'HT' ? 'Half Time' : match.status_note || '') : '';
  return (
    <button onClick={onClick} className="w-full text-left rounded-xl2 bg-surfaceDeep text-textPrimary px-6 py-6 shadow-soft hover:bg-surface transition min-h-32">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 text-lg">
            <span className="w-7 h-7 rounded-full bg-textPrimary/15" />
            <span className="font-semibold truncate">{match.home_team?.name}</span>
          </div>
          <div className="flex items-center gap-3 mt-3 text-lg">
            <span className="w-7 h-7 rounded-full bg-textPrimary/15" />
            <span className="font-semibold truncate">{match.away_team?.name}</span>
          </div>
        </div>
        <div className="pl-6 ml-6 border-l border-white/10 text-right shrink-0 min-w-[110px]">
          {isFinal || isLive ? (
            <div className="flex flex-col items-end gap-1">
              <span className="px-3 py-1 rounded-md bg-textPrimary/10 text-textPrimary text-sm">{match.home_score}</span>
              <span className="px-3 py-1 rounded-md bg-textPrimary/10 text-textPrimary text-sm">{match.away_score}</span>
              {note && <span className="mt-1 text-xs text-textPrimary/80">{note}</span>}
            </div>
          ) : (
            <>
              <div className="opacity-80 text-sm">{day}</div>
              <div className="text-2xl font-bold">{time}</div>
            </>
          )}
        </div>
      </div>
    </button>
  );
};

export default UpcomingTile;


