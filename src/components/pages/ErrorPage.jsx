import { useNavigate } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

export default function ErrorPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <ApperIcon name="AlertTriangle" size={32} className="text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Oops! Something went wrong
        </h1>
        
        <p className="text-gray-600 mb-8">
          We encountered an unexpected error. Please try again or contact support if the problem persists.
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
            onClick={() => window.location.reload()}
            className="w-full"
          >
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Reload Page
          </Button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Error Code: 500</p>
          <p>If this problem continues, please contact our support team.</p>
        </div>
      </div>
    </div>
  )
}