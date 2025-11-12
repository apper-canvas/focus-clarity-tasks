import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PrioritySelector = ({ 
  value = "medium", 
  onChange,
  className,
  ...props 
}) => {
  const priorities = [
    { key: "high", label: "High", color: "from-red-500 to-red-600", icon: "AlertTriangle" },
    { key: "medium", label: "Medium", color: "from-warning to-amber-600", icon: "Circle" },
    { key: "low", label: "Low", color: "from-blue-500 to-blue-600", icon: "Minus" },
  ];

  return (
    <div className={cn("flex gap-2", className)} {...props}>
      {priorities.map((priority) => (
        <motion.div key={priority.key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant={value === priority.key ? "primary" : "ghost"}
            size="sm"
            onClick={() => onChange?.(priority.key)}
            className={cn(
              "flex items-center gap-2",
              value === priority.key && `bg-gradient-to-r ${priority.color} shadow-lg`
            )}
          >
            <ApperIcon name={priority.icon} size={14} />
            {priority.label}
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default PrioritySelector;