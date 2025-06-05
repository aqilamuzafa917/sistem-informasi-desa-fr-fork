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
  // Add other fields from your JSON if needed for display or logic
  // For example:
  // nama_pemohon?: string;
  // etc.
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

  const renderStatusBadge = (status: string) => {
    let color = "";
    switch (status) {
      case "Disetujui":
        color = "success";
        break;
      case "Diajukan":
        color = "warning";
        break;
      case "Ditolak":
        color = "failure";
        break;
      default:
        color = "info";
    }
    return (
      <span
        className={`bg-${color}-100 text-${color}-800 rounded-full px-2.5 py-0.5 text-xs font-medium dark:bg-${color}-900 dark:text-${color}-300`}
      >
        {status}
      </span>
    );
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

  return (
    <div className="flex min-h-screen flex-col">
      <NavbarDesa />

      <div className="container mx-auto flex-grow px-4 py-8">
        <Card className="p-6">
          <h2 className="mb-6 text-2xl font-bold">Cek Status Surat</h2>
          <p className="mb-6 text-gray-600">
            Silakan masukkan NIK Anda untuk melihat status pengajuan surat.
            Sistem akan menampilkan semua pengajuan surat yang terkait dengan
            NIK tersebut beserta status prosesnya.
          </p>

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">NIK</label>
              <div className="flex">
                <input
                  type="text"
                  className="w-full rounded-l-md border p-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Masukkan 16 digit NIK"
                  value={nik}
                  onChange={handleInputChange}
                  maxLength={16}
                  pattern="\d*"
                  required
                />
                <button
                  type="submit"
                  className="rounded-r-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner size="sm" /> : "Cek Status"}
                </button>
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
          </form>

          {isLoading && (
            <div className="py-8 text-center">
              <Spinner size="xl" />
              <p className="mt-2 text-gray-600">Memuat data...</p>
            </div>
          )}

          {!isLoading && statusData && statusData.length > 0 && (
            <div className="overflow-x-auto rounded-md border">
              <Table hoverable>
                <TableHead>
                  <TableHeadCell>Nomor Surat</TableHeadCell>
                  <TableHeadCell>Jenis Surat</TableHeadCell>
                  <TableHeadCell>Tanggal Pengajuan</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                  <TableHeadCell>Catatan</TableHeadCell>
                  <TableHeadCell className="table-cell whitespace-nowrap">
                    Cetak Surat
                  </TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                  {statusData.map((surat) => (
                    <TableRow
                      key={surat.id_surat}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <TableCell>{surat.nomor_surat || "-"}</TableCell>
                      <TableCell>{surat.jenis_surat}</TableCell>
                      <TableCell>
                        {new Date(surat.tanggal_pengajuan).toLocaleDateString(
                          "id-ID",
                          { year: "numeric", month: "long", day: "numeric" },
                        )}
                      </TableCell>
                      <TableCell>
                        {renderStatusBadge(surat.status_surat)}
                      </TableCell>
                      <TableCell>{surat.catatan || "-"}</TableCell>
                      <TableCell className="table-cell whitespace-nowrap">
                        {surat.status_surat === "Disetujui" && (
                          <Button
                            size="xs"
                            color="success"
                            onClick={() =>
                              handleDownloadPdf(
                                surat.nik_pemohon,
                                surat.id_surat,
                              )
                            }
                            disabled={isLoading}
                          >
                            {isLoading ? <Spinner size="xs" /> : "Download PDF"}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!isLoading && statusData && statusData.length === 0 && !error && (
            <div className="rounded-md border py-8 text-center text-gray-600">
              Tidak ada pengajuan surat yang terkait dengan NIK tersebut.
            </div>
          )}

          {!isLoading && !statusData && !error && (
            <div className="rounded-md border py-8 text-center text-gray-600">
              Masukkan NIK Anda untuk melihat status pengajuan surat.
            </div>
          )}
        </Card>
      </div>

      <FooterDesa />
    </div>
  );
}
