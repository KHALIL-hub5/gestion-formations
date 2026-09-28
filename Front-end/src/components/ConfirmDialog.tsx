import { Button } from "./Button";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal onClose={onCancel} title={title}>
      <p className="text-sm leading-6 text-slate-600">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button onClick={onCancel} variant="secondary">Cancel</Button>
        <Button onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
