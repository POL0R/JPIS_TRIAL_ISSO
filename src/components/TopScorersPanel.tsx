import type { TopScorer } from '../types';

interface TopScorersPanelProps {
  topScorers: TopScorer[];
}

const TopScorersPanel = ({ topScorers }: TopScorersPanelProps) => {
  return (
    <div className="rounded-xl2 bg-surface shadow-soft p-6 text-textPrimary">
      <h3 className="text-lg font-semibold mb-4">Top Scorers</h3>
      
      {topScorers.length === 0 ? (
        <p className="text-textPrimary/70 text-center py-4">No goals scored yet</p>
      ) : (
        <div className="space-y-3">
          {topScorers.slice(0, 10).map((scorer, index) => (
            <div
              key={`${scorer.player_name}-${scorer.team_short_code}`}
              className="flex items-center justify-between p-3 rounded-lg bg-surfaceDeep"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <span className="text-lg font-bold text-textPrimary/60">
                    #{index + 1}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{scorer.player_name}</p>
                  <p className="text-sm text-textPrimary/70">{scorer.team_name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-limePrimary">{scorer.goals}</p>
                <p className="text-xs text-textPrimary/60">goals</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopScorersPanel;
