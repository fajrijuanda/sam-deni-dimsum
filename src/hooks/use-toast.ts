import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";
import { useToast as useToastOriginal } from "@/components/ui/use-toast-original";

// Since I cannot easily create the full shadcn toast complex structure (provider, reducer, etc) from scratch without multiple files (toast.tsx, use-toast.ts),
// I will create a simplified version that relies on a Toaster component.

// Actually, creating the full shadcn toast is feasible.
// I'll create a 'use-toast.ts' that mimics the shadcn hook interface.

import { useState, useEffect } from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
}

let listeners: ((toasts: Toast[]) => void)[] = [];
let memoryToasts: Toast[] = [];

function dispatch(action: {
  type: "ADD_TOAST" | "REMOVE_TOAST" | "DISMISS_TOAST";
  toast?: Toast;
  toastId?: string;
}) {
  if (action.type === "ADD_TOAST" && action.toast) {
    memoryToasts = [...memoryToasts, action.toast];
  }
  if (action.type === "DISMISS_TOAST") {
    memoryToasts = memoryToasts.filter((t) => t.id !== action.toastId);
  }
  if (action.type === "REMOVE_TOAST") {
    memoryToasts = memoryToasts.filter((t) => t.id !== action.toastId);
  }
  listeners.forEach((listener) => listener(memoryToasts));
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(memoryToasts);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter((l) => l !== setToasts);
    };
  }, []);

  return {
    toast: (props: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      dispatch({ type: "ADD_TOAST", toast: { ...props, id } });

      // Auto dismiss
      setTimeout(() => {
        dispatch({ type: "DISMISS_TOAST", toastId: id });
      }, 5000);

      return {
        id,
        dismiss: () => dispatch({ type: "DISMISS_TOAST", toastId: id }),
      };
    },
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
    toasts,
  };
}
