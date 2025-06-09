import NavbarDesa from "@/components/NavbarDesa";
import FooterDesa from "@/components/FooterDesa";
import { Card, CardContent } from "@/components/ui/card";

export default function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <NavbarDesa />

      {/* Header Loading Skeleton */}
      <div className="relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20"></div>

        {/* Header Content */}
        <div className="relative px-8 py-12 text-center">
          {/* Decorative Elements */}
          <div className="absolute top-2 left-8 h-16 w-16 rounded-full bg-blue-100 opacity-60 blur-xl dark:bg-blue-900/30"></div>
          <div className="absolute top-4 right-12 h-12 w-12 rounded-full bg-indigo-100 opacity-40 blur-lg dark:bg-indigo-900/30"></div>

          {/* Main Title */}
          <div className="relative">
            <div className="mb-3 inline-flex items-center justify-center">
              <div className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500/50"></div>
              <div className="h-5 w-32 animate-pulse rounded-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
              <div className="ml-2 h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500/50"></div>
            </div>

            <div className="mx-auto mb-4 h-14 w-2/3 animate-pulse rounded-xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>

            <div className="mx-auto mt-4 max-w-2xl">
              <div className="mx-auto h-5 w-3/4 animate-pulse rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Visi & Misi Loading Skeleton */}
      <section className="w-full bg-white py-12 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 h-9 w-40 animate-pulse rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>

          <div className="flex flex-col gap-10">
            {/* Visi Card Skeleton */}
            <Card className="mx-auto w-full max-w-4xl shadow-lg">
              <CardContent className="p-10">
                <div className="mx-auto mb-8 h-10 w-28 animate-pulse rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
                <div className="space-y-4">
                  <div className="mx-auto h-7 w-4/5 animate-pulse rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
                  <div className="mx-auto h-7 w-5/6 animate-pulse rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
                  <div className="mx-auto h-7 w-3/4 animate-pulse rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
                </div>
              </CardContent>
            </Card>

            {/* Misi Card Skeleton */}
            <Card className="mx-auto w-full max-w-4xl shadow-lg">
              <CardContent className="p-10">
                <div className="mx-auto mb-8 h-10 w-28 animate-pulse rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>

                {/* Introduction paragraph skeleton */}
                <div className="mb-10 space-y-4">
                  <div className="h-6 w-full animate-pulse rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
                  <div className="h-6 w-5/6 animate-pulse rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
                  <div className="h-6 w-4/6 animate-pulse rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
                </div>

                {/* Mission points skeleton */}
                <div className="space-y-5">
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 pl-5"
                    >
                      <div className="mt-2.5 h-2.5 w-2.5 animate-pulse rounded-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
                      <div className="h-6 w-full animate-pulse rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sejarah Section Skeleton */}
      <section className="w-full bg-gray-50 py-12 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 h-9 w-40 animate-pulse rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
          <div className="mx-auto max-w-4xl space-y-5">
            <div className="h-6 w-full animate-pulse rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
            <div className="h-6 w-5/6 animate-pulse rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
            <div className="h-6 w-4/6 animate-pulse rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
            <div className="h-6 w-5/6 animate-pulse rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
            <div className="h-6 w-3/4 animate-pulse rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
          </div>
        </div>
      </section>

      {/* Struktur Organisasi Section Skeleton */}
      <section className="w-full bg-white py-12 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 h-9 w-56 animate-pulse rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
          <div className="mx-auto aspect-[16/9] max-w-4xl animate-pulse rounded-xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
        </div>
      </section>

      {/* Peta Lokasi Section Skeleton */}
      <section className="w-full bg-gray-50 py-12 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 h-9 w-40 animate-pulse rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="h-28 animate-pulse rounded-xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
              <div className="h-28 animate-pulse rounded-xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
            </div>
            <div className="aspect-[16/9] w-full animate-pulse rounded-xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
          </div>
        </div>
      </section>

      <FooterDesa />
    </main>
  );
}
