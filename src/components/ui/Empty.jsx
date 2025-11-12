import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No tasks yet", 
  message = "Create your first task to get started with organizing your day!",
  actionLabel = "Create Task",
  onAction,
  icon = "CheckCircle2",
  showAction = true
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mb-6 shadow-lg"
      >
        <ApperIcon name={icon} className="text-white" size={40} />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-gray-900 mb-3"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 mb-8 max-w-md leading-relaxed"
      >
        {message}
      </motion.p>

      {showAction && onAction && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-8 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transform transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={18} />
          {actionLabel}
        </motion.button>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 grid grid-cols-3 gap-6 opacity-60"
      >
        {["Target", "Star", "Zap"].map((iconName, index) => (
          <div key={iconName} className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-2">
              <ApperIcon name={iconName} size={20} className="text-gray-400" />
            </div>
            <span className="text-xs text-gray-400 font-medium">
              {index === 0 ? "Set Goals" : index === 1 ? "Track Progress" : "Stay Motivated"}
            </span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Empty;