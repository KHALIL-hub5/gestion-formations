import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      aria-labelledby="modal-title"
      className="m-auto w-[min(92vw,36rem)] rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl backdrop:bg-slate-950/40"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      ref={dialogRef}
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="font-semibold text-slate-900" id="modal-title">{title}</h2>
        <button
          aria-label="Close dialog"
          className="grid size-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          onClick={onClose}
          type="button"
        >
          ×
        </button>
      </div>
      <div className="p-5">{children}</div>
    </dialog>
  );
}
