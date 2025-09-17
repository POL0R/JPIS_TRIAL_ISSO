import type { Team } from '../types';

interface TeamScrollerProps {
  teams: Team[];
  selectedTeamId?: string;
  onChange: (teamId?: string) => void;
}

const TeamScroller = ({ teams, selectedTeamId, onChange }: TeamScrollerProps) => {
  return (
    <div className="w-full overflow-x-auto overflow-y-hidden team-scroller no-scrollbar touch-pan-x">
      <div className="flex items-stretch gap-4 pb-2 min-w-max whitespace-nowrap">
        <button
          onClick={() => onChange(undefined)}
          className={`flex flex-col items-center justify-center w-20 shrink-0 ${!selectedTeamId ? 'ring-2 ring-limePrimary rounded-2xl' : ''}`}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${!selectedTeamId ? 'bg-limePrimary text-bgDark' : 'bg-white/10 text-textPrimary'}`}>
            <span className="text-sm font-semibold">All</span>
          </div>
          <div className="mt-2 text-xs text-textPrimary/80">All Teams</div>
        </button>

        {teams.map((team) => {
          const active = selectedTeamId === team.id;
          const label = team.short_code || (team.name ? team.name.substring(0, 3).toUpperCase() : 'TM');
          return (
            <button
              key={team.id}
              onClick={() => onChange(team.id)}
              className={`flex flex-col items-center justify-center w-20 shrink-0 ${active ? 'ring-2 ring-limePrimary rounded-2xl' : ''}`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${active ? 'bg-limePrimary text-bgDark' : 'bg-white/10 text-textPrimary'}`}>
                <span className="text-base font-bold">{label}</span>
              </div>
              <div className="mt-2 text-xs text-center text-textPrimary/80 truncate w-20">{team.name}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TeamScroller;


