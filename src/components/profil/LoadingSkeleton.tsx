import NavbarDesa from "@/components/NavbarDesa";
import FooterDesa from "@/components/FooterDesa";

export default function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <NavbarDesa />
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto h-12 w-3/4 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        <div className="mt-16 space-y-12">
          <div className="h-64 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-48 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-96 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
      <FooterDesa />
    </main>
  );
}
