// app/loading.jsx
export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[rgb(var(--background))]">
      <div className="flex flex-col items-center gap-4">
        {/* ===== Spinner ===== */}
        <div className="w-12 h-12 border-4 border-[rgb(var(--border))] border-t-primary-500 rounded-full animate-spin"></div>

        {/* ===== Text ===== */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[rgb(var(--foreground))]">
            Loading...
          </h2>
          <p className="text-sm text-[rgb(var(--muted-foreground))] mt-1">
            Please wait while we load the page
          </p>
        </div>
      </div>
    </div>
  );
}
