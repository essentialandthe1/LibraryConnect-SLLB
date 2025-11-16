import React from "react";
import { X } from "lucide-react";

export function Toast({ title, description, action, open, onOpenChange }) {
  return (
    <div
      className={`fixed right-4 top-4 w-80 rounded-md border bg-white dark:bg-gray-900 shadow-lg transition-all ${
        open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <div className="p-4">
        {title && <p className="font-medium text-gray-900 dark:text-gray-100">{title}</p>}
        {description && (
          <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">{description}</p>
        )}

        <div className="flex justify-between mt-3">
          {action}

          <button
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => onOpenChange(false)}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
