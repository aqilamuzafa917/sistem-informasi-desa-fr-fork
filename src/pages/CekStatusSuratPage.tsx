import { useState } from "react";
import {
  Button,
  Table,
  Spinner,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeadCell,
} from "flowbite-react";
import { Card } from "@/components/ui/card";
import NavbarDesa from "@/components/NavbarDesa";
import FooterDesa from "@/components/FooterDesa";
import { API_CONFIG } from "../config/api";
import {
  HiDownload,
  HiSearch,
  HiDocumentText,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiExclamationCircle,
} from "react-icons/hi";

// Define the interface for the API response
interface SuratApiResponse {
  id_surat: number;
  nomor_surat: string | null;
  jenis_surat: string;
  tanggal_pengajuan: string;
  tanggal_disetujui: string | null;
  nik_pemohon: string;
  keperluan: string;
  status_surat: string;
  catatan: string | null;
  created_at: string;
  updated_at: string;
  attachment_bukti_pendukung: string | null;
}

export default function CekStatusSuratPage() {
  const [nik, setNik] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusData, setStatusData] = useState<SuratApiResponse[] | null>(null);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNik(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setStatusData(null);

    if (!nik || nik.length < 16) {
      setError("NIK harus terdiri dari 16 digit");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}/api/publik/surat/${nik}`,
        {
          headers: {
            ...API_CONFIG.headers,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Gagal mengambil data status surat." }));
        throw new Error(
          errorData.message ||
            `Error ${response.status}: ${response.statusText}`,
        );
      }

      const responseData = await response.json();

      let candidateSuratItems: SuratApiResponse[] = [];

      if (responseData) {
        // Check for the structure like { "data": [...] }
        if (Array.isArray(responseData.data)) {
          candidateSuratItems = responseData.data;
        }
        // Check if the responseData itself is an array [...]
        else if (Array.isArray(responseData)) {
          candidateSuratItems = responseData;
        }
        // Check if responseData is a single surat object (e.g., has an id_surat property)
        else if (
          typeof responseData === "object" &&
          responseData.id_surat !== undefined
        ) {
          candidateSuratItems = [responseData as SuratApiResponse];
        }
        // If responseData is an object but doesn't fit the known structures for a list or single item,
        // candidateSuratItems will remain empty.
      }
      // If responseData was null or undefined, candidateSuratItems also remains empty.

      // Apply the filter to the extracted items
      const filteredData = candidateSuratItems.filter(
        (surat) => surat.nik_pemohon === nik,
      );

      if (filteredData.length > 0) {
        setStatusData(filteredData);
      } else {
        setStatusData([]);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan yang tidak diketahui.");
      }
      setStatusData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Disetujui":
        return {
          bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
          textColor: "text-emerald-700 dark:text-emerald-300",
          borderColor: "border-emerald-200 dark:border-emerald-800",
          icon: <HiCheckCircle className="h-4 w-4" />,
        };
      case "Diajukan":
        return {
          bgColor: "bg-amber-50 dark:bg-amber-900/20",
          textColor: "text-amber-700 dark:text-amber-300",
          borderColor: "border-amber-200 dark:border-amber-800",
          icon: <HiClock className="h-4 w-4" />,
        };
      case "Ditolak":
        return {
          bgColor: "bg-red-50 dark:bg-red-900/20",
          textColor: "text-red-700 dark:text-red-300",
          borderColor: "border-red-200 dark:border-red-800",
          icon: <HiXCircle className="h-4 w-4" />,
        };
      default:
        return {
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
          textColor: "text-blue-700 dark:text-blue-300",
          borderColor: "border-blue-200 dark:border-blue-800",
          icon: <HiExclamationCircle className="h-4 w-4" />,
        };
    }
  };

  const renderStatusBadge = (status: string) => {
    const config = getStatusConfig(status);

    return (
      <div
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${config.bgColor} ${config.textColor} ${config.borderColor}`}
      >
        {config.icon}
        <span>{status}</span>
      </div>
    );
  };

  const formatJenisSurat = (jenis: string) => {
    return jenis
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toUpperCase())
      .join(" ");
  };

  const handleDownloadPdf = async (nik_pemohon: string, id_surat: number) => {
    setIsLoading(true);
    try {
      const pdfUrl = `${API_CONFIG.baseURL}/api/publik/surat/${nik_pemohon}/${id_surat}/pdf`;
      const response = await fetch(pdfUrl, {
        headers: {
          ...API_CONFIG.headers,
        },
      });

      if (!response.ok) {
        let errorMessage = `Gagal mengunduh PDF. Status: ${response.status}`;
        try {
          // Attempt to parse error message from API if it returns JSON
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // If response is not JSON or error parsing, use the status-based message
        }
        throw new Error(errorMessage);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `surat_${nik_pemohon}_${id_surat}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setError(""); // Clear previous errors on successful download
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan yang tidak diketahui saat mengunduh PDF.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatsData = () => {
    if (!statusData || statusData.length === 0) return null;

    const stats = {
      total: statusData.length,
      disetujui: statusData.filter((s) => s.status_surat === "Disetujui")
        .length,
      diajukan: statusData.filter((s) => s.status_surat === "Diajukan").length,
      ditolak: statusData.filter((s) => s.status_surat === "Ditolak").length,
    };

    return stats;
  };

  const stats = getStatsData();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <NavbarDesa />

      <div className="container mx-auto flex-grow px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <HiDocumentText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Cek Status Surat
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Pantau perkembangan pengajuan surat Anda dengan mudah
          </p>
        </div>

        {/* Search Card */}
        <Card className="mb-8 border-0 bg-white shadow-lg dark:bg-gray-800">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-3 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Nomor Induk Kependudukan (NIK)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 p-4 pr-24 text-lg transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:bg-gray-800 dark:focus:ring-blue-900/20"
                    placeholder="Masukkan 16 digit NIK Anda"
                    value={nik}
                    onChange={handleInputChange}
                    maxLength={16}
                    pattern="\d*"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute top-2 right-2 flex h-12 w-20 items-center justify-center rounded-md bg-blue-600 text-white transition-colors duration-200 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Spinner size="sm" />
                    ) : (
                      <HiSearch className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {error && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
                    <HiXCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <Card className="border-0 bg-white shadow-lg dark:bg-gray-800">
            <div className="flex flex-col items-center justify-center py-16">
              <Spinner size="xl" />
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Mencari data pengajuan surat...
              </p>
            </div>
          </Card>
        )}

        {/* Statistics Cards */}
        {!isLoading && stats && (
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Surat
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.total}
                  </p>
                </div>
                <HiDocumentText className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Disetujui
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {stats.disetujui}
                  </p>
                </div>
                <HiCheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Diproses
                  </p>
                  <p className="text-2xl font-bold text-amber-600">
                    {stats.diajukan}
                  </p>
                </div>
                <HiClock className="h-8 w-8 text-amber-500" />
              </div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Ditolak
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.ditolak}
                  </p>
                </div>
                <HiXCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>
          </div>
        )}

        {/* Results Table */}
        {!isLoading && statusData && statusData.length > 0 && (
          <Card className="border-0 bg-white shadow-lg dark:bg-gray-800">
            <div className="p-6">
              <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                Riwayat Pengajuan Surat
              </h3>
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <Table hoverable className="min-w-full">
                  <TableHead className="bg-gray-50 dark:bg-gray-700">
                    <TableHeadCell className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Nomor Surat
                    </TableHeadCell>
                    <TableHeadCell className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Jenis Surat
                    </TableHeadCell>
                    <TableHeadCell className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Tanggal Pengajuan
                    </TableHeadCell>
                    <TableHeadCell className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Status
                    </TableHeadCell>
                    <TableHeadCell className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Catatan
                    </TableHeadCell>
                    <TableHeadCell className="px-6 py-4 text-center text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Aksi
                    </TableHeadCell>
                  </TableHead>
                  <TableBody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                    {statusData.map((surat, index) => (
                      <TableRow
                        key={surat.id_surat}
                        className={`transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          index % 2 === 0
                            ? "bg-white dark:bg-gray-800"
                            : "dark:bg-gray-750 bg-gray-50/50"
                        }`}
                      >
                        <TableCell className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {surat.nomor_surat || (
                            <span className="text-gray-400 dark:text-gray-500">
                              Belum tersedia
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <HiDocumentText className="h-4 w-4 text-gray-400" />
                            {formatJenisSurat(surat.jenis_surat)}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(surat.tanggal_pengajuan).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              weekday: "short",
                            },
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {renderStatusBadge(surat.status_surat)}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {surat.catatan ? (
                            <div
                              className="max-w-xs truncate"
                              title={surat.catatan}
                            >
                              {surat.catatan}
                            </div>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500">
                              -
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center">
                          {surat.status_surat === "Disetujui" ? (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleDownloadPdf(
                                  surat.nik_pemohon,
                                  surat.id_surat,
                                )
                              }
                              disabled={isLoading}
                              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:focus:ring-emerald-900/20"
                            >
                              {isLoading ? (
                                <Spinner size="xs" />
                              ) : (
                                <>
                                  <HiDownload className="h-4 w-4" />
                                  <span>Download</span>
                                </>
                              )}
                            </Button>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500">
                              -
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        )}

        {/* Empty States */}
        {!isLoading && statusData && statusData.length === 0 && !error && (
          <Card className="border-0 bg-white shadow-lg dark:bg-gray-800">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                <HiDocumentText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Tidak Ada Data Ditemukan
              </h3>
              <p className="text-center text-gray-600 dark:text-gray-400">
                Tidak ada pengajuan surat yang terkait dengan NIK tersebut.
                <br />
                Pastikan NIK yang dimasukkan sudah benar.
              </p>
            </div>
          </Card>
        )}

        {!isLoading && !statusData && !error && (
          <Card className="border-0 bg-white shadow-lg dark:bg-gray-800">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <HiSearch className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Siap Untuk Pencarian
              </h3>
              <p className="text-center text-gray-600 dark:text-gray-400">
                Masukkan NIK Anda pada kolom pencarian di atas untuk melihat
                <br />
                status pengajuan surat yang telah dibuat.
              </p>
            </div>
          </Card>
        )}
      </div>

      <FooterDesa />
    </div>
  );
}
