import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

function ErrorFallback({ resetErrorBoundary }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-gray-50 px-4 text-center">
      <h1 className="text-xl font-semibold text-gray-800">
        Something went wrong
      </h1>
      <p className="text-sm text-gray-500 max-w-md">
        Please refresh the page. If this keeps happening, contact Softet
        support.
      </p>
      <button
        type="button"
        onClick={resetErrorBoundary}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm"
      >
        Try again
      </button>
    </div>
  );
}

export default function ErrorBoundary({ children }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error("App crashed:", error, info);
      }}
      onReset={() => {
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
