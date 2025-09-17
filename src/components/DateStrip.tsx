import { format, eachDayOfInterval, parseISO } from 'date-fns';

interface DateStripProps {
  selectedDate?: string; // YYYY-MM-DD
  onChange: (date?: string) => void;
  minDate: string; // YYYY-MM-DD
  maxDate: string; // YYYY-MM-DD
}

const DateStrip = ({ selectedDate, onChange, minDate, maxDate }: DateStripProps) => {
  const start = parseISO(minDate);
  const end = parseISO(maxDate);
  const days = eachDayOfInterval({ start, end });

  const monthLabel = format(start, 'MMMM yyyy');

  return (
    <div className="rounded-xl2 bg-surfaceDeep/70 border border-white/10 px-4 py-3 text-textPrimary">
      <div className="flex items-center justify-between mb-2">
        <button className="px-2 py-1 rounded-full bg-white/5 text-textPrimary/80" disabled>
          ◀
        </button>
        <div className="font-semibold">{monthLabel}</div>
        <button className="px-2 py-1 rounded-full bg-white/5 text-textPrimary/80" disabled>
          ▶
        </button>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-1 date-strip-landscape">
        {/* All dates chip to clear date filter */}
        <button
          onClick={() => onChange(undefined)}
          className={`flex flex-col items-center justify-center w-14 h-16 rounded-2xl border date-strip-item ${!selectedDate ? 'bg-limePrimary text-bgDark border-transparent' : 'bg-white/5 text-textPrimary/85 border-white/10 hover:bg-white/10'}`}
        >
          <div className="text-xs opacity-80 weekday">All</div>
          <div className="text-lg font-semibold leading-none mt-1 daynum">—</div>
        </button>

        {days.map(d => {
          const key = format(d, 'yyyy-MM-dd');
          const active = key === selectedDate;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`flex flex-col items-center justify-center w-14 h-16 rounded-2xl border date-strip-item ${active ? 'bg-limePrimary text-bgDark border-transparent' : 'bg-white/5 text-textPrimary/85 border-white/10 hover:bg-white/10'}`}
            >
              <div className="text-xs opacity-80 weekday">{format(d, 'EEE')}</div>
              <div className="text-lg font-semibold leading-none mt-1 daynum">{format(d, 'd')}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DateStrip;


