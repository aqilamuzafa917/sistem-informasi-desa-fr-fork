import { Button } from "@/components/ui/button";

interface FiturDesaProps {
  loading: boolean;
  onPengaduanClick: () => void;
}

export function FiturDesaSection({
  loading,
  onPengaduanClick,
}: FiturDesaProps) {
  return (
    <section id="FiturDesa" className="w-full bg-sky-50 py-12 dark:bg-gray-800">
      <div className="container mx-auto mb-12 px-4">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Fitur Desa
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Card 1 - Request Official Letters */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
            {loading ? (
              <div className="space-y-4">
                <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-6 w-3/4 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-1/2 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              </div>
            ) : (
              <>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                  <svg
                    className="h-6 w-6 text-green-600 dark:text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                  Pengajuan Surat Keterangan
                </h3>
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                  Pengajuan Surat Keterangan
                </p>
                <p className="mb-6 text-gray-700 dark:text-gray-300">
                  Ajukan permohonan surat keterangan dan sertifikat yang
                  diperlukan untuk keperluan administrasi.
                </p>
                <Button
                  onClick={() => (window.location.href = "/pengajuansurat")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Ajukan Surat
                </Button>
              </>
            )}
          </div>
          {/* Card 2 - Track Document Status */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
            {loading ? (
              <div className="space-y-4">
                <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-6 w-3/4 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-1/2 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              </div>
            ) : (
              <>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                  <svg
                    className="h-auto w-6 text-blue-600 dark:text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                  Lacak Status Dokumen
                </h3>
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                  Memantau Status SK
                </p>
                <p className="mb-6 text-gray-700 dark:text-gray-300">
                  Periksa status dokumen dan sertifikat yang Anda ajukan secara
                  real-time.
                </p>
                <Button
                  onClick={() => (window.location.href = "/cekstatussurat")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Lacak Surat
                </Button>
              </>
            )}
          </div>
          {/* Card 3 - Emergency Information */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
            {loading ? (
              <div className="space-y-4">
                <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-6 w-3/4 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-1/2 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              </div>
            ) : (
              <>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
                  <svg
                    className="h-6 w-6 text-red-600 dark:text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                  Pengaduan Warga
                </h3>
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                  Laporkan masalah atau keluhan yang Anda hadapi.
                </p>
                <p className="mb-6 text-gray-700 dark:text-gray-300">
                  Berikan informasi yang jelas dan lengkap tentang masalah Anda.
                </p>
                <Button
                  onClick={onPengaduanClick}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Laporkan Pengaduan
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
