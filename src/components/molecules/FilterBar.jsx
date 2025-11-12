import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const FilterBar = ({ 
  activeFilter = "all", 
  onFilterChange,
  taskCounts = { all: 0, active: 0, completed: 0 },
  className,
  ...props 
}) => {
  const filters = [
    { key: "all", label: "All Tasks", count: taskCounts.all },
    { key: "active", label: "Active", count: taskCounts.active },
    { key: "completed", label: "Completed", count: taskCounts.completed },
  ];

  return (
    <div className={cn("flex gap-2", className)} {...props}>
      {filters.map((filter) => (
        <motion.div key={filter.key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant={activeFilter === filter.key ? "primary" : "ghost"}
            size="sm"
            onClick={() => onFilterChange?.(filter.key)}
            className={cn(
              "relative",
              activeFilter === filter.key 
                ? "shadow-lg" 
                : "hover:bg-gray-100"
            )}
          >
            {filter.label}
            <span className={cn(
              "ml-2 px-1.5 py-0.5 rounded-full text-xs font-semibold",
              activeFilter === filter.key 
                ? "bg-white/20 text-white" 
                : "bg-gray-200 text-gray-600"
            )}>
              {filter.count}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default FilterBar;