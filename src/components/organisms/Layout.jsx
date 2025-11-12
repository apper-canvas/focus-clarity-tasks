import { Outlet } from 'react-router-dom';
import { useAuth } from '@/layouts/Root';
import { useSelector } from 'react-redux';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

function Layout() {
  const { logout } = useAuth();
  const { user } = useSelector(state => state.user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-4">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">C</span>
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-gray-900">Clarity Tasks</h1>
                <p className="text-gray-600 text-sm">Clean & Simple Task Management</p>
              </div>
            </div>
            
            {user && (
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Welcome, {user.firstName} {user.lastName}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600"
                >
                  <ApperIcon name="LogOut" size={16} />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;