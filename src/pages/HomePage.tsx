import { Link } from 'react-router-dom';
import { useSports } from '../hooks/useSports';
import ProfileCard from './components/ProfileCard.jsx'

const HomePage = () => {
  const { data: sports, isLoading, error } = useSports();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">Failed to load sports data</p>
        </div>
      </div>
    );
  }

  const sportTiles = [
    {
      slug: 'football-u19',
      name: 'U19 Football',
      description: 'Football tournament for U19 players',
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      icon: '⚽'
    },
    {
      slug: 'basketball-u17-boys',
      name: 'U17 Boys Basketball',
      description: 'Basketball tournament for U17 boys',
      bgColor: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      icon: '🏀'
    },
    {
      slug: 'basketball-u17-girls',
      name: 'U17 Girls Basketball',
      description: 'Basketball tournament for U17 girls',
      bgColor: 'bg-pink-500',
      hoverColor: 'hover:bg-pink-600',
      icon: '🏀'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            ISSO Scoreboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track live scores and standings for all ISSO tournaments
          </p>
        </header>

        <ProfileCard
  name="Javi A. Torres"
  title="Software Engineer"
  handle="javicodes"
  avatarUrl="/path/to/avatar.jpg"
  showUserInfo={false}
  enableTilt={true}
  enableMobileTilt={false}
  onContactClick={() => console.log('Contact clicked')}
/>

        <div className="text-center mt-12">
          <Link
            to="/profile"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-200"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
