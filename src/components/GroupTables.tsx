import type { Match, Team } from '../types';

type Row = {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  draw: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
};

interface GroupTablesProps {
  teams: Team[];
  matches: Match[]; // pass all matches for the sport (we filter inside)
}

const GroupTables = ({ teams, matches }: GroupTablesProps) => {
  // Filter only group matches that are completed (avoid counting scheduled games)
  const groupMatches = (matches || []).filter(
    (m) => m.stage === 'Group' && m.status === 'Final'
  );

  // Build standings per group
  const groupToRows = new Map<string, Map<string, Row>>();

  const ensureRow = (group: string, team: Team) => {
    const g = groupToRows.get(group) || new Map<string, Row>();
    if (!groupToRows.has(group)) groupToRows.set(group, g);
    if (!g.has(team.id)) {
      g.set(team.id, {
        teamId: team.id,
        teamName: team.name,
        played: 0,
        won: 0,
        draw: 0,
        lost: 0,
        gf: 0,
        ga: 0,
        gd: 0,
        pts: 0,
      });
    }
    return g.get(team.id)!;
  };

  // Seed all teams by group so they appear even if no games yet
  teams.forEach(team => {
    const group = team.group_name || 'Unassigned';
    ensureRow(group, team);
  });

  groupMatches.forEach(m => {
    const home = teams.find(t => t.id === m.home_team_id);
    const away = teams.find(t => t.id === m.away_team_id);
    if (!home || !away) return;
    const group = home.group_name || away.group_name || 'Unassigned';
    const hr = ensureRow(group, home);
    const ar = ensureRow(group, away);

    // Only count if we have non-null scores and this is a completed match
    if (m.home_score == null || m.away_score == null) return;

    hr.played += 1; ar.played += 1;
    hr.gf += m.home_score; hr.ga += m.away_score; hr.gd = hr.gf - hr.ga;
    ar.gf += m.away_score; ar.ga += m.home_score; ar.gd = ar.gf - ar.ga;

    if (m.home_score > m.away_score) { hr.won += 1; ar.lost += 1; hr.pts += 3; }
    else if (m.home_score < m.away_score) { ar.won += 1; hr.lost += 1; ar.pts += 3; }
    else { hr.draw += 1; ar.draw += 1; hr.pts += 1; ar.pts += 1; }
  });

  const groups = Array.from(groupToRows.keys()).sort();

  return (
    <div className="space-y-6">
      {groups.map(group => {
        const rows = Array.from(groupToRows.get(group)!.values()).sort((a, b) => {
          if (b.pts !== a.pts) return b.pts - a.pts;
          if (b.gd !== a.gd) return b.gd - a.gd;
          return b.gf - a.gf;
        });
        return (
          <div key={group} className="rounded-xl2 bg-surface shadow-soft text-textPrimary">
            <div className="px-4 pt-3 pb-2 rounded-t-xl2 bg-gradient-to-r from-limePrimary/25 to-transparent flex items-center justify-between border-b border-white/10">
              <h3 className="text-lg font-semibold tracking-wide">Group {group}</h3>
              <div className="text-xs text-textPrimary/70">PTS • GD • GF/GA</div>
            </div>
            {/* Desktop/tablet table */}
            <div className="overflow-x-auto hidden md:block p-4">
              <table className="w-full table-fixed text-sm">
                <colgroup>
                  <col />
                  <col style={{ width: '3rem' }} />
                  <col style={{ width: '3rem' }} />
                  <col style={{ width: '3rem' }} />
                  <col style={{ width: '3rem' }} />
                  <col style={{ width: '3rem' }} />
                  <col style={{ width: '3rem' }} />
                  <col style={{ width: '3rem' }} />
                  <col style={{ width: '3.5rem' }} />
                </colgroup>
                <thead className="text-textPrimary/70">
                  <tr>
                    <th className="text-left py-2 pr-3">Team</th>
                    <th className="text-center px-1">P</th>
                    <th className="text-center px-1">W</th>
                    <th className="text-center px-1">D</th>
                    <th className="text-center px-1">L</th>
                    <th className="text-center px-1">GF</th>
                    <th className="text-center px-1">GA</th>
                    <th className="text-center px-1">GD</th>
                    <th className="text-center px-1">PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => (
                    <tr key={r.teamId} className="border-t border-white/10 align-middle hover:bg-white/5">
                      <td className="py-2 pr-3 whitespace-nowrap">{r.teamName}</td>
                      <td className="text-center px-1">{r.played}</td>
                      <td className="text-center px-1">{r.won}</td>
                      <td className="text-center px-1">{r.draw}</td>
                      <td className="text-center px-1">{r.lost}</td>
                      <td className="text-center px-1">{r.gf}</td>
                      <td className="text-center px-1">{r.ga}</td>
                      <td className="text-center px-1">{r.gd}</td>
                      <td className="text-center px-1 font-semibold">{r.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-2 p-4">
              {rows.map(r => (
                <div key={r.teamId} className="rounded-lg bg-surfaceDeep p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium truncate pr-2">{r.teamName}</div>
                    <div className="text-right">
                      <div className="text-xs text-textPrimary/70">PTS</div>
                      <div className="text-base font-semibold">{r.pts}</div>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-6 gap-2 text-xs text-textPrimary/80">
                    <div className="text-center"><div className="opacity-60">P</div><div className="font-medium">{r.played}</div></div>
                    <div className="text-center"><div className="opacity-60">W</div><div className="font-medium">{r.won}</div></div>
                    <div className="text-center"><div className="opacity-60">D</div><div className="font-medium">{r.draw}</div></div>
                    <div className="text-center"><div className="opacity-60">L</div><div className="font-medium">{r.lost}</div></div>
                    <div className="text-center"><div className="opacity-60">GF</div><div className="font-medium">{r.gf}</div></div>
                    <div className="text-center"><div className="opacity-60">GA</div><div className="font-medium">{r.ga}</div></div>
                  </div>
                  <div className="mt-2 text-right text-xs">GD: <span className="font-medium">{r.gd}</span></div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GroupTables;


