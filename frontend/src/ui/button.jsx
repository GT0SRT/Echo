import React from "react";
import { cn } from "../lib/utils";

export function Button({ children, className, ...props }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium";
  return (
    <button className={cn(base, className)} {...props}>
      {children}
    </button>
  );
}

export default Button;
