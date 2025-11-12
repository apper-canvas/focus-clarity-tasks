import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTasks } from "@/hooks/useTasks";
import { useCategories } from "@/hooks/useCategories";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import TaskForm from "@/components/organisms/TaskForm";
import TaskList from "@/components/organisms/TaskList";
import CategorySidebar from "@/components/organisms/CategorySidebar";
import SearchBar from "@/components/molecules/SearchBar";
import FilterBar from "@/components/molecules/FilterBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const TaskManager = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTaskFormExpanded, setIsTaskFormExpanded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    loadTasks,
    updateTask,
    deleteTask,
    searchTasks,
    getTaskCounts
  } = useTasks();

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    setCategories
  } = useCategories();

  const loading = tasksLoading || categoriesLoading;
  const error = tasksError || categoriesError;

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(task => task.category === selectedCategory);
    }

    // Filter by status
    if (activeFilter === "active") {
      filtered = filtered.filter(task => !task.completed);
    } else if (activeFilter === "completed") {
      filtered = filtered.filter(task => task.completed);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    // Sort tasks: incomplete first, then by creation date (newest first)
    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [tasks, selectedCategory, activeFilter, searchQuery]);

  const taskCounts = useMemo(() => getTaskCounts(), [getTaskCounts]);

  const handleTaskUpdate = (updatedTask) => {
    updateTask(updatedTask.Id, updatedTask);
  };

  const handleTaskDelete = (taskId) => {
    deleteTask(taskId);
  };

  const handleTaskFormSave = () => {
    setIsTaskFormExpanded(false);
    loadTasks();
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsSidebarOpen(false);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadTasks} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Clarity Tasks</h1>
            <p className="text-sm text-gray-600">Stay organized, stay focused</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="lg:hidden fixed left-0 top-0 h-full w-80 bg-white z-50 shadow-xl overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Categories</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <ApperIcon name="X" size={16} />
                    </Button>
                  </div>
                  <CategorySidebar
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategorySelect={handleCategorySelect}
                    onCategoriesUpdate={setCategories}
                    taskCounts={taskCounts}
                    className="border-none shadow-none"
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Clarity Tasks</h1>
            <p className="text-gray-600">Stay organized, stay focused</p>
          </div>
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            onCategoriesUpdate={setCategories}
            taskCounts={taskCounts}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 lg:pl-0">
          <div className="max-w-4xl mx-auto">
            {/* Search and Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <SearchBar
                    onSearch={handleSearch}
                    placeholder="Search your tasks..."
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <FilterBar
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    taskCounts={taskCounts}
                  />
                </div>
              </div>
            </motion.div>

            {/* Task Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <TaskForm
                categories={categories}
                onSave={handleTaskFormSave}
                isExpanded={isTaskFormExpanded}
                onToggleExpanded={() => setIsTaskFormExpanded(!isTaskFormExpanded)}
              />
            </motion.div>

            {/* Task List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <TaskList
                tasks={filteredTasks}
                categories={categories}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                emptyTitle={
                  searchQuery 
                    ? "No tasks found" 
                    : selectedCategory === "all" 
                      ? "No tasks yet" 
                      : `No tasks in ${selectedCategory}`
                }
                emptyMessage={
                  searchQuery
                    ? `No tasks match "${searchQuery}". Try a different search term.`
                    : selectedCategory === "all"
                      ? "Create your first task to get started with organizing your day!"
                      : `You haven't added any tasks to the ${selectedCategory} category yet.`
                }
                showEmptyAction={!searchQuery && tasks.length === 0}
                onEmptyAction={() => setIsTaskFormExpanded(true)}
              />
            </motion.div>

            {/* Task Summary */}
            {tasks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600 mb-1">
                      {taskCounts.all}
                    </div>
                    <div className="text-sm text-gray-600">Total Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning mb-1">
                      {taskCounts.active}
                    </div>
                    <div className="text-sm text-gray-600">Active Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-500 mb-1">
                      {taskCounts.completed}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                </div>
                
                {taskCounts.completed > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                    <div className="text-sm text-gray-600">
                      Completion Rate: {" "}
                      <span className="font-semibold text-accent-600">
                        {Math.round((taskCounts.completed / taskCounts.all) * 100)}%
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;