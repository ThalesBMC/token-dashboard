import React, { createContext, useCallback, useContext, useState } from "react";
import { Toast, ToastContainer } from "@/components/ui/toast";

type ToastType = {
  id: string;
  title?: string;
  description?: string;
  status?: "success" | "error" | "warning" | "info";
};

interface ToastContextType {
  toasts: ToastType[];
  showToast: (toast: Omit<ToastType, "id">) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const showToast = useCallback((toast: Omit<ToastType, "id">) => {
    const id = Date.now().toString();
    setToasts((prevToasts) => [...prevToasts, { ...toast, id }]);

    // Auto-dismiss toast after 5 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            title={toast.title}
            description={toast.description}
            status={toast.status}
            onDismiss={dismissToast}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
