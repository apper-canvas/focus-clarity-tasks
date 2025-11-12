import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getApperClient } from '@/services/apperClient'
import ApperIcon from '@/components/ApperIcon'

export default function ResetPassword() {
  const navigate = useNavigate()

  useEffect(() => {
    const initializeReset = async () => {
      try {
        const apperClient = getApperClient()
        
        if (!apperClient || !window.ApperSDK) {
          console.error('ApperSDK not available')
          navigate('/login')
          return
        }

        const { ApperUI } = window.ApperSDK

        ApperUI.setup(apperClient, {
          target: "#reset-container",
          clientId: import.meta.env.VITE_APPER_PROJECT_ID,
          view: "resetPassword",
          onSuccess: () => {
            navigate('/login')
          },
          onError: (error) => {
            console.error('Reset password error:', error)
          }
        })
      } catch (error) {
        console.error('Failed to initialize password reset:', error)
        navigate('/login')
      }
    }

    // Wait for SDK to be available
    let attempts = 0
    const maxAttempts = 50
    const checkSDK = () => {
      if (window.ApperSDK) {
        initializeReset()
      } else if (attempts < maxAttempts) {
        attempts++
        setTimeout(checkSDK, 100)
      } else {
        console.error('ApperSDK failed to load')
        navigate('/login')
      }
    }
    checkSDK()
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-amber-600 rounded-lg flex items-center justify-center mb-4">
            <ApperIcon name="Key" size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">Enter your email to reset your password</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div id="reset-container" className="min-h-[300px] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading password reset form...</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/login')}
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}