"use client";

import { useEffect, useState } from "react";

export default function TestGlobalErrorPage() {
  const [shouldError, setShouldError] = useState(false);

  useEffect(() => {
    if (shouldError) {
      throw new Error("🔥 Global error test!");
    }
  }, [shouldError]);

  if (shouldError) {
    throw new Error("🔥 This is a test error!");
  }

  return (
    <div className="container-custom py-12 text-center">
      <h1 className="text-2xl font-bold mb-4">🌐 Global Error Test</h1>
      <p className="text-[rgb(var(--muted-foreground))] mb-6">
        Click the button below to trigger a global error.
      </p>
      <button onClick={() => setShouldError(true)} className="btn-danger">
        💥 Trigger Global Error
      </button>
      <div className="mt-8 text-sm text-[rgb(var(--muted-foreground))]">
        <p>
          This will test the{" "}
          <code className="bg-[rgb(var(--muted))] px-2 py-1 rounded">
            global-error.jsx
          </code>{" "}
          component.
        </p>
      </div>
    </div>
  );
}
