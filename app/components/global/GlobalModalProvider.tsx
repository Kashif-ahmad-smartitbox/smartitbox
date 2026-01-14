"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type ModalProps = {
  id: string;
  title?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  closable?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  onClose?: () => void;
};

type ShowModalOptions = Omit<ModalProps, "id">;

type ModalContextValue = {
  show: (opts: ShowModalOptions) => string;
  close: (id?: string) => void;
  confirm: (
    opts: ShowModalOptions & { confirmText?: string; cancelText?: string }
  ) => Promise<boolean>;
};

const ModalContext = createContext<ModalContextValue | null>(null);

const createIdGenerator = () => {
  let i = 0;
  return () => (++i).toString();
};

const idGenerator = createIdGenerator();

function useModalContext() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}

export function GlobalModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [modals, setModals] = useState<ModalProps[]>([]);

  const show = useCallback((opts: ShowModalOptions) => {
    const id = idGenerator();
    setModals((m) => [...m, { id, ...opts }]);
    return id;
  }, []);

  const close = useCallback((id?: string) => {
    setModals((m) => {
      if (!id) return [];
      return m.filter((x) => x.id !== id);
    });
  }, []);

  const confirm = useCallback(
    (
      opts: ShowModalOptions & { confirmText?: string; cancelText?: string }
    ) => {
      return new Promise<boolean>((resolve) => {
        const id = idGenerator();

        const handleClose = (result: boolean) => {
          setModals((m) => m.filter((x) => x.id !== id));
          resolve(result);
        };

        const footer = (
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => handleClose(false)}
              className="px-3 py-2 rounded-lg border text-sm"
            >
              {opts.cancelText || "Cancel"}
            </button>
            <button
              onClick={() => handleClose(true)}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold"
            >
              {opts.confirmText || "Confirm"}
            </button>
          </div>
        );

        setModals((m) => [
          ...m,
          { id, ...opts, footer, onClose: () => handleClose(false) },
        ]);
      });
    },
    []
  );

  const value = useMemo(
    () => ({ show, close, confirm }),
    [show, close, confirm]
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ModalRoot modals={modals} onClose={close} />
    </ModalContext.Provider>
  );
}

function ModalRoot({
  modals,
  onClose,
}: {
  modals: ModalProps[];
  onClose: (id?: string) => void;
}) {
  // render at end of body
  const el = useMemo(() => {
    if (typeof document === "undefined") return null;
    const mount = document.createElement("div");
    mount.setAttribute("id", "__global_modal_root");
    return mount;
  }, []);

  useEffect(() => {
    if (!el) return;
    document.body.appendChild(el);
    return () => {
      if (document.body.contains(el)) document.body.removeChild(el);
    };
  }, [el]);

  if (!el) return null;

  return createPortal(
    <>
      {modals.map((modal) => (
        <Modal key={modal.id} {...modal} onClose={() => onClose(modal.id)} />
      ))}
    </>,
    el
  );
}

function Modal({
  title,
  body,
  footer,
  closable = true,
  size = "md",
  onClose,
}: Omit<ModalProps, "id"> & { onClose?: () => void }) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [closing, setClosing] = useState(false);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      onClose?.();
    }, 180);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closable) {
        handleClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closable, handleClose]);

  useEffect(() => {
    const el = dialogRef.current;
    if (el) {
      const previouslyFocused = document.activeElement as HTMLElement | null;
      el.focus();
      return () => previouslyFocused?.focus?.();
    }
  }, []);

  const sizeClass = (() => {
    switch (size) {
      case "sm":
        return "max-w-md";
      case "lg":
        return "max-w-3xl";
      case "xl":
        return "max-w-5xl";
      default:
        return "max-w-2xl";
    }
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div
        ref={overlayRef}
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          closing ? "opacity-0" : "opacity-100"
        }`}
        onClick={() => closable && handleClose()}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={`relative w-full ${sizeClass} mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden transition-transform transform ${
          closing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <div className="p-5 border-b border-gray-100 flex items-start justify-between gap-3">
          <div className="flex-1">
            {typeof title === "string" ? (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            ) : (
              title
            )}
          </div>
          {closable && (
            <button
              aria-label="Close"
              onClick={handleClose}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>

        <div className="p-6">{body}</div>

        {footer && <div className="p-4 border-t border-gray-100">{footer}</div>}
      </div>
    </div>
  );
}

// convenience hook
export function useModal() {
  return useModalContext();
}

// convenience Confirm helper (uses modal confirm under the hood)
export async function showConfirm(_opts: {
  title?: React.ReactNode;
  body?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  // This helper requires that you call useModal().confirm from a component.
  throw new Error("showConfirm helper must be called via useModal().confirm()");
}
