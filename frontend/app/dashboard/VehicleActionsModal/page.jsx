// components/dashboard/VehicleActionsModal.jsx
"use client";

import { useState } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import Modal from "../common/Modal";

export default function VehicleActionsModal({
  isOpen,
  onClose,
  vehicle,
  onEdit,
  onDelete,
  isDeleting = false,
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!vehicle) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Vehicle" size="sm">
      <div className="space-y-4">
        {/* Vehicle Info */}
        <div className="p-3 bg-[rgb(var(--muted))] rounded-lg">
          <p className="font-semibold">{vehicle.title}</p>
          <p className="text-sm text-[rgb(var(--muted-foreground))]">
            ${vehicle.price?.toLocaleString()} • {vehicle.year}
          </p>
        </div>

        <div className="space-y-2">
          {/* Edit Button */}
          <button
            onClick={() => {
              onClose();
              onEdit?.(vehicle);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[rgb(var(--muted))] transition-colors text-left"
          >
            <Pencil className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-medium">Edit Vehicle</p>
              <p className="text-sm text-[rgb(var(--muted-foreground))]">
                Update vehicle details
              </p>
            </div>
          </button>

          {/* Delete Button */}
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
            >
              <Trash2 className="w-5 h-5 text-red-500" />
              <div>
                <p className="font-medium text-red-500">Delete Vehicle</p>
                <p className="text-sm text-[rgb(var(--muted-foreground))]">
                  Permanently remove this listing
                </p>
              </div>
            </button>
          ) : (
            <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-950/20">
              <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                Are you sure? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="btn-outline btn-sm flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDelete?.(vehicle.id);
                    setConfirmDelete(false);
                  }}
                  disabled={isDeleting}
                  className="btn-danger btn-sm flex-1 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Yes, Delete"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
