import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  size = "default",
  children,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white",
    secondary: "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white",
    success: "bg-gradient-to-r from-accent-500 to-accent-600 text-white",
    warning: "bg-gradient-to-r from-warning to-amber-600 text-white",
    error: "bg-gradient-to-r from-error to-red-600 text-white",
    high: "bg-gradient-to-r from-red-500 to-red-600 text-white",
    medium: "bg-gradient-to-r from-warning to-amber-600 text-white",
    low: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
    outline: "border border-gray-300 bg-white text-gray-700",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 shadow-sm",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;