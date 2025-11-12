import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Checkbox from "@/components/atoms/Checkbox";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import TaskForm from "@/components/organisms/TaskForm";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";
import { cn } from "@/utils/cn";
import { format } from "date-fns";

const TaskCard = ({ 
  task, 
  categories = [], 
  onUpdate, 
  onDelete,
  className 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleComplete = async () => {
    setIsUpdating(true);
    try {
      const updatedTask = await taskService.update(task.Id, {
        completed: !task.completed
      });
      onUpdate?.(updatedTask);
      
      if (!task.completed) {
        toast.success("Task completed! 🎉");
      } else {
        toast.info("Task marked as active");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await taskService.delete(task.Id);
      onDelete?.(task.Id);
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveEdit = (updatedTask) => {
    setIsEditing(false);
    onUpdate?.(updatedTask);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "#EF4444";
      case "medium": return "#F59E0B";
      case "low": return "#3B82F6";
      default: return "#6B7280";
    }
  };

  const getCategoryColor = (categoryName) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || "#6366F1";
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("mb-4", className)}
      >
        <TaskForm
          task={task}
          categories={categories}
          onSave={handleSaveEdit}
          onCancel={() => setIsEditing(false)}
          isExpanded={true}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      whileHover={{ y: -2, shadow: "0 8px 25px -8px rgba(0,0,0,0.1)" }}
      className={cn(
        "bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 p-4 transition-all duration-200",
        task.completed && "opacity-75",
        className
      )}
      style={{
        borderLeftWidth: "4px",
        borderLeftColor: getCategoryColor(task.category)
      }}
    >
      <div className="flex items-start gap-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mt-1"
        >
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isUpdating}
          />
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className={cn(
                "font-semibold text-gray-900 text-base leading-snug",
                task.completed && "line-through text-gray-500"
              )}>
                {task.title}
              </h3>

              {task.description && (
                <p className={cn(
                  "text-gray-600 text-sm mt-2 leading-relaxed",
                  task.completed && "text-gray-400"
                )}>
                  {task.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Badge variant={task.priority} size="sm">
                  {task.priority}
                </Badge>

                <Badge 
                  variant="outline" 
                  size="sm"
                  className="border-gray-200"
                  style={{
                    borderColor: getCategoryColor(task.category),
                    color: getCategoryColor(task.category)
                  }}
                >
                  {task.category}
                </Badge>

                <span className="text-xs text-gray-400">
                  {format(new Date(task.createdAt), "MMM d")}
                </span>

                {task.completed && task.completedAt && (
                  <span className="text-xs text-emerald-600 font-medium">
                    ✓ Completed {format(new Date(task.completedAt), "MMM d")}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                disabled={isUpdating || isDeleting}
                className="text-gray-500 hover:text-primary-600 h-8 w-8 p-0"
              >
                <ApperIcon name="Edit2" size={14} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isUpdating || isDeleting}
                className="text-gray-500 hover:text-red-600 h-8 w-8 p-0"
              >
                {isDeleting ? (
                  <ApperIcon name="Loader2" className="animate-spin" size={14} />
                ) : (
                  <ApperIcon name="Trash2" size={14} />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;