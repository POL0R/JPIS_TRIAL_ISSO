import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import { useProfiles } from '../hooks/useAdmin';
import { useUpdateUserRoleMutation } from '../hooks/useAdmin';

const AdminPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin } = usePermissions();
  const { data: profiles = [], isLoading: profilesLoading } = useProfiles();
  const updateRoleMutation = useUpdateUserRoleMutation();

  const handleRoleUpdate = async (userId: string, role: 'Viewer' | 'Scorer' | 'Admin') => {
    try {
      await updateRoleMutation.mutateAsync({ userId, role });
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You must be signed in to access the admin panel.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You must be an admin to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage admin users and tournament data</p>
        </div>

        {/* Admin Users */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Admin Users</h2>
          </div>
          <div className="p-6">
            {profilesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading users...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {profiles.map((profile) => (
                      <tr key={profile.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {profile.user_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              profile.role === 'Admin'
                                ? 'bg-red-100 text-red-800'
                                : profile.role === 'Scorer'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {profile.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(profile.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <select
                            value={profile.role}
                            onChange={(e) => handleRoleUpdate(profile.user_id, e.target.value as any)}
                            disabled={updateRoleMutation.isPending}
                            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Viewer">Viewer</option>
                            <option value="Scorer">Scorer</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Admin Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Admin Instructions</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• <strong>Edit Scores:</strong> Go to any sport page and click "Edit Score" on matches</p>
            <p>• <strong>Basketball:</strong> Enter direct scores for home and away teams</p>
            <p>• <strong>Football:</strong> Add individual goals with player names and minutes</p>
            <p>• <strong>Finalize Matches:</strong> Lock matches from further edits using the "Finalize" button</p>
              <p>• <strong>Add Admin Users:</strong> Create users in Supabase Dashboard &gt; Authentication &gt; Users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;