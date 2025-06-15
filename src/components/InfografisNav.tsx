import { useDesa } from "@/contexts/DesaContext";

interface InfografisNavProps {
  activeTab: "penduduk" | "apbdesa" | "idm";
}

const navigationItems = [
  {
    key: "penduduk",
    href: "/infografis/penduduk",
    label: "Penduduk",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    ),
    description: "Data Demografi",
  },
  {
    key: "apbdesa",
    href: "/infografis/apbdesa",
    label: "APBDes",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    ),
    description: "Anggaran Desa",
  },
  {
    key: "idm",
    href: "/infografis/idm",
    label: "IDM",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    ),
    description: "Indeks Desa Membangun",
  },
];

export default function InfografisNav({ activeTab }: InfografisNavProps) {
  const { desaConfig, loading } = useDesa();

  return (
    <div className="relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20"></div>

      {/* Header Section */}
      <div className="relative px-3 py-3 text-center sm:px-6 sm:py-4 md:px-8">
        {/* Decorative Elements */}
        <div className="absolute top-2 left-4 h-8 w-8 rounded-full bg-blue-100 opacity-60 blur-xl sm:left-8 sm:h-16 sm:w-16 dark:bg-blue-900/30"></div>
        <div className="absolute top-4 right-6 h-6 w-6 rounded-full bg-indigo-100 opacity-40 blur-lg sm:right-12 sm:h-12 sm:w-12 dark:bg-indigo-900/30"></div>

        {/* Main Title */}
        <div className="relative">
          <div className="mb-2 inline-flex items-center justify-center">
            <div className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500"></div>
            <span className="text-sm font-semibold tracking-wider text-blue-600 uppercase dark:text-blue-400">
              Dashboard Infografis
            </span>
            <div className="ml-2 h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500"></div>
          </div>

          <h1 className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-xl leading-tight font-bold text-transparent sm:text-3xl md:text-4xl lg:text-5xl dark:from-blue-400 dark:via-blue-300 dark:to-indigo-400">
            DESA{" "}
            {loading ? (
              <span className="inline-block h-6 w-24 animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 sm:h-10 sm:w-48 md:h-12 md:w-56 dark:from-gray-700 dark:to-gray-600"></span>
            ) : (
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm dark:from-blue-400 dark:via-blue-300 dark:to-indigo-400">
                {desaConfig?.nama_desa?.toUpperCase()}
              </span>
            )}
          </h1>

          <div className="mx-auto mt-3 max-w-2xl">
            <p className="text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-300">
              Eksplorasi data dan statistik desa dalam visualisasi yang menarik
              dan mudah dipahami
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="px-4 pb-6 sm:px-6 md:px-8 md:pb-8">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-6">
          {navigationItems.map((item) => {
            const isActive = activeTab === item.key;

            return (
              <a
                key={item.key}
                href={item.href}
                className={`group relative flex flex-col items-center rounded-xl bg-white/60 p-3 shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg sm:h-[180px] sm:w-[200px] sm:rounded-2xl sm:bg-white/80 sm:p-6 sm:shadow-lg sm:hover:-translate-y-1 sm:hover:scale-105 sm:hover:shadow-xl sm:hover:shadow-blue-500/10 dark:bg-gray-800/60 dark:sm:bg-gray-800/80 dark:sm:hover:shadow-blue-400/5 ${
                  isActive
                    ? "bg-white shadow-lg ring-2 ring-blue-500/30 sm:bg-white sm:shadow-xl sm:ring-2 sm:shadow-blue-500/20 sm:ring-blue-500/20 dark:bg-gray-800 dark:ring-blue-400/40 dark:sm:bg-gray-800 dark:sm:shadow-blue-400/10 dark:sm:ring-blue-400/30"
                    : ""
                }`}
              >
                {/* Active Indicator - Only show on desktop */}
                {isActive && (
                  <div className="absolute -top-1 left-1/2 hidden h-1 w-12 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 sm:block"></div>
                )}

                {/* Icon Container */}
                <div
                  className={`relative mb-1 flex items-center justify-center rounded-lg p-2 transition-all duration-300 sm:mb-4 sm:rounded-xl sm:p-4 ${
                    isActive
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30"
                      : "bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-indigo-600 dark:bg-gray-700"
                  }`}
                >
                  {/* Icon Glow Effect - Only show on desktop */}
                  {isActive && (
                    <div className="absolute inset-0 hidden animate-pulse rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 opacity-75 blur sm:block"></div>
                  )}

                  <svg
                    className={`relative h-6 w-6 transition-all duration-300 sm:h-8 sm:w-8 ${
                      isActive
                        ? "text-white"
                        : "text-gray-600 group-hover:text-white dark:text-gray-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {item.icon}
                  </svg>
                </div>

                {/* Active Indicator for Mobile */}
                {isActive && (
                  <div className="absolute -bottom-0.5 left-1/2 h-0.5 w-8 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 sm:hidden"></div>
                )}

                {/* Text Content */}
                <div className="flex flex-col justify-center text-center">
                  <h3
                    className={`text-xs leading-tight font-semibold transition-colors duration-300 sm:mb-1 sm:text-lg sm:font-bold ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-800 group-hover:text-blue-600 dark:text-gray-200 dark:group-hover:text-blue-400"
                    }`}
                  >
                    {item.label}
                  </h3>

                  {/* Description - Only show on desktop */}
                  <p
                    className={`hidden text-sm transition-colors duration-300 sm:block ${
                      isActive
                        ? "text-blue-500 dark:text-blue-300"
                        : "text-gray-500 group-hover:text-blue-500 dark:text-gray-400 dark:group-hover:text-blue-300"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>

                {/* Hover Effect Overlay - Only show on desktop */}
                <div className="absolute inset-0 hidden rounded-2xl bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block"></div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
