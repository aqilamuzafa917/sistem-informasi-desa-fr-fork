import * as React from "react";
import { BarChart3 } from "lucide-react";

interface IdmSectionProps {
  loading?: boolean;
}

export function IdmSection({ loading = false }: IdmSectionProps) {
  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col items-stretch md:flex-row">
          {/* Left Section - IDM Information */}
          <div className="flex-1 bg-gradient-to-br from-white to-gray-50 p-8 dark:from-gray-800 dark:to-gray-900">
            <div className="mb-8">
              <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">
                Indeks Desa Membangun (IDM){" "}
                {loading ? (
                  <span className="inline-block h-6 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></span>
                ) : (
                  <span className="text-blue-600 dark:text-blue-400">2024</span>
                )}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Indikator pembangunan desa yang mencakup aspek sosial, ekonomi,
                dan ekologi
              </p>
            </div>

            <div className="space-y-6">
              {/* Skor dan Status IDM */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="relative z-10">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Skor IDM
                      </h3>
                      <div className="rounded-xl bg-blue-100 p-3 transition-transform duration-200 group-hover:scale-110 dark:bg-blue-900/30">
                        <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    {loading ? (
                      <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                    ) : (
                      <p className="text-2xl font-bold text-blue-600 sm:text-3xl dark:text-blue-400">
                        0.7925
                      </p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Indeks Komposit
                    </p>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-green-100 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="relative z-10">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Status IDM
                      </h3>
                      <div className="rounded-xl bg-green-100 p-3 transition-transform duration-200 group-hover:scale-110 dark:bg-green-900/30">
                        <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    {loading ? (
                      <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                    ) : (
                      <p className="text-2xl font-bold text-green-600 sm:text-3xl dark:text-green-400">
                        Maju
                      </p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Kategori Pembangunan
                    </p>
                  </div>
                </div>
              </div>

              {/* Komponen IDM */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* IKS Card */}
                <div className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="relative z-10">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        IKS
                      </h3>
                      <div className="rounded-xl bg-purple-100 p-3 transition-transform duration-200 group-hover:scale-110 dark:bg-purple-900/30">
                        <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    {loading ? (
                      <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                    ) : (
                      <p className="text-2xl font-bold text-purple-600 sm:text-3xl dark:text-purple-400">
                        0.8234
                      </p>
                    )}
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      {loading ? (
                        <div className="h-full w-1/2 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      ) : (
                        <div
                          className="h-full rounded-full bg-purple-600 dark:bg-purple-400"
                          style={{ width: "82.34%" }}
                        ></div>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Indeks Ketahanan Sosial
                    </p>
                  </div>
                </div>

                {/* IKE Card */}
                <div className="group relative overflow-hidden rounded-2xl border border-orange-100 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="relative z-10">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        IKE
                      </h3>
                      <div className="rounded-xl bg-orange-100 p-3 transition-transform duration-200 group-hover:scale-110 dark:bg-orange-900/30">
                        <BarChart3 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      </div>
                    </div>
                    {loading ? (
                      <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                    ) : (
                      <p className="text-2xl font-bold text-orange-600 sm:text-3xl dark:text-orange-400">
                        0.7654
                      </p>
                    )}
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      {loading ? (
                        <div className="h-full w-1/2 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      ) : (
                        <div
                          className="h-full rounded-full bg-orange-600 dark:bg-orange-400"
                          style={{ width: "76.54%" }}
                        ></div>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Indeks Ketahanan Ekonomi
                    </p>
                  </div>
                </div>

                {/* IKL Card */}
                <div className="group relative overflow-hidden rounded-2xl border border-teal-100 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="relative z-10">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        IKL
                      </h3>
                      <div className="rounded-xl bg-teal-100 p-3 transition-transform duration-200 group-hover:scale-110 dark:bg-teal-900/30">
                        <BarChart3 className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                      </div>
                    </div>
                    {loading ? (
                      <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                    ) : (
                      <p className="text-2xl font-bold text-teal-600 sm:text-3xl dark:text-teal-400">
                        0.7890
                      </p>
                    )}
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      {loading ? (
                        <div className="h-full w-1/2 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      ) : (
                        <div
                          className="h-full rounded-full bg-teal-600 dark:bg-teal-400"
                          style={{ width: "78.90%" }}
                        ></div>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Indeks Ketahanan Lingkungan
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <a href="/Infografis/idm" className="block">
                <button className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                  LIHAT DATA LEBIH LENGKAP
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <polyline points="9,18 15,12 9,6" />
                  </svg>
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
