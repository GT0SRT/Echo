import React from "react";
import { cn } from "../lib/utils";

export function Input(props) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-md border border-cyan-500/20 bg-slate-900 px-3 py-2 text-sm text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40",
        props.className
      )}
    />
  );
}

export default Input;
