import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

export default function Callback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Give ApperUI time to process the callback
        setTimeout(() => {
          navigate('/')
        }, 2000)
      } catch (error) {
        console.error('Callback error:', error)
        navigate('/login')
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-6">
          <ApperIcon name="CheckSquare" size={24} className="text-white" />
        </div>
        
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Completing Authentication
        </h2>
        <p className="text-gray-600">
          Please wait while we sign you in...
        </p>
      </div>
    </div>
  )
}