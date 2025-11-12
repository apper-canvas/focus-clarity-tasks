import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { categoryService } from "@/services/api/categoryService";
import { cn } from "@/utils/cn";

const CategorySidebar = ({ 
  categories = [], 
  selectedCategory, 
  onCategorySelect,
  onCategoriesUpdate,
  taskCounts = {},
  className 
}) => {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#6366F1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const predefinedColors = [
    "#6366F1", "#8B5CF6", "#10B981", "#F59E0B", 
    "#3B82F6", "#EF4444", "#EC4899", "#06B6D4"
  ];

  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (categories.find(cat => cat.name.toLowerCase() === newCategoryName.toLowerCase())) {
      toast.error("Category already exists");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newCategory = await categoryService.create({
        name: newCategoryName.trim(),
        color: newCategoryColor
      });
      
      onCategoriesUpdate?.([...categories, newCategory]);
      setNewCategoryName("");
      setNewCategoryColor("#6366F1");
      setIsAddingCategory(false);
      toast.success("Category created successfully!");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete the "${categoryName}" category?`)) {
      return;
    }

    try {
      await categoryService.delete(categoryId);
      const updatedCategories = categories.filter(cat => cat.Id !== categoryId);
      onCategoriesUpdate?.(updatedCategories);
      
      if (selectedCategory === categoryName) {
        onCategorySelect?.("all");
      }
      
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  const getTaskCount = (categoryName) => {
    return taskCounts[categoryName] || 0;
  };

  const getTotalTasks = () => {
    return Object.values(taskCounts).reduce((sum, count) => sum + count, 0);
  };

  return (
    <div className={cn("bg-white rounded-xl shadow-sm border border-gray-200 p-6", className)}>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Categories</h2>
        <p className="text-sm text-gray-600">Organize your tasks</p>
      </div>

      <div className="space-y-2 mb-6">
        <motion.button
          whileHover={{ x: 2 }}
          onClick={() => onCategorySelect?.("all")}
          className={cn(
            "w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200",
            selectedCategory === "all"
              ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md"
              : "hover:bg-gray-50 text-gray-700"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-3 h-3 rounded-full",
              selectedCategory === "all" ? "bg-white/30" : "bg-gray-300"
            )} />
            <span className="font-medium">All Tasks</span>
          </div>
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-semibold",
            selectedCategory === "all" 
              ? "bg-white/20 text-white" 
              : "bg-gray-200 text-gray-600"
          )}>
            {getTotalTasks()}
          </span>
        </motion.button>

        <AnimatePresence>
          {categories.map((category) => (
            <motion.div
              key={category.Id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              whileHover={{ x: 2 }}
              className="group"
            >
              <button
                onClick={() => onCategorySelect?.(category.name)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200",
                  selectedCategory === category.name
                    ? "text-white shadow-md"
                    : "hover:bg-gray-50 text-gray-700"
                )}
                style={{
                  background: selectedCategory === category.name 
                    ? `linear-gradient(to right, ${category.color}, ${category.color}dd)`
                    : "transparent"
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ 
                      backgroundColor: selectedCategory === category.name 
                        ? "rgba(255,255,255,0.3)" 
                        : category.color 
                    }}
                  />
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-semibold",
                    selectedCategory === category.name 
                      ? "bg-white/20 text-white" 
                      : "bg-gray-200 text-gray-600"
                  )}>
                    {getTaskCount(category.name)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(category.Id, category.name);
                    }}
                    className={cn(
                      "opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-6 w-6 p-0",
                      selectedCategory === category.name 
                        ? "text-white/70 hover:text-white" 
                        : "text-gray-400 hover:text-red-600"
                    )}
                  >
                    <ApperIcon name="X" size={12} />
                  </Button>
                </div>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isAddingCategory ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 pt-4"
          >
            <form onSubmit={handleAddCategory} className="space-y-4">
              <FormField label="Category Name">
                <Input
                  placeholder="Enter category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  autoFocus
                />
              </FormField>

              <FormField label="Color">
                <div className="flex gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewCategoryColor(color)}
                      className={cn(
                        "w-8 h-8 rounded-full transition-all duration-200",
                        newCategoryColor === color 
                          ? "ring-2 ring-offset-2 ring-gray-400 scale-110" 
                          : "hover:scale-110"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </FormField>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting || !newCategoryName.trim()}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <ApperIcon name="Loader2" className="animate-spin mr-2" size={14} />
                      Creating...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Plus" className="mr-2" size={14} />
                      Add
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAddingCategory(false);
                    setNewCategoryName("");
                    setNewCategoryColor("#6366F1");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-t border-gray-200 pt-4"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAddingCategory(true)}
              className="w-full justify-center text-primary-600 hover:text-primary-700 hover:bg-primary-50"
            >
              <ApperIcon name="Plus" className="mr-2" size={16} />
              Add Category
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategorySidebar;