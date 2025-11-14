import React from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { cn } from "../lib/utils";

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogPortal = RadixDialog.Portal;
export const DialogOverlay = ({ className, ...props }) => (
  <RadixDialog.Overlay className={cn("fixed inset-0 bg-black/50 backdrop-blur-sm", className)} {...props} />
);
export function DialogContent({ children, className, ...props }) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay />
      <RadixDialog.Content
        className={cn(
          "fixed left-1/2 top-1/2 max-w-lg w-[95%] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-cyan-500/30 bg-slate-950 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.6)] text-cyan-100",
          className
        )}
        {...props}
      >
        {children}
        <RadixDialog.Close className="absolute top-3 right-3 text-cyan-200" aria-label="Close">✕</RadixDialog.Close>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}
export function DialogHeader({ children, className, ...props }) {
  return (
    <div className={cn("mb-2", className)} {...props}>
      {children}
    </div>
  );
}
export function DialogTitle({ children, className, ...props }) {
  return (
    <RadixDialog.Title className={cn("text-lg font-semibold text-cyan-300", className)} {...props}>
      {children}
    </RadixDialog.Title>
  );
}
export default Dialog;
