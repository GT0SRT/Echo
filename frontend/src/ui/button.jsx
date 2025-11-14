import React from "react";
import { cn } from "../lib/utils";

export const Button = React.forwardRef(function Button({ className, children, ...props }, ref) {
  return (
    <button
      ref={ref}
      className={cn("btn-gradient inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium shadow-sm transition-all", className)}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
