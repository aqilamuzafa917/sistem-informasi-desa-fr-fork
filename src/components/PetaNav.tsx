import { useDesa } from "@/contexts/DesaContext";

interface PetaNavProps {
  activeTab: "fasilitas" | "potensi";
}

const navigationItems = [
  {
    key: "fasilitas",
    href: "/petafasilitasdesa",
    label: "Fasilitas",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
    ),
    description: "Peta Fasilitas Desa",
  },
  {
    key: "potensi",
    href: "/petapotensidesa",
    label: "Potensi",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    ),
    description: "Peta Potensi Desa",
  },
];

export default function PetaNav({ activeTab }: PetaNavProps) {
  const { desaConfig, loading } = useDesa();

  return (
    <div className="relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20"></div>

      {/* Header Section */}
      <div className="relative px-8 py-4 text-center">
        {/* Decorative Elements */}
        <div className="absolute top-2 left-8 h-16 w-16 rounded-full bg-blue-100 opacity-60 blur-xl dark:bg-blue-900/30"></div>
        <div className="absolute top-4 right-12 h-12 w-12 rounded-full bg-indigo-100 opacity-40 blur-lg dark:bg-indigo-900/30"></div>

        {/* Main Title */}
        <div className="relative">
          <div className="mb-2 inline-flex items-center justify-center">
            <div className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500"></div>
            <span className="text-sm font-semibold tracking-wider text-blue-600 uppercase dark:text-blue-400">
              Dashboard Peta
            </span>
            <div className="ml-2 h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500"></div>
          </div>

          <h1 className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-4xl leading-tight font-bold text-transparent md:text-5xl dark:from-blue-400 dark:via-blue-300 dark:to-indigo-400">
            DESA{" "}
            {loading ? (
              <span className="inline-block h-12 w-56 animate-pulse rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"></span>
            ) : (
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm dark:from-blue-400 dark:via-blue-300 dark:to-indigo-400">
                {desaConfig?.nama_desa?.toUpperCase()}
              </span>
            )}
          </h1>

          <div className="mx-auto mt-3 max-w-2xl">
            <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
              Eksplorasi peta desa dalam visualisasi yang menarik dan mudah
              dipahami
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="px-8 pb-8">
        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-6">
          {navigationItems.map((item) => {
            const isActive = activeTab === item.key;

            return (
              <a
                key={item.key}
                href={item.href}
                className={`group relative flex h-[180px] w-[200px] transform cursor-pointer flex-col items-center rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:scale-105 ${
                  isActive
                    ? "bg-white shadow-xl ring-2 shadow-blue-500/20 ring-blue-500/20 dark:bg-gray-800 dark:shadow-blue-400/10 dark:ring-blue-400/30"
                    : "bg-white/80 shadow-lg backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 dark:bg-gray-800/80 dark:hover:shadow-blue-400/5"
                }`}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute -top-1 left-1/2 h-1 w-12 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                )}

                {/* Icon Container */}
                <div
                  className={`relative mb-4 rounded-xl p-4 transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30"
                      : "bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-indigo-600 dark:bg-gray-700"
                  }`}
                >
                  {/* Icon Glow Effect */}
                  {isActive && (
                    <div className="absolute inset-0 animate-pulse rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 opacity-75 blur"></div>
                  )}

                  <svg
                    className={`relative h-8 w-8 transition-all duration-300 ${
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

                {/* Text Content */}
                <div className="flex flex-1 flex-col justify-center text-center">
                  <h3
                    className={`mb-1 text-lg font-bold transition-colors duration-300 ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-800 group-hover:text-blue-600 dark:text-gray-200 dark:group-hover:text-blue-400"
                    }`}
                  >
                    {item.label}
                  </h3>

                  <p
                    className={`text-sm transition-colors duration-300 ${
                      isActive
                        ? "text-blue-500 dark:text-blue-300"
                        : "text-gray-500 group-hover:text-blue-500 dark:text-gray-400 dark:group-hover:text-blue-300"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
