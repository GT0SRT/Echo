import React from "react";
import { cn } from "../lib/utils";

export function Label({ children, className, ...props }) {
  return (
    <label className={cn("block text-sm font-medium text-cyan-200", className)} {...props}>
      {children}
    </label>
  );
}

export default Label;
