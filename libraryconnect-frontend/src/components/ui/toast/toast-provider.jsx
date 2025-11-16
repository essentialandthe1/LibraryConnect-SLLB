import React from "react";
import { useToast } from "./use-toast";
import { Toast } from "./toast";
import { ToastViewport } from "./toast-viewport";

export function ToastProvider({ children }) {
  const { toasts, dismiss } = useToast();

  return (
    <>
      {children}

      {toasts.map((t) => (
        <Toast
          key={t.id}
          title={t.title}
          description={t.description}
          action={t.action}
          open={t.open}
          onOpenChange={(open) => {
            if (!open) dismiss(t.id);
          }}
        />
      ))}

      <ToastViewport />
    </>
  );
}
