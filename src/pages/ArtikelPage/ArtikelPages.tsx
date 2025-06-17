import React, { useState, useEffect, useCallback } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "../../config/api";
import { toast } from "sonner";
import {
  Eye,
  Plus,
  Search,
  Calendar,
  User,
  Tag,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  // Edit,
  Trash2,
  AlertCircle,
  Pencil,
  Building2,
  Landmark,
  GraduationCap,
  Heart,
  Briefcase,
  Leaf,
  ShoppingBag,
  Users,
  Newspaper,
  Wrench,
  Music,
  Palette,
  Utensils,
  Bike,
  LucideIcon,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const jenisArtikelOptions = [
  {
    value: "warga",
    label: "Warga",
    icon: User,
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "resmi",
    label: "Resmi",
    icon: FileText,
    color: "bg-purple-100 text-purple-800",
  },
];

const statusOptions = [
  {
    value: "Semua",
    label: "Semua",
    count: 0,
    color: "bg-gray-100 text-gray-800",
    icon: FileText,
  },
  {
    value: "Diterbitkan",
    label: "Diterbitkan",
    count: 0,
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  {
    value: "Diajukan",
    label: "Diajukan",
    count: 0,
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
];

interface Artikel {
  id_artikel: number;
  jenis_artikel: "warga" | "resmi";
  status_artikel: string; // e.g., "diajukan", "diterbitkan", "ditolak"
  judul_artikel: string;
  kategori_artikel: string;
  isi_artikel: string; // Not displayed in table, but part of data
  penulis_artikel: string; // Not displayed in table
  tanggal_kejadian_artikel: string | null; // Not displayed in table
  tanggal_publikasi_artikel: string | null;
  // latitude: number | null; // Not displayed in table
  // longitude: number | null; // Not displayed in table
  // location_name: string | null; // Not displayed in table
  // media_artikel: Array<{ // Not displayed in table
  //   path: string;
  //   type: string;
  //   name: string;
  //   url: string;
  // }>;
  created_at: string;
  updated_at: string; // Not displayed in table
}

type StatusArtikelFilter = "Semua" | "Diterbitkan" | "Diajukan";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  trend?: boolean;
}

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}

interface StatusInfo {
  label: string;
  color: string;
  icon: React.ElementType;
}

interface JenisInfo {
  label: string;
  color: string;
  icon: React.ElementType;
}

export default function ArtikelPages() {
  const navigate = useNavigate();
  const [artikelList, setArtikelList] = useState<Artikel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] =
    useState<StatusArtikelFilter>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [jenisArtikelFilter, setJenisArtikelFilter] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalArtikelCount, setTotalArtikelCount] = useState(0);
  const itemsPerPage = 10;

  // State for stats API
  const [artikelDiajukanCount, setArtikelDiajukanCount] = useState(0);
  const [artikelDiterbitkanCount, setArtikelDiterbitkanCount] = useState(0);

  const formatDate = useCallback((dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  useEffect(() => {
    const fetchArtikelData = async () => {
      setLoading(true);
      setError(null); // Reset error on new fetch
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Token tidak ditemukan. Silakan login kembali.");
          setLoading(false);
          return;
        }

        const params = new URLSearchParams({
          page: currentPage.toString(),
          per_page: itemsPerPage.toString(),
        });

        if (statusFilter !== "Semua") {
          // Map client-side "Diterbitkan" to API's "diterbitkan" or "disetujui" if API needs it.
          // Assuming API understands "diterbitkan", "diajukan", "ditolak" directly.
          if (statusFilter === "Diterbitkan") {
            params.append("status", "diterbitkan"); // Or 'disetujui' if API uses it, check backend API spec
          } else {
            params.append("status", statusFilter.toLowerCase());
          }
        }

        if (jenisArtikelFilter) {
          params.append("jenis_artikel", jenisArtikelFilter);
        }

        if (searchQuery) {
          params.append("search", searchQuery); // Assuming API has a generic search parameter
        }

        const response = await axios.get(
          `${API_CONFIG.baseURL}/api/artikel?${params.toString()}`,
          {
            headers: {
              ...API_CONFIG.headers,
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const responseData = response.data?.data;
        if (responseData) {
          const articles = responseData.data;
          setArtikelList(Array.isArray(articles) ? articles : []);

          // Set totalArtikelCount from responseData.total if it's a valid number
          if (typeof responseData.total === "number") {
            setTotalArtikelCount(responseData.total);
          } else {
            // If total is not provided by API or invalid, default to 0.
            setTotalArtikelCount(0);
          }
        } else {
          setArtikelList([]);
          setTotalArtikelCount(0); // Reset total count
        }
      } catch (err) {
        console.error("Error fetching artikel data:", err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          setError("Sesi Anda telah berakhir. Silakan login kembali.");
        } else {
          setError("Gagal mengambil data artikel.");
        }
        setArtikelList([]); // Clear data on error
        setTotalArtikelCount(0); // Reset total count on error
      } finally {
        setLoading(false);
      }
    };
    fetchArtikelData();
  }, [navigate, currentPage, statusFilter, jenisArtikelFilter, searchQuery]);

  // useEffect for fetching stats
  useEffect(() => {
    const fetchArtikelStats = async () => {
      // setStatsLoading(true); // Optional: if you want a separate loading state
      // setStatsError(null);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          // setStatsError("Token tidak ditemukan untuk statistik."); // Optional
          // setStatsLoading(false);
          return;
        }
        const response = await axios.get(
          `${API_CONFIG.baseURL}/api/artikel/stats`,
          {
            headers: {
              ...API_CONFIG.headers,
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.data && response.data.status === "success") {
          setArtikelDiajukanCount(response.data.data.diajukan || 0);
          setArtikelDiterbitkanCount(response.data.data.disetujui || 0);
        } else {
          // setStatsError("Gagal mengambil data statistik artikel."); // Optional
          setArtikelDiajukanCount(0); // Reset on unexpected response
          setArtikelDiterbitkanCount(0);
        }
      } catch (err) {
        console.error("Error fetching artikel stats:", err);
        // setStatsError("Gagal mengambil data statistik artikel karena kesalahan jaringan atau server."); // Optional
        setArtikelDiajukanCount(0); // Reset on error
        setArtikelDiterbitkanCount(0);
        // Handle specific errors like 401 if needed, similar to the other fetch
      } finally {
        // setStatsLoading(false); // Optional
      }
    };
    fetchArtikelStats();
  }, [navigate]); // Dependency: navigate, if auth redirection is needed based on stats call in future

  const handleStatusFilterClick = (status: StatusArtikelFilter) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Reset page when search query or jenisArtikelFilter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, jenisArtikelFilter]);

  const totalPages = Math.ceil(totalArtikelCount / itemsPerPage);

  // artikelList is now directly the paginated and filtered data from API
  const paginatedArtikelList = artikelList; // Use artikelList directly

  const getStatusInfo = (status: string): StatusInfo => {
    const lowerStatus = status?.toLowerCase();
    if (lowerStatus === "diterbitkan" || lowerStatus === "disetujui") {
      return {
        label: "Diterbitkan",
        color: "bg-green-100 text-green-700 border-green-200",
        icon: CheckCircle,
      };
    }
    if (lowerStatus === "ditolak") {
      return {
        label: "Ditolak",
        color: "bg-red-100 text-red-700 border-red-200",
        icon: XCircle,
      };
    }
    return {
      label: "Diajukan",
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      icon: Clock,
    };
  };

  const getJenisInfo = (jenis: string): JenisInfo => {
    const option = jenisArtikelOptions.find((opt) => opt.value === jenis);
    return (
      option || {
        label: jenis,
        color: "bg-gray-100 text-gray-800",
        icon: FileText,
      }
    );
  };

  const getCategoryIcon = (
    category: string,
  ): { icon: LucideIcon; color: string } => {
    const defaultIcon = { icon: Tag, color: "bg-gray-50 text-gray-700" };

    const categoryIcons: Record<string, { icon: LucideIcon; color: string }> = {
      Pemerintahan: { icon: Building2, color: "bg-blue-50 text-blue-700" },
      Pembangunan: { icon: Landmark, color: "bg-indigo-50 text-indigo-700" },
      Pendidikan: { icon: GraduationCap, color: "bg-green-50 text-green-700" },
      Kesehatan: { icon: Heart, color: "bg-red-50 text-red-700" },
      Ekonomi: { icon: Briefcase, color: "bg-yellow-50 text-yellow-700" },
      Pertanian: { icon: Leaf, color: "bg-emerald-50 text-emerald-700" },
      UMKM: { icon: ShoppingBag, color: "bg-orange-50 text-orange-700" },
      Sosial: { icon: Users, color: "bg-purple-50 text-purple-700" },
      Berita: { icon: Newspaper, color: "bg-slate-50 text-slate-700" },
      Infrastruktur: { icon: Wrench, color: "bg-zinc-50 text-zinc-700" },
      Kesenian: { icon: Music, color: "bg-pink-50 text-pink-700" },
      Budaya: { icon: Palette, color: "bg-violet-50 text-violet-700" },
      Kuliner: { icon: Utensils, color: "bg-amber-50 text-amber-700" },
      Olahraga: { icon: Bike, color: "bg-cyan-50 text-cyan-700" },
    };

    return categoryIcons[category] || defaultIcon;
  };

  const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    color,
  }) => (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-full p-3 ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );

  const FilterButton: React.FC<FilterButtonProps> = ({
    active,
    onClick,
    children,
    count,
  }) => {
    const getActiveColors = (status: string) => {
      switch (status) {
        case "Diterbitkan":
          return { buttonBg: "bg-green-500" };
        case "Diajukan":
          return { buttonBg: "bg-yellow-500" };
        case "Ditolak":
          return { buttonBg: "bg-red-500" };
        default:
          return { buttonBg: "bg-gray-500" };
      }
    };

    const statusLabel = React.Children.toArray(children)[1] as string;
    const activeColors = getActiveColors(statusLabel);

    return (
      <button
        onClick={onClick}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
          active
            ? `scale-105 ${activeColors.buttonBg} text-white shadow-lg`
            : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        {children}
        {count !== undefined && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${active ? `${activeColors.buttonBg} text-white` : "bg-gray-100 text-gray-600"}`}
          >
            {count}
          </span>
        )}
      </button>
    );
  };

  const handleDelete = async (id: number) => {
    toast.custom(
      (t) => (
        <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div>
              <h3 className="font-medium text-gray-900">Konfirmasi Hapus</h3>
              <p className="text-sm text-gray-500">
                Apakah Anda yakin ingin menghapus artikel ini?
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={() => {
                toast.dismiss(t);
                toast.promise(
                  new Promise<string>((resolve, reject) => {
                    setDeleteLoading(id);
                    const token = localStorage.getItem("authToken");
                    if (!token) {
                      reject("Token tidak ditemukan. Silakan login kembali.");
                      return;
                    }

                    axios
                      .delete(`${API_CONFIG.baseURL}/api/artikel/${id}`, {
                        headers: {
                          ...API_CONFIG.headers,
                          Authorization: `Bearer ${token}`,
                        },
                      })
                      .then(() => {
                        // Remove the deleted article from the list
                        setArtikelList((prevList) =>
                          prevList.filter(
                            (artikel) => artikel.id_artikel !== id,
                          ),
                        );
                        // Update total count
                        setTotalArtikelCount((prev) => prev - 1);
                        resolve("Artikel berhasil dihapus");
                      })
                      .catch((error) => {
                        console.error("Error deleting article:", error);
                        reject("Gagal menghapus artikel. Silakan coba lagi.");
                      })
                      .finally(() => {
                        setDeleteLoading(null);
                      });
                  }),
                  {
                    loading: "Menghapus artikel...",
                    success: (message: string) => message,
                    error: (message: string) => message,
                  },
                );
              }}
              className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
            >
              Hapus
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
      },
    );
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          {/* Header */}
          <div className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Artikel Desa
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Kelola artikel dan berita desa
                </p>
              </div>
              <Button
                onClick={() => navigate("/admin/artikel/buat")}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-lg transition-colors hover:bg-blue-700 hover:shadow-xl"
              >
                <Plus className="h-5 w-5" />
                Buat Artikel
              </Button>
            </div>
          </div>

          <div className="p-6">
            {/* Stats Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <StatCard
                title="Total Artikel"
                value={totalArtikelCount}
                icon={FileText}
                color="bg-blue-100 text-blue-600"
                trend={true}
              />
              <StatCard
                title="Artikel Diajukan"
                value={artikelDiajukanCount}
                icon={Clock}
                color="bg-yellow-100 text-yellow-600"
              />
              <StatCard
                title="Artikel Diterbitkan"
                value={artikelDiterbitkanCount}
                icon={CheckCircle}
                color="bg-green-100 text-green-600"
              />
            </div>

            {/* Filters and Search */}
            <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              {/* Status Filter */}
              <div className="mb-4 flex flex-wrap gap-3">
                {statusOptions.map((status) => {
                  const count =
                    status.value === "Semua"
                      ? totalArtikelCount
                      : status.value === "Diterbitkan"
                        ? artikelDiterbitkanCount
                        : artikelDiajukanCount;
                  return (
                    <FilterButton
                      key={status.value}
                      active={statusFilter === status.value}
                      onClick={() =>
                        handleStatusFilterClick(
                          status.value as StatusArtikelFilter,
                        )
                      }
                      count={count}
                    >
                      <status.icon className="h-4 w-4" />
                      {status.label}
                    </FilterButton>
                  );
                })}
              </div>

              {/* Search and Jenis Filter */}
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari artikel berdasarkan judul, kategori, atau penulis..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-3 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={jenisArtikelFilter}
                    onChange={(e) => setJenisArtikelFilter(e.target.value)}
                    className="min-w-[150px] rounded-lg border border-gray-200 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Semua Jenis</option>
                    {jenisArtikelOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {jenisArtikelFilter && (
                    <button
                      onClick={() => setJenisArtikelFilter("")}
                      className="rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Articles Table */}
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              {loading ? (
                <div className="flex h-64 items-center justify-center">
                  <Spinner size="lg" text="Memuat data..." />
                </div>
              ) : error ? (
                <div className="py-12 text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Error
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{error}</p>
                </div>
              ) : paginatedArtikelList.length === 0 ? (
                <div className="py-12 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Tidak ada artikel
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {jenisArtikelFilter || statusFilter !== "Semua"
                      ? "Tidak ada artikel yang sesuai dengan filter yang dipilih."
                      : "Belum ada artikel yang dibuat. Mulai dengan membuat artikel pertama."}
                  </p>
                  <Button
                    onClick={() => navigate("/artikel/buat")}
                    className="mx-auto mt-4 flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    <Plus className="h-5 w-5" />
                    Buat Artikel Pertama
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          ID
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Jenis
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Judul
                        </th>
                        <th className="hidden px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase lg:table-cell">
                          Kategori
                        </th>
                        <th className="hidden px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase xl:table-cell">
                          Penulis
                        </th>
                        <th className="hidden px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase xl:table-cell">
                          Dibuat
                        </th>
                        <th className="hidden px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase xl:table-cell">
                          Diperbarui
                        </th>
                        <th className="hidden px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase 2xl:table-cell">
                          Publikasi
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {paginatedArtikelList.map((artikel) => {
                        const statusInfo = getStatusInfo(
                          artikel.status_artikel,
                        );
                        const jenisInfo = getJenisInfo(artikel.jenis_artikel);

                        return (
                          <tr
                            key={artikel.id_artikel}
                            className="transition-colors hover:bg-gray-50"
                          >
                            <td className="px-3 py-2 text-xs font-medium whitespace-nowrap text-gray-900">
                              {artikel.id_artikel}
                            </td>
                            <td className="px-3 py-2 text-xs whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${jenisInfo.color}`}
                              >
                                <jenisInfo.icon className="h-3 w-3" />
                                {jenisInfo.label}
                              </span>
                            </td>
                            <td className="max-w-[200px] px-3 py-2 text-xs text-gray-900">
                              <div
                                className="truncate"
                                title={artikel.judul_artikel}
                              >
                                {artikel.judul_artikel}
                              </div>
                            </td>
                            <td className="hidden px-3 py-2 text-xs lg:table-cell">
                              {(() => {
                                const { icon: Icon, color } = getCategoryIcon(
                                  artikel.kategori_artikel,
                                );
                                return (
                                  <span
                                    className={`inline-flex items-center gap-1.5 rounded-full ${color} px-2 py-0.5 text-xs font-medium`}
                                  >
                                    <Icon className="h-3 w-3" />
                                    {artikel.kategori_artikel}
                                  </span>
                                );
                              })()}
                            </td>
                            <td className="hidden px-3 py-2 text-xs xl:table-cell">
                              <div className="flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
                                  <User className="h-3 w-3 text-gray-600" />
                                </div>
                                <span className="text-xs text-gray-900">
                                  {artikel.penulis_artikel}
                                </span>
                              </div>
                            </td>
                            <td className="hidden px-3 py-2 text-xs text-gray-600 xl:table-cell">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(artikel.created_at)}
                              </div>
                            </td>
                            <td className="hidden px-3 py-2 text-xs text-gray-600 xl:table-cell">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(artikel.updated_at)}
                              </div>
                            </td>
                            <td className="hidden px-3 py-2 text-xs text-gray-600 2xl:table-cell">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(artikel.tanggal_publikasi_artikel)}
                              </div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${statusInfo.color}`}
                              >
                                <statusInfo.icon className="h-3 w-3" />
                                {statusInfo.label}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-xs font-medium whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/admin/artikel/${artikel.id_artikel}`,
                                    )
                                  }
                                  className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                                >
                                  <Eye className="h-3 w-3" />
                                  Detail
                                </button>
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/admin/artikel/edit/${artikel.id_artikel}`,
                                    )
                                  }
                                  className="inline-flex items-center gap-1 rounded-md bg-yellow-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none"
                                >
                                  <Pencil className="h-3 w-3" />
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDelete(artikel.id_artikel)
                                  }
                                  disabled={
                                    deleteLoading === artikel.id_artikel
                                  }
                                  className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                                >
                                  {deleteLoading === artikel.id_artikel ? (
                                    <Spinner size="sm" className="h-3 w-3" />
                                  ) : (
                                    <Trash2 className="h-3 w-3" />
                                  )}
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Menampilkan{" "}
                      <span className="font-medium">
                        {(currentPage - 1) * itemsPerPage + 1}
                      </span>{" "}
                      sampai{" "}
                      <span className="font-medium">
                        {Math.min(
                          currentPage * itemsPerPage,
                          totalArtikelCount,
                        )}
                      </span>{" "}
                      dari{" "}
                      <span className="font-medium">{totalArtikelCount}</span>{" "}
                      artikel
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                              page === currentPage
                                ? "z-10 border-blue-500 bg-blue-50 text-blue-600"
                                : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
