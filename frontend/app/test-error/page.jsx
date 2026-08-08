"use client";

import { useState } from "react";

export default function TestErrorPage() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error("🔥 Test error from client component!");
  }

  return (
    <div className="container-custom py-12 text-center">
      <h1 className="text-2xl font-bold mb-4">🧪 Error Test Page</h1>
      <p className="text-[rgb(var(--muted-foreground))] mb-6">
        Click the button below to trigger an error.
      </p>
      <button onClick={() => setShouldError(true)} className="btn-danger">
        💥 Trigger Error
      </button>
      <div className="mt-8 text-sm text-[rgb(var(--muted-foreground))]">
        <p>
          This will test the{" "}
          <code className="bg-[rgb(var(--muted))] px-2 py-1 rounded">
            error.jsx
          </code>{" "}
          component.
        </p>
      </div>
    </div>
  );
}
