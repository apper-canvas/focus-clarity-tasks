import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Skeleton */}
          <div className="w-64 bg-white rounded-xl shadow-sm p-6 border">
            <div className="h-6 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                  <div className="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                  <div className="ml-auto h-4 w-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="flex-1">
            {/* Search and Filter Bar Skeleton */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border">
              <div className="flex gap-4">
                <div className="flex-1 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-16 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Task Input Skeleton */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border">
              <div className="space-y-4">
                <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
                <div className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
                <div className="flex gap-4">
                  <div className="w-32 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
                  <div className="w-32 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
                  <div className="ml-auto w-20 h-10 bg-gradient-to-r from-primary-200 to-primary-300 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Task List Skeleton */}
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-xl shadow-sm p-4 border"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-5 h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mt-1"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-3/4"></div>
                      <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-1/2"></div>
                      <div className="flex gap-2 mt-2">
                        <div className="w-16 h-5 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full animate-pulse"></div>
                        <div className="w-12 h-5 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;