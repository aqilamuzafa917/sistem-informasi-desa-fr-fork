import NavbarDesa from "@/components/NavbarDesa";
import FooterDesa from "@/components/FooterDesa";

interface ErrorStateProps {
  message?: string;
}

export default function ErrorState({
  message = "An unexpected error occurred.",
}: ErrorStateProps) {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <NavbarDesa />
      <div className="container mx-auto flex h-[60vh] items-center justify-center px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
            Error!
          </h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Could not load village profile data.
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {message}
          </p>
        </div>
      </div>
      <FooterDesa />
    </main>
  );
}
