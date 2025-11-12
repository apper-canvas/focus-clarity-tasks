import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ 
  className, 
  checked = false,
  disabled = false,
  onChange,
  ...props 
}, ref) => {
  return (
    <motion.div
      className="relative inline-flex items-center"
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      <input
        type="checkbox"
        ref={ref}
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        {...props}
      />
      <motion.div
        className={cn(
          "w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-200",
          checked 
            ? "bg-gradient-to-br from-primary-500 to-primary-600 border-primary-600 shadow-md" 
            : "bg-white border-gray-300 hover:border-primary-400",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        onClick={() => !disabled && onChange?.({ target: { checked: !checked } })}
        animate={checked ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={checked ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <ApperIcon name="Check" className="text-white" size={14} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;