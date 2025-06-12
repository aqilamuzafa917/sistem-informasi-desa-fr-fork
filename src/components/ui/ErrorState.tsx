import { AlertCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  isLoading?: boolean;
}

export const ErrorState = ({
  error,
  onRetry,
  isLoading = false,
}: ErrorStateProps) => {
  return (
    <div className="py-12 text-center">
      <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
        Terjadi Kesalahan
      </h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{error}</p>
      <button
        onClick={onRetry}
        disabled={isLoading}
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
      >
        {isLoading ? <Spinner size="sm" /> : "Coba Lagi"}
      </button>
    </div>
  );
};
