import { useAuth } from '../contexts/AuthContext';
import { useSports } from '../hooks/useSports';

const DebugAuth = () => {
  const { user, profile, loading, teamMemberships } = useAuth();
  const { data: sports, isLoading: sportsLoading, error: sportsError } = useSports();

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 border rounded-lg shadow-lg max-w-md text-xs">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="space-y-1">
        <div><strong>Auth Loading:</strong> {loading ? 'true' : 'false'}</div>
        <div><strong>User:</strong> {user ? `${user.email} (${user.id})` : 'null'}</div>
        <div><strong>Profile:</strong> {profile ? `${profile.role} (${profile.id})` : 'null'}</div>
        <div><strong>Team Memberships:</strong> {teamMemberships.length}</div>
        <div><strong>Sports Loading:</strong> {sportsLoading ? 'true' : 'false'}</div>
        <div><strong>Sports Data:</strong> {sports ? `${sports.length} sports` : 'null'}</div>
        <div><strong>Sports Error:</strong> {sportsError ? sportsError.message : 'none'}</div>
      </div>
    </div>
  );
};

export default DebugAuth;
