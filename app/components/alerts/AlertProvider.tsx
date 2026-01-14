"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, Info, AlertTriangle } from "lucide-react";

export type AlertVariant = "success" | "info" | "warning" | "error";

export type AlertItem = {
  id: string;
  title?: string;
  message: string;
  variant?: AlertVariant;
  duration?: number | null;
  action?: {
    label: string;
    onClick: () => void;
  };
};

type AlertContextApi = {
  push: (alert: Omit<AlertItem, "id">) => string;
  remove: (id: string) => void;
  clear: () => void;
  alerts: AlertItem[];
};

const AlertContext = createContext<AlertContextApi | null>(null);

function uid(prefix = "") {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const push = useCallback((partial: Omit<AlertItem, "id">) => {
    const id = uid("alert_");
    setAlerts((s) => [{ id, ...partial }, ...s]);
    return id;
  }, []);

  const remove = useCallback((id: string) => {
    setAlerts((s) => s.filter((a) => a.id !== id));
  }, []);

  const clear = useCallback(() => setAlerts([]), []);

  const value = useMemo(
    () => ({ push, remove, clear, alerts }),
    [push, remove, clear, alerts]
  );

  return (
    <AlertContext.Provider value={value}>
      {children}
      <AlertContainer alerts={alerts} onRemove={remove} />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used inside AlertProvider");
  return ctx;
}

function variantColors(variant: AlertVariant | undefined) {
  switch (variant) {
    case "success":
      return {
        bg: "bg-green-50",
        border: "border-green-100",
        text: "text-green-800",
        icon: CheckCircle,
      };
    case "warning":
      return {
        bg: "bg-yellow-50",
        border: "border-yellow-100",
        text: "text-yellow-900",
        icon: AlertTriangle,
      };
    case "error":
      return {
        bg: "bg-red-50",
        border: "border-red-100",
        text: "text-red-900",
        icon: AlertTriangle,
      };
    default:
      return {
        bg: "bg-sky-50",
        border: "border-sky-100",
        text: "text-sky-800",
        icon: Info,
      };
  }
}

function AlertContainer({
  alerts,
  onRemove,
}: {
  alerts: AlertItem[];
  onRemove: (id: string) => void;
}) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-0 z-50 flex items-start px-4 py-6 sm:items-end sm:justify-end sm:p-6"
    >
      <div className="w-full flex flex-col gap-3 sm:items-end">
        <AnimatePresence initial={false}>
          {alerts.map((a) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-auto w-full max-w-sm"
            >
              <AlertCard alert={a} onClose={() => onRemove(a.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AlertCard({
  alert,
  onClose,
}: {
  alert: AlertItem;
  onClose: () => void;
}) {
  const Icon = variantColors(alert.variant).icon;
  const colors = variantColors(alert.variant);

  useEffect(() => {
    if (alert.duration == null) return;
    let mounted = true;
    const remaining = alert.duration!;
    const start = Date.now();
    let raf: number | null = null;
    const tick = () => {
      if (!mounted) return;
      const elapsed = Date.now() - start;
      if (elapsed >= remaining) {
        onClose();
      } else {
        raf = window.requestAnimationFrame(tick);
      }
    };
    raf = window.requestAnimationFrame(tick);
    return () => {
      mounted = false;
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [alert.id, alert.duration, onClose]);

  return (
    <div
      role="status"
      className={`rounded-2xl border ${colors.border} ${colors.bg} shadow-sm p-3 flex gap-3 items-start`}
    >
      <div className="flex-shrink-0 pt-0.5">
        <div className={`rounded-full p-1 ${colors.text} bg-white/0`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        {alert.title && (
          <div className={`font-medium ${colors.text} text-sm`}>
            {alert.title}
          </div>
        )}
        <div className="text-sm text-gray-700">{alert.message}</div>

        {alert.action && (
          <div className="mt-2">
            <button
              onClick={() => {
                try {
                  alert.action!.onClick();
                } catch (err) {
                } finally {
                  onClose();
                }
              }}
              className="inline-flex items-center rounded-md px-2.5 py-1.5 text-sm font-medium ring-1 ring-inset ring-gray-200 hover:bg-gray-50"
            >
              {alert.action.label}
            </button>
          </div>
        )}
      </div>

      <div className="flex items-start ml-2">
        <button
          onClick={onClose}
          className="inline-flex rounded-md p-1.5 text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
