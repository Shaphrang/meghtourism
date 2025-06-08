import { Dialog } from '@headlessui/react';

interface Props {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  itemName: string;
}

export default function DeleteConfirmModal({ open, onCancel, onConfirm, itemName }: Props) {
  return (
    <Dialog open={open} onClose={onCancel} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="bg-white p-6 rounded-lg z-10 w-full max-w-md shadow-xl">
        <Dialog.Title className="text-lg font-semibold mb-2">
          Delete Confirmation
        </Dialog.Title>
        <p className="text-sm text-gray-700 mb-4">
          Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </Dialog>
  );
}
