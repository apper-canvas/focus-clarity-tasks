import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

export default function Layout() {
  const { user, isAuthenticated } = useSelector((state) => state.user)

  const handleLogout = async () => {
    try {
      if (window.ApperSDK?.ApperUI?.logout) {
        await window.ApperSDK.ApperUI.logout()
      }
      // Redirect will be handled by Root.jsx authentication flow
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && (
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-900">Task Manager</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                {user && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <ApperIcon name="User" size={16} />
                    <span>{user.firstName} {user.lastName}</span>
                  </div>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <ApperIcon name="LogOut" size={16} />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}
      
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}