import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { API_CONFIG } from "../../config/api";
import {
  ChevronLeft,
  User,
  Phone,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Save,
  RefreshCw,
} from "lucide-react";

// Interface for pengaduan media
interface MediaPengaduan {
  path: string;
  type: string;
  name: string;
  url: string;
}

// Interface for pengaduan data
interface Pengaduan {
  id_pengaduan: number;
  judul_pengaduan: string;
  isi_pengaduan: string;
  status_pengaduan: string;
  nama_pelapor: string;
  email_pelapor: string;
  telepon_pelapor: string;
  tanggal_kejadian: string | null;
  latitude: number;
  longitude: number;
  location_name: string;
  media_pengaduan: MediaPengaduan[];
  created_at: string;
  updated_at: string;
  kategori: string;
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "diajukan":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: <Clock className="h-3 w-3" />,
          text: "Diajukan",
        };
      case "diterima":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircle className="h-3 w-3" />,
          text: "Diterima",
        };
      case "ditolak":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: <XCircle className="h-3 w-3" />,
          text: "Ditolak",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <AlertCircle className="h-3 w-3" />,
          text: status,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${config.color}`}
    >
      {config.icon}
      {config.text}
    </span>
  );
};

// Info card component
const InfoCard = ({
  icon,
  label,
  value,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | null | undefined;
  className?: string;
}) => (
  <div
    className={`rounded-lg border bg-white p-4 transition-shadow hover:shadow-md ${className}`}
  >
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-blue-600">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-sm font-medium text-gray-900">{label}</p>
        <p className="text-sm break-words text-gray-600">{value ?? "-"}</p>
      </div>
    </div>
  </div>
);

export default function VerifikasiPengaduanPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pengaduan, setPengaduan] = useState<Pengaduan | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("diajukan");
  const [submitting, setSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Log the current pengaduan state during render for debugging
  console.log("Current pengaduan state in render:", pengaduan);

  useEffect(() => {
    const fetchPengaduan = async () => {
      try {
        const token =
          localStorage.getItem("token") || localStorage.getItem("authToken");
        const response = await axios.get(
          `${API_CONFIG.baseURL}/api/pengaduan/${id}`,
          {
            headers: {
              ...API_CONFIG.headers,
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log("API Response Data (raw):", response.data);

        const pengaduanData = response.data.data || response.data;
        if (!pengaduanData) {
          throw new Error("Data pengaduan tidak ditemukan");
        }
        console.log("Processed pengaduanData (before mapping):", pengaduanData);

        const mappedPengaduan: Pengaduan = {
          id_pengaduan: pengaduanData.id ? Number(pengaduanData.id) : 0,
          judul_pengaduan: pengaduanData.judul_pengaduan ?? "",
          isi_pengaduan:
            pengaduanData.detail_pengaduan ?? "Tidak Ada Deskripsi",
          status_pengaduan: pengaduanData.status ?? "diajukan",
          nama_pelapor: pengaduanData.nama ?? "-",
          email_pelapor: pengaduanData.email ?? "-",
          telepon_pelapor: pengaduanData.nomor_telepon ?? "-",
          tanggal_kejadian: pengaduanData.tanggal_kejadian ?? null,
          latitude:
            pengaduanData.latitude != null ? Number(pengaduanData.latitude) : 0,
          longitude:
            pengaduanData.longitude != null
              ? Number(pengaduanData.longitude)
              : 0,
          location_name: pengaduanData.location_name ?? "-",
          media_pengaduan: pengaduanData.media ?? [],
          created_at: pengaduanData.created_at ?? "-",
          updated_at: pengaduanData.updated_at ?? "-",
          kategori: pengaduanData.kategori ?? "Tidak Ada Kategori",
        };

        setPengaduan(mappedPengaduan);
        setStatus(
          pengaduanData.status ?? pengaduanData.status_pengaduan ?? "diajukan",
        );
        console.log(
          "Pengaduan state *being set* (mappedPengaduan):",
          mappedPengaduan,
        );
      } catch (error) {
        console.error("Gagal mengambil data pengaduan:", error);
        toast.error("Gagal mengambil data pengaduan", {
          description:
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan saat mengambil data pengaduan",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPengaduan();
    }
  }, [id]);

  const handleVerifikasi = async () => {
    try {
      setSubmitting(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      await axios.patch(
        `${API_CONFIG.baseURL}/api/pengaduan/${id}/status`,
        { status: status },
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Pengaduan berhasil diverifikasi!", {
        description: "Status pengaduan telah diperbarui",
        duration: 2000,
      });

      setTimeout(() => {
        window.location.href = "/pengaduan";
      }, 2000);
    } catch (error) {
      console.error("Gagal memverifikasi pengaduan:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error("Gagal memverifikasi pengaduan", {
          description: errorMessage,
        });
      } else {
        toast.error("Gagal memverifikasi pengaduan", {
          description:
            "Terjadi kesalahan saat memverifikasi pengaduan. Silakan coba lagi.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      await axios.delete(`${API_CONFIG.baseURL}/api/pengaduan/${id}`, {
        headers: {
          ...API_CONFIG.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Pengaduan berhasil dihapus!", {
        description: "Pengaduan telah dihapus dari sistem",
        duration: 2000,
      });

      setTimeout(() => {
        window.location.href = "/pengaduan";
      }, 2000);
    } catch (error) {
      console.error("Gagal menghapus pengaduan:", error);
      toast.error("Gagal menghapus pengaduan", {
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menghapus pengaduan. Silakan coba lagi.",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="border-b bg-white shadow-sm">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger className="rounded-lg p-2 transition-colors hover:bg-gray-100" />
                    <Separator orientation="vertical" className="h-6" />
                    <button
                      onClick={() => navigate(-1)}
                      className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <div>
                      <h1 className="text-xl font-semibold text-gray-900">
                        Verifikasi Pengaduan
                      </h1>
                      <p className="text-sm text-gray-500">
                        Review dan verifikasi pengaduan
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={status} />
                  </div>
                </div>
              </div>
            </div>

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
              {loading ? (
                <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                  <div className="flex items-center gap-2 text-gray-600">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Loading...</span>
                  </div>
                </div>
              ) : !pengaduan ? (
                <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                  <div className="text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      Error
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Data pengaduan tidak ditemukan.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mx-auto max-w-7xl space-y-6">
                  {/* Kategori Pengaduan */}
                  <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-blue-100 p-3">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-900">
                          Kategori Pengaduan:{" "}
                          {pengaduan?.kategori ?? "Tidak Ada Kategori"}
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Informasi Pelapor */}
                  <div className="rounded-xl border bg-white shadow-sm">
                    <div className="border-b p-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Informasi Pelapor
                      </h3>
                    </div>
                    <div className="space-y-4 p-6">
                      <InfoCard
                        icon={<User className="h-4 w-4" />}
                        label="Nama"
                        value={pengaduan?.nama_pelapor}
                      />
                      <InfoCard
                        icon={<Phone className="h-4 w-4" />}
                        label="Nomor Telepon"
                        value={pengaduan?.telepon_pelapor}
                      />
                    </div>
                  </div>

                  {/* Detail Pengaduan */}
                  <div className="rounded-xl border bg-white shadow-sm">
                    <div className="border-b p-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Detail Pengaduan
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="prose max-w-none">
                        <div className="rounded-lg bg-gray-50 p-4 text-sm leading-relaxed whitespace-pre-wrap">
                          {pengaduan?.isi_pengaduan ?? "Tidak Ada Deskripsi"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Media Section */}
                  {pengaduan?.media_pengaduan &&
                    pengaduan.media_pengaduan.length > 0 && (
                      <div className="rounded-xl border bg-white shadow-sm">
                        <div className="border-b p-6">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Media Lampiran
                          </h3>
                        </div>
                        <div className="p-6">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {pengaduan.media_pengaduan.map((media, index) => (
                              <div key={index} className="group relative">
                                <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
                                  <img
                                    src={media.url}
                                    alt={media.name}
                                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                  />
                                </div>
                                <div className="mt-2">
                                  <p className="text-sm font-medium text-gray-900">
                                    {media.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {media.type}
                                  </p>
                                </div>
                                <button className="absolute top-2 right-2 rounded-lg bg-black/50 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70">
                                  <Eye className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Verification Actions */}
                  <div className="rounded-xl border bg-white shadow-sm">
                    <div className="border-b p-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Verifikasi Pengaduan
                      </h3>
                    </div>
                    <div className="space-y-6 p-6">
                      <div>
                        <label className="mb-3 block text-sm font-medium text-gray-700">
                          Status Pengaduan
                        </label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Diajukan">Diajukan</option>
                          <option value="Diterima">Diterima</option>
                          <option value="Ditolak">Ditolak</option>
                        </select>
                      </div>

                      <div className="flex justify-end gap-3">
                        <button
                          onClick={handleVerifikasi}
                          disabled={submitting}
                          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
                        >
                          {submitting ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Memproses...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              Simpan Verifikasi
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => setShowDeleteDialog(true)}
                          disabled={isDeleting}
                          className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-700 disabled:bg-red-400"
                        >
                          {isDeleting ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Menghapus...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4" />
                              Hapus Pengaduan
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Delete Confirmation Dialog */}
            {showDeleteDialog && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="w-full max-w-md rounded-xl bg-white p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-full bg-red-100 p-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Konfirmasi Penghapusan
                    </h3>
                  </div>
                  <p className="mb-6 text-gray-600">
                    Apakah Anda yakin ingin menghapus pengaduan ini? Tindakan
                    ini tidak dapat dibatalkan dan akan menghapus semua data
                    terkait secara permanen.
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowDeleteDialog(false)}
                      className="rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:bg-red-400"
                    >
                      {isDeleting ? "Menghapus..." : "Hapus"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
