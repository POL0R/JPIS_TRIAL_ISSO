import { useState, useEffect } from 'react';
import type { Team, MatchFilters as MatchFiltersType } from '../types';

interface MatchFiltersProps {
  teams: Team[];
  filters: MatchFiltersType;
  onFiltersChange: (filters: Partial<MatchFiltersType>) => void;
}

const MatchFilters = ({ teams, filters, onFiltersChange }: MatchFiltersProps) => {
  // Tournament window: 18–22 September 2025 (inclusive)
  const MIN_DATE = '2025-09-18';
  const MAX_DATE = '2025-09-22';
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof MatchFiltersType, value: string | undefined) => {
    let nextValue = value;
    if (key === 'date' && value) {
      if (value < MIN_DATE) nextValue = MIN_DATE;
      if (value > MAX_DATE) nextValue = MAX_DATE;
    }
    const newFilters = { ...localFilters, [key]: nextValue };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { teamId: undefined, date: undefined, stage: undefined };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = localFilters.teamId || localFilters.date || localFilters.stage;

  return (
    <div className="rounded-xl2 p-4 shadow-soft border border-white/10 bg-limePrimary/15 text-textPrimary">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        <div className="flex flex-col md:flex-row gap-4 flex-1 md:justify-end">
          {/* Team Filter: horizontal scroll of circular logos */}


          {/* Date Filter removed; using DateStrip above */}

          {/* Stage Filter */}
          <div className="min-w-0 flex-1 md:max-w-xs">
            <label htmlFor="stage-filter" className="block text-sm font-medium text-textPrimary/80 mb-1">
              Stage
            </label>
            <select
              id="stage-filter"
              value={localFilters.stage || ''}
              onChange={(e) => handleFilterChange('stage', e.target.value || undefined)}
              className="w-full px-3 py-2 rounded-md bg-bgDark border border-white/10 focus:outline-none focus:ring-2 focus:ring-limePrimary/50"
            >
              <option value="">All Stages</option>
              <option value="Group">Group</option>
              <option value="Quarterfinal">Quarterfinal</option>
              <option value="Semifinal">Semifinal</option>
              <option value="Final">Final</option>
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm rounded-full bg-limePrimary text-bgDark hover:opacity-90 transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchFilters;
