import { useNavigate } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ApperIcon name="Search" size={32} className="text-gray-600" />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        
        <div className="space-y-3">
          <Button
            onClick={() => navigate('/')}
            className="w-full"
          >
            <ApperIcon name="Home" size={16} className="mr-2" />
            Go Home
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full"
          >
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Go Back
          </Button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Lost? Try navigating from our home page.</p>
        </div>
      </div>
    </div>
  )
}