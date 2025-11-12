import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "@/components/organisms/TaskCard";
import Empty from "@/components/ui/Empty";
import { cn } from "@/utils/cn";

const TaskList = ({ 
  tasks = [], 
  categories = [], 
  onTaskUpdate, 
  onTaskDelete,
  emptyTitle = "No tasks found",
  emptyMessage = "There are no tasks matching your current filter.",
  showEmptyAction = false,
  onEmptyAction,
  className 
}) => {
  if (tasks.length === 0) {
    return (
      <div className={cn("bg-white rounded-xl shadow-sm border border-gray-200", className)}>
        <Empty
          title={emptyTitle}
          message={emptyMessage}
          icon="CheckCircle2"
          showAction={showEmptyAction}
          onAction={onEmptyAction}
          actionLabel="Create Task"
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.div
            key={task.Id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <TaskCard
              task={task}
              categories={categories}
              onUpdate={onTaskUpdate}
              onDelete={onTaskDelete}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;