import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getApperClient } from '@/services/apperClient'
import ApperIcon from '@/components/ApperIcon'

export default function Signup() {
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
          target: "#signup-container",
          clientId: import.meta.env.VITE_APPER_PROJECT_ID,
          view: "signup",
          onSuccess: (user) => {
            console.log('Signup successful:', user)
            navigate('/')
          },
          onError: (error) => {
            console.error('Signup error:', error)
          }
        })
      } catch (error) {
        console.error('Failed to initialize signup:', error)
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-4">
            <ApperIcon name="UserPlus" size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join us to start managing your tasks</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div id="signup-container" className="min-h-[300px] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading registration form...</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}