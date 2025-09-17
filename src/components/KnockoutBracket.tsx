import type { Match, Team } from '../types';

interface KnockoutBracketProps {
  matches: Match[];
  teams: Team[];
}

const KnockoutBracket = ({ matches, teams }: KnockoutBracketProps) => {
  const qfAll = matches.filter(m => m.stage === 'Quarterfinal');
  const qfLeft = qfAll.slice(0,2);
  const qfRight = qfAll.slice(2,4);
  const sfAll = matches.filter(m => m.stage === 'Semifinal');
  const sfLeft = sfAll.slice(0,1);
  const sfRight = sfAll.slice(1,2);
  const final = matches.filter(m => m.stage === 'Final').slice(0,1);

  const teamName = (id: string) => teams.find(t => t.id === id)?.short_code || teams.find(t => t.id === id)?.name || '—';

  const Placeholder = ({ label }: { label: string }) => (
    <div className="rounded-xl2 bg-white/5 text-textPrimary/70 px-4 py-3 min-w-[190px] shadow-soft border border-white/10">
      <div className="text-xs uppercase tracking-wider">{label}</div>
    </div>
  );

  const Node = ({ m, placeholder }: { m?: Match; placeholder?: string }) => (
    <div className="rounded-xl2 bg-surfaceDeep text-textPrimary px-4 py-3 min-w-[190px] shadow-soft">
      {m ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="truncate pr-2 font-semibold">{teamName(m.home_team_id)}</span>
            <span className="px-2 py-0.5 rounded bg-white/10 min-w-[28px] text-center">{m.home_score ?? '—'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="truncate pr-2 font-semibold">{teamName(m.away_team_id)}</span>
            <span className="px-2 py-0.5 rounded bg-white/10 min-w-[28px] text-center">{m.away_score ?? '—'}</span>
          </div>
        </div>
      ) : (
        <div className="text-xs uppercase tracking-wider text-textPrimary/70">{placeholder || 'TBD'}</div>
      )}
    </div>
  );

  const winner = (m?: Match, fallback?: string) => {
    if (!m) return fallback || 'Winner';
    if (m.home_score == null || m.away_score == null) return fallback || 'Winner';
    if (m.home_score > m.away_score) return teamName(m.home_team_id);
    if (m.away_score > m.home_score) return teamName(m.away_team_id);
    return fallback || 'Winner';
  };

  const ColTitle = ({ children }: { children: string }) => (
    <div className="text-xs tracking-wider text-textPrimary/70 uppercase mb-2">{children}</div>
  );

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-max grid grid-cols-[1fr_1fr_auto_1fr_1fr] items-center gap-x-10 py-6">
        {/* Left QF */}
        <div className="space-y-6 relative">
          <ColTitle>Quarter Finals</ColTitle>
          {qfLeft.map((m,i) => (
            <div key={`lqf-${i}`} className="flex items-center gap-3">
              <Node m={m} />
              <div className="h-0.5 w-6 bg-white/20" />
            </div>
          ))}
          {/* vertical connector */}
          <div className="absolute right-[-12px] top-[42px] bottom-[42px] w-0.5 bg-white/20" />
        </div>

        {/* Left SF */}
        <div className="space-y-24">
          <ColTitle>Semi Finals</ColTitle>
          {sfLeft.length ? (
            sfLeft.map((m,i) => (
              <div key={`lsf-${i}`} className="flex items-center gap-3">
                <Node m={m} />
                <div className="h-0.5 w-6 bg-white/20" />
              </div>
            ))
          ) : (
            <div className="flex items-center gap-3">
              <Node placeholder={`Winner of ${winner(qfLeft[0],'QF L1')} vs ${winner(qfLeft[1],'QF L2')}`} />
              <div className="h-0.5 w-6 bg-white/20" />
            </div>
          )}
        </div>

        {/* Final */}
        <div className="flex flex-col items-center">
          <ColTitle>Final</ColTitle>
          {final.length ? (
            <Node m={final[0]} />
          ) : (
            <Node placeholder={`Winner of ${winner(sfLeft[0],'SF L')} vs ${winner(sfRight[0],'SF R')}`} />
          )}
        </div>

        {/* Right SF */}
        <div className="space-y-24">
          <ColTitle>Semi Finals</ColTitle>
          {sfRight.length ? (
            sfRight.map((m,i) => (
              <div key={`rsf-${i}`} className="flex items-center gap-3">
                <div className="h-0.5 w-6 bg-white/20" />
                <Node m={m} />
              </div>
            ))
          ) : (
            <div className="flex items-center gap-3">
              <div className="h-0.5 w-6 bg-white/20" />
              <Node placeholder={`Winner of ${winner(qfRight[0],'QF R1')} vs ${winner(qfRight[1],'QF R2')}`} />
            </div>
          )}
        </div>

        {/* Right QF */}
        <div className="space-y-6 relative">
          <ColTitle>Quarter Finals</ColTitle>
          {qfRight.map((m,i) => (
            <div key={`rqf-${i}`} className="flex items-center gap-3">
              <div className="h-0.5 w-6 bg-white/20" />
              <Node m={m} />
            </div>
          ))}
          {/* vertical connector */}
          <div className="absolute left-[-12px] top-[42px] bottom-[42px] w-0.5 bg-white/20" />
        </div>
      </div>
    </div>
  );
};

export default KnockoutBracket;


