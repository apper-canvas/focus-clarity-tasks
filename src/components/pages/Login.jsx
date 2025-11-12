import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getApperClient } from '@/services/apperClient'
import ApperIcon from '@/components/ApperIcon'

export default function Login() {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.user)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
      return
    }

    const initializeAuth = async () => {
      try {
        const apperClient = getApperClient()
        
        if (!apperClient || !window.ApperSDK) {
          console.error('ApperSDK not available')
          return
        }

        const { ApperUI } = window.ApperSDK

        ApperUI.setup(apperClient, {
          target: "#login-container",
          clientId: import.meta.env.VITE_APPER_PROJECT_ID,
          view: "login",
          onSuccess: (user) => {
            console.log('Login successful:', user)
            navigate('/')
          },
          onError: (error) => {
            console.error('Login error:', error)
          }
        })
      } catch (error) {
        console.error('Failed to initialize login:', error)
      }
    }

    // Wait for SDK to be available
    let attempts = 0
    const maxAttempts = 50
    const checkSDK = () => {
      if (window.ApperSDK) {
        initializeAuth()
      } else if (attempts < maxAttempts) {
        attempts++
        setTimeout(checkSDK, 100)
      } else {
        console.error('ApperSDK failed to load')
      }
    }
    checkSDK()
  }, [navigate, isAuthenticated])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
            <ApperIcon name="CheckSquare" size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access your tasks</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div id="login-container" className="min-h-[300px] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading authentication...</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}