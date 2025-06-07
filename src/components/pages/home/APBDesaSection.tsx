import * as React from "react";
import axios from "axios";
import { API_CONFIG } from "@/config/api";
import { APBDesaResponse } from "@/types/desa";
import { formatRupiah } from "@/utils/formatters";
import { ErrorState } from "@/components/ui/ErrorState";

export function APBDesaSection() {
  const [apbDesaData, setApbDesaData] = React.useState<APBDesaResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchAPBDesa = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get<APBDesaResponse>(
        `${API_CONFIG.baseURL}/api/publik/apbdesa/multi-tahun`,
        { headers: API_CONFIG.headers },
      );
      setApbDesaData(response.data);
    } catch (err) {
      console.error("Error fetching APB Desa data:", err);
      setError("Gagal mengambil data APB Desa");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAPBDesa();
    const interval = setInterval(fetchAPBDesa, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const latestYearData = React.useMemo(() => {
    if (!apbDesaData?.data) return null;
    return apbDesaData.data[0]; // Assuming data is sorted by year descending
  }, [apbDesaData]);

  if (error) {
    return <ErrorState error={error} onRetry={fetchAPBDesa} />;
  }

  return (
    <div className="mb-8">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col items-stretch md:flex-row">
          {/* Left Section - SVG with New Design */}
          <div
            className="relative flex flex-shrink-0 items-center justify-center overflow-hidden p-4 md:w-1/4"
            style={{
              background: `linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)`,
            }}
          >
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-8 left-8 h-20 w-20 rounded-full bg-white"></div>
              <div className="absolute right-6 bottom-12 h-16 w-16 rounded-full bg-white"></div>
              <div className="absolute top-1/2 left-1/4 h-12 w-12 rounded-full bg-white"></div>
              <div className="absolute top-16 right-16 h-8 w-8 rounded-full bg-white/30"></div>
            </div>

            {/* Modern SVG Replacement */}
            <div className="relative z-10 text-center text-white">
              <div className="mb-2">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 className="mb-2 text-2xl font-bold">APB Desa</h3>
                <p className="text-lg opacity-90">Transparansi Keuangan</p>
              </div>
            </div>
          </div>

          {/* Right Section - APB Information */}
          <div className="flex-1 bg-gradient-to-br from-white to-gray-50 p-8 dark:from-gray-800 dark:to-gray-900">
            {isLoading ? (
              <div className="space-y-6">
                <div className="mb-8">
                  <div className="mb-2 h-8 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-4 w-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="space-y-6">
                  {/* Income Card Loading */}
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"></div>
                        <div>
                          <div className="mb-2 h-6 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                          <div className="h-4 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                      </div>
                    </div>
                    <div className="h-10 w-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                  </div>

                  {/* Expense Card Loading */}
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"></div>
                        <div>
                          <div className="mb-2 h-6 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                          <div className="h-4 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                      </div>
                    </div>
                    <div className="h-10 w-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                  </div>

                  {/* Balance Card Loading */}
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"></div>
                        <div>
                          <div className="mb-2 h-6 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                          <div className="h-4 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                      </div>
                    </div>
                    <div className="h-10 w-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                </div>

                {/* Button Loading */}
                <div className="mt-8">
                  <div className="h-14 w-full animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">
                    APB DESA{" "}
                    <span className="text-blue-600 dark:text-blue-400">
                      {latestYearData?.tahun_anggaran}
                    </span>
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Anggaran Pendapatan dan Belanja Desa
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Income Card */}
                  <div className="group relative overflow-hidden rounded-2xl border border-green-100 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="absolute top-0 right-0 h-32 w-32 opacity-5 transition-opacity group-hover:opacity-10">
                      <svg
                        width="100"
                        height="100"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#48cc6c"
                        strokeWidth="2"
                      >
                        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
                      </svg>
                    </div>
                    <div className="relative z-10">
                      <div className="mb-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-green-100 p-3 transition-transform duration-200 group-hover:scale-110 dark:bg-green-900/30">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#48cc6c"
                              strokeWidth="2"
                              className="text-green-600 dark:text-green-400"
                            >
                              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                              Total Pendapatan
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Tahun {latestYearData?.tahun_anggaran}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-green-600 sm:text-3xl dark:text-green-400">
                        {latestYearData
                          ? formatRupiah(
                              parseFloat(latestYearData.total_pendapatan),
                            )
                          : "Rp0,00"}
                      </p>
                    </div>
                  </div>

                  {/* Expense Card */}
                  <div className="group relative overflow-hidden rounded-2xl border border-red-100 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="absolute top-0 right-0 h-32 w-32 opacity-5 transition-opacity group-hover:opacity-10">
                      <svg
                        width="100"
                        height="100"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                      >
                        <polyline points="22,12 18,12 15,3 9,21 6,12 2,12" />
                      </svg>
                    </div>
                    <div className="relative z-10">
                      <div className="mb-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-red-100 p-3 transition-transform duration-200 group-hover:scale-110 dark:bg-red-900/30">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#ef4444"
                              strokeWidth="2"
                              className="text-red-600 dark:text-red-400"
                            >
                              <rect x="2" y="5" width="20" height="14" rx="2" />
                              <line x1="2" y1="10" x2="22" y2="10" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                              Total Belanja
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Tahun {latestYearData?.tahun_anggaran}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-red-600 sm:text-3xl dark:text-red-400">
                        {latestYearData
                          ? formatRupiah(
                              parseFloat(latestYearData.total_belanja),
                            )
                          : "Rp0,00"}
                      </p>
                    </div>
                  </div>

                  {/* Balance Card */}
                  <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="absolute top-0 right-0 h-32 w-32 opacity-5 transition-opacity group-hover:opacity-10">
                      <svg
                        width="100"
                        height="100"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v8" />
                        <path d="M8 12h8" />
                      </svg>
                    </div>
                    <div className="relative z-10">
                      <div className="mb-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-blue-100 p-3 transition-transform duration-200 group-hover:scale-110 dark:bg-blue-900/30">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="2"
                              className="text-blue-600 dark:text-blue-400"
                            >
                              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                              Saldo Sisa
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Tahun {latestYearData?.tahun_anggaran}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-blue-600 sm:text-3xl dark:text-blue-400">
                        {latestYearData
                          ? formatRupiah(
                              parseFloat(latestYearData.total_pendapatan) -
                                parseFloat(latestYearData.total_belanja),
                            )
                          : "Rp0,00"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <a href="/Infografis/apbdesa" className="block">
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
