import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <div className="py-12 text-center">
      <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
        Terjadi Kesalahan
      </h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{error}</p>
      <button
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
      >
        <RefreshCw className="h-4 w-4" />
        Coba Lagi
      </button>
    </div>
  );
};
