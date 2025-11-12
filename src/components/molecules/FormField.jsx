import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  error, 
  required = false, 
  children, 
  className,
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label && (
        <label className={cn(
          "block text-sm font-medium text-gray-700",
          required && "after:content-['*'] after:ml-0.5 after:text-red-500"
        )}>
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default FormField;