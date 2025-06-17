import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  MapPin,
  Calendar,
  User,
  FileText,
  Eye,
  Check,
  X,
  AlertTriangle,
  ChevronLeft,
  Clock,
  Image,
  Download,
  LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { API_CONFIG } from "../../config/api";
import { MapContainer, TileLayer, Marker, Polygon, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DesaData } from "../../types/desa";

// Helper function to format date strings
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString;
  }
};

// Interface for article media
interface MediaArtikel {
  path: string;
  type: string;
  name: string;
  url: string;
}

// Interface for article data
interface Artikel {
  id_artikel: number;
  jenis_artikel: string;
  status_artikel: string;
  judul_artikel: string;
  kategori_artikel: string;
  isi_artikel: string;
  penulis_artikel: string;
  tanggal_kejadian_artikel: string | null;
  tanggal_publikasi_artikel: string | null;
  latitude: number;
  longitude: number;
  location_name: string;
  media_artikel: MediaArtikel[];
  created_at: string;
  updated_at: string;
}

// Fix for default marker icon in Leaflet
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    diajukan: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: Clock,
      label: "Menunggu Verifikasi",
    },
    disetujui: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: Check,
      label: "Disetujui",
    },
    ditolak: {
      bg: "bg-red-100",
      text: "text-red-800",
      icon: X,
      label: "Ditolak",
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.diajukan;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${config.bg} ${config.text}`}
    >
      <Icon size={14} />
      {config.label}
    </span>
  );
};

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
}

const InfoCard = ({
  icon: Icon,
  label,
  value,
  className = "",
}: InfoCardProps) => (
  <div className={`rounded-lg bg-gray-50 p-4 ${className}`}>
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex-shrink-0">
        <Icon className="h-5 w-5 text-gray-600" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-sm font-medium text-gray-600">{label}</p>
        <p className="break-words text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export default function VerifikasiArtikelPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artikel, setArtikel] = useState<Artikel | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("diajukan");
  const [submitting, setSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [villagePolygon, setVillagePolygon] = useState<[number, number][]>([]);

  useEffect(() => {
    const fetchArtikel = async () => {
      try {
        const token =
          localStorage.getItem("token") || localStorage.getItem("authToken");
        const response = await axios.get(
          `${API_CONFIG.baseURL}/api/artikel/${id}`,
          {
            headers: {
              ...API_CONFIG.headers,
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log("API Response Data:", response.data);
        // Set artikel from response.data.data since the API wraps the article in a data field
        setArtikel(response.data.data);
        setStatus(response.data.data.status_artikel || "diajukan");
      } catch (error) {
        console.error("Gagal mengambil data artikel:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArtikel();
    }
  }, [id]);

  // Fetch village polygon data
  useEffect(() => {
    const fetchVillagePolygon = async () => {
      try {
        const response = await axios.get<DesaData>(
          `${API_CONFIG.baseURL}/api/publik/profil-desa/1`,
          { headers: API_CONFIG.headers },
        );
        if (response.data.polygon_desa) {
          setVillagePolygon(response.data.polygon_desa);
        }
      } catch (error) {
        console.error("Error fetching village polygon:", error);
      }
    };

    fetchVillagePolygon();
  }, []);

  const handleVerifikasi = async () => {
    try {
      setSubmitting(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      await axios.patch(
        `${API_CONFIG.baseURL}/api/artikel/${id}/status`,
        {
          status_artikel: status,
        },
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Artikel berhasil diverifikasi!", {
        description: "Status artikel telah diperbarui",
        duration: 2000,
      });
      // Wait for 2 seconds to show toast before redirecting
      setTimeout(() => {
        window.location.href = "/admin/artikel";
      }, 2000);
    } catch (error) {
      console.error("Gagal memverifikasi artikel:", error);
      if (axios.isAxiosError(error) && error.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = Object.entries(error.response.data.errors)
          .map(
            ([field, messages]) =>
              `${field}: ${(messages as string[]).join(", ")}`,
          )
          .join("\n");
        toast.error("Gagal memverifikasi artikel", {
          description: errorMessages,
        });
      } else {
        toast.error("Gagal memverifikasi artikel", {
          description:
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan saat memverifikasi artikel. Silakan coba lagi.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => navigate("/admin/artikel")}
                      className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div>
                      <h1 className="text-xl font-semibold text-gray-900">
                        Verifikasi Artikel
                      </h1>
                      <p className="text-sm text-gray-500">
                        ID: {artikel?.id_artikel}
                      </p>
                    </div>
                  </div>
                  {artikel && <StatusBadge status={artikel.status_artikel} />}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div>Loading...</div>
              </div>
            ) : !artikel ? (
              <div className="flex h-64 items-center justify-center">
                <div>Data artikel tidak ditemukan.</div>
              </div>
            ) : (
              <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                  {/* Main Content */}
                  <div className="space-y-6 lg:col-span-2">
                    {/* Article Header */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex-1">
                          <span className="mb-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                            {artikel.kategori_artikel}
                          </span>
                          <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            {artikel.judul_artikel}
                          </h2>
                        </div>
                      </div>
                      {/* Article Meta */}
                      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <InfoCard
                          icon={User}
                          label="Penulis"
                          value={artikel.penulis_artikel}
                        />
                        <InfoCard
                          icon={Calendar}
                          label="Tanggal Kejadian"
                          value={formatDate(artikel.tanggal_kejadian_artikel)}
                        />
                        <InfoCard
                          icon={Clock}
                          label="Tanggal Publikasi"
                          value={formatDate(artikel.tanggal_publikasi_artikel)}
                        />
                      </div>
                      {/* Location */}
                      <InfoCard
                        icon={MapPin}
                        label="Lokasi"
                        value={`${artikel.location_name} (${artikel.latitude.toFixed(6)}, ${artikel.longitude.toFixed(6)})`}
                        className="mb-6"
                      />
                      {/* Article Content */}
                      <div className="border-t border-gray-200 pt-6">
                        <div className="mb-4 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-gray-600" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            Isi Artikel
                          </h3>
                        </div>
                        <div className="prose max-w-none">
                          <div className="rounded-lg bg-gray-50 p-6 leading-relaxed break-words whitespace-pre-wrap text-gray-700">
                            {artikel.isi_artikel}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Media Section */}
                    {artikel.media_artikel &&
                      artikel.media_artikel.length > 0 && (
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                          <div className="mb-6 flex items-center gap-2">
                            <Image className="h-5 w-5 text-gray-600" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Media Artikel
                            </h3>
                            <span className="rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-600">
                              {artikel.media_artikel.length} file
                            </span>
                          </div>
                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {artikel.media_artikel.map((media, index) => (
                              <div key={index} className="group">
                                {media.type.startsWith("image/") ? (
                                  <div className="relative overflow-hidden rounded-lg border border-gray-200">
                                    <img
                                      src={media.url}
                                      alt={media.name}
                                      className="h-48 w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                                    <div className="absolute bottom-3 left-3 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                      <p className="text-sm font-medium">
                                        {media.name}
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50">
                                    <div className="flex items-center gap-3">
                                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-red-100">
                                        <FileText className="h-6 w-6 text-red-600" />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-gray-900">
                                          {media.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          PDF Document
                                        </p>
                                      </div>
                                      <a
                                        href={media.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-shrink-0 p-2 text-gray-400 transition-colors hover:text-gray-600"
                                      >
                                        <Download className="h-4 w-4" />
                                      </a>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    {/* Map Section */}
                    {artikel.latitude && artikel.longitude && (
                      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-gray-600" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            Lokasi Kejadian
                          </h3>
                        </div>
                        <div className="mt-6 h-[300px] w-full overflow-hidden rounded-lg border border-gray-200">
                          <MapContainer
                            center={[artikel.latitude, artikel.longitude]}
                            zoom={14}
                            style={{ height: "100%", width: "100%" }}
                            scrollWheelZoom={false}
                          >
                            <TileLayer
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {villagePolygon.length > 0 && (
                              <Polygon
                                positions={villagePolygon}
                                pathOptions={{
                                  color: "#3b82f6",
                                  fillColor: "#60a5fa",
                                  fillOpacity: 0.3,
                                  weight: 2,
                                }}
                              />
                            )}
                            <Marker
                              position={[artikel.latitude, artikel.longitude]}
                            >
                              <Popup>
                                <div className="text-center">
                                  <h3 className="mb-1 text-lg font-bold text-blue-600">
                                    {artikel.location_name}
                                  </h3>
                                </div>
                              </Popup>
                            </Marker>
                          </MapContainer>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Verification Panel */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                      <div className="mb-2 flex items-center gap-2">
                        <Eye className="h-5 w-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Panel Verifikasi
                        </h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Status Artikel
                          </label>
                          <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="diajukan">
                              Menunggu Verifikasi
                            </option>
                            <option value="disetujui">Setujui Artikel</option>
                            <option value="ditolak">Tolak Artikel</option>
                          </select>
                        </div>
                        <div className="space-y-3 border-t border-gray-200 pt-4">
                          <button
                            onClick={handleVerifikasi}
                            disabled={submitting}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 font-medium text-white transition-all duration-200 hover:from-green-600 hover:to-green-700 disabled:from-green-300 disabled:to-green-400"
                          >
                            {submitting ? (
                              <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Memproses...
                              </>
                            ) : (
                              <>
                                <Check className="h-4 w-4" />
                                Simpan Verifikasi
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              toast.custom(
                                (t) => (
                                  <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-lg">
                                    <div className="flex items-center gap-3">
                                      <AlertTriangle className="h-5 w-5 text-red-600" />
                                      <div>
                                        <h3 className="font-medium text-gray-900">
                                          Hapus Artikel
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                          Tindakan ini tidak dapat dibatalkan
                                        </p>
                                      </div>
                                    </div>
                                    <p className="mt-2 text-gray-700">
                                      Artikel akan dihapus secara permanen dari
                                      sistem. Apakah Anda yakin ingin
                                      melanjutkan?
                                    </p>
                                    <div className="mt-4 flex justify-end gap-2">
                                      <button
                                        onClick={() => toast.dismiss(t)}
                                        className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                                      >
                                        Batal
                                      </button>
                                      <button
                                        onClick={() => {
                                          toast.dismiss(t);
                                          toast.promise(
                                            (async () => {
                                              setIsDeleting(true);
                                              const token =
                                                localStorage.getItem("token") ||
                                                localStorage.getItem(
                                                  "authToken",
                                                );
                                              await axios.delete(
                                                `${API_CONFIG.baseURL}/api/artikel/${id}`,
                                                {
                                                  headers: {
                                                    ...API_CONFIG.headers,
                                                    Authorization: `Bearer ${token}`,
                                                  },
                                                },
                                              );
                                              setTimeout(() => {
                                                window.location.href =
                                                  "/artikel";
                                              }, 2000);
                                              return "Artikel berhasil dihapus!";
                                            })(),
                                            {
                                              loading: "Menghapus artikel...",
                                              success: (msg) => msg,
                                              error: (err) =>
                                                err?.message ||
                                                "Gagal menghapus artikel",
                                            },
                                          );
                                        }}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 font-medium text-white transition-all duration-200 hover:from-red-600 hover:to-red-700 disabled:from-red-300 disabled:to-red-400"
                                      >
                                        Hapus
                                      </button>
                                    </div>
                                  </div>
                                ),
                                { duration: Infinity },
                              );
                            }}
                            disabled={isDeleting}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 font-medium text-white transition-all duration-200 hover:from-red-600 hover:to-red-700 disabled:from-red-300 disabled:to-red-400"
                          >
                            {isDeleting ? (
                              <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Menghapus...
                              </>
                            ) : (
                              <>
                                <X className="h-4 w-4" />
                                Hapus Artikel
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Article Info */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                      <h3 className="mb-4 text-lg font-semibold text-gray-900">
                        Informasi Artikel
                      </h3>
                      <div className="space-y-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Jenis Artikel</span>
                          <span className="font-medium text-gray-900">
                            {artikel.jenis_artikel}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dibuat</span>
                          <span className="font-medium text-gray-900">
                            {formatDate(artikel.created_at)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Diperbarui</span>
                          <span className="font-medium text-gray-900">
                            {formatDate(artikel.updated_at)}
                          </span>
                        </div>
                      </div>
                    </div>
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
