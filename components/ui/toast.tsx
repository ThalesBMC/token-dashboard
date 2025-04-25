import React from "react";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const toastVariants = cva(
  "relative flex w-full items-center justify-between rounded-lg border p-4 pr-8 shadow-lg transition-all",
  {
    variants: {
      status: {
        info: "bg-blue-50 border-blue-200 text-blue-800",
        success: "bg-green-50 border-green-200 text-green-800",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
        error: "bg-red-50 border-red-200 text-red-800",
      },
    },
    defaultVariants: {
      status: "info",
    },
  }
);

const statusIcons = {
  info: (
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
      <svg
        className="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  ),
  success: (
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
      <svg
        className="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
  ),
  warning: (
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
      <svg
        className="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    </div>
  ),
  error: (
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
      <svg
        className="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </div>
  ),
};

export interface ToastProps extends VariantProps<typeof toastVariants> {
  id: string;
  title?: string;
  description?: string;
  status?: "success" | "error" | "warning" | "info";
  onDismiss?: (id: string) => void;
}

export function Toast({
  id,
  title,
  description,
  status = "info",
  onDismiss,
  className,
  ...props
}: ToastProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(toastVariants({ status }), className)} {...props}>
      <div className="flex items-start gap-3">
        {statusIcons[status]}
        <div className="flex-1">
          {title && <h3 className="font-medium">{title}</h3>}
          {description && <p className="text-sm opacity-90">{description}</p>}
        </div>
      </div>

      {onDismiss && (
        <button
          onClick={() => onDismiss(id)}
          className="absolute right-1 top-1 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      )}
    </div>
  );
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed bottom-0 right-0 z-50 m-4 flex max-h-screen w-full max-w-sm flex-col gap-2 overflow-hidden">
      {children}
    </div>
  );
}
