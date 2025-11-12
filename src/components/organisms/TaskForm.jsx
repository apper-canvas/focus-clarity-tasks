import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import PrioritySelector from "@/components/molecules/PrioritySelector";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";

const TaskForm = ({ 
  task = null, 
  categories = [], 
  onSave, 
  onCancel,
  isExpanded = false,
  onToggleExpanded
}) => {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "medium",
    category: task?.category || "Personal",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }
    
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setIsSubmitting(true);
    
    try {
      let savedTask;
      if (task) {
        savedTask = await taskService.update(task.Id, formData);
        toast.success("Task updated successfully!");
      } else {
        savedTask = await taskService.create(formData);
        toast.success("Task created successfully!");
      }
      
      onSave?.(savedTask);
      
      if (!task) {
        setFormData({
          title: "",
          description: "",
          priority: "medium",
          category: "Personal",
        });
      }
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Failed to save task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAdd = (e) => {
    if (e.key === "Enter" && !e.shiftKey && formData.title.trim()) {
      e.preventDefault();
      if (!isExpanded) {
        handleSubmit(e);
      }
    }
  };

  if (!isExpanded && !task) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-4 border border-gray-200"
      >
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Add a new task... (Press Enter to save)"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              onKeyDown={handleQuickAdd}
              className="border-none shadow-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpanded}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
          >
            <ApperIcon name="Plus" size={16} />
            More Options
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">
          {task ? "Edit Task" : "Create New Task"}
        </h3>
        {!task && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpanded}
            className="text-gray-500 hover:text-gray-700"
          >
            <ApperIcon name="X" size={16} />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Task Title"
          required
          error={errors.title}
        >
          <Input
            placeholder="What needs to be done?"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            error={!!errors.title}
          />
        </FormField>

        <FormField
          label="Description"
          error={errors.description}
        >
          <Textarea
            placeholder="Add more details about this task..."
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={3}
            error={!!errors.description}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Priority Level"
            error={errors.priority}
          >
            <PrioritySelector
              value={formData.priority}
              onChange={(priority) => handleInputChange("priority", priority)}
            />
          </FormField>

          <FormField
            label="Category"
            required
            error={errors.category}
          >
            <Select
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              error={!!errors.category}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.Id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          {task && onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || !formData.title.trim()}
            className="ml-auto flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <ApperIcon name="Loader2" className="animate-spin" size={16} />
                {task ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <ApperIcon name={task ? "Save" : "Plus"} size={16} />
                {task ? "Update Task" : "Create Task"}
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default TaskForm;