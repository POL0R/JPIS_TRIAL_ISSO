import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user, profile, signIn, signOut, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  console.log('ProfilePage render:', { user, profile, loading });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const { error } = await signIn(email, password);
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Signed in successfully!' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Admin Login</h1>

          {!user ? (
            // Sign In Form
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Sign In</h2>
              <p className="text-gray-600 mb-6">Only pre-authorized admin users can sign in to edit scores.</p>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
              </form>
            </div>
          ) : (
            // User Profile
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Admin Account</h2>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {profile?.role || 'Admin'}</p>
                  <p><strong>Member Since:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-semibold text-blue-900 mb-2">Admin Capabilities</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Edit scores for all matches</li>
                  <li>• Finalize matches to lock them from further edits</li>
                  <li>• Access admin dashboard for user management</li>
                  <li>• Manage all tournament data</li>
                </ul>
              </div>

              {/* Sign Out */}
              <div className="pt-6 border-t">
                <button
                  onClick={signOut}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div
              className={`mt-4 p-4 rounded-md ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;