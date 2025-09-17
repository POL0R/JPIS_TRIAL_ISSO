import { Link } from 'react-router-dom';

interface HeaderBarProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

const HeaderBar = ({ title, subtitle, right }: HeaderBarProps) => {
  return (
    <div className="relative rounded-xl2 p-6 shadow-soft bg-limeGrad text-bgDark overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden>
        <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-white" />
      </div>
      <div className="relative flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">{title}</h1>
          {subtitle && <p className="text-sm mt-1 opacity-80">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" className="px-3 py-1.5 rounded-full bg-bgDark/10 hover:bg-bgDark/15 text-sm">Home</Link>
          {right}
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;


