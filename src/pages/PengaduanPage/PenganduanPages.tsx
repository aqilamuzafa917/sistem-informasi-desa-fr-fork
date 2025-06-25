import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";
import {
  Eye,
  Check,
  ChevronUp,
  ChevronDown,
  Users,
  AlertCircle,
  FileText,
  Clock,
  XCircle,
  Search,
  Trash2,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "../../config/api";
import { toast } from "sonner";

const kategoriOptions = [
  { value: "Umum", label: "Umum" },
  { value: "Sosial", label: "Sosial" },
  { value: "Keamanan", label: "Keamanan" },
  { value: "Kesehatan", label: "Kesehatan" },
  { value: "Kebersihan", label: "Kebersihan" },
  { value: "Permintaan", label: "Permintaan" },
];

interface Pengaduan {
  id: string;
  created_at: string;
  updated_at: string;
  nama: string;
  nomor_telepon: string;
  kategori: string;
  detail_pengaduan: string;
  status: string;
  media: string;
}

type StatusFilter = "Semua" | "Diterima" | "Diajukan" | "Ditolak";

const statusOptions = [
  {
    value: "Semua",
    label: "Semua",
    color: "bg-gray-100 text-gray-800",
    icon: FileText,
  },
  {
    value: "Diterima",
    label: "Diterima",
    color: "bg-green-100 text-green-800",
    icon: Check,
  },
  {
    value: "Diajukan",
    label: "Diajukan",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  {
    value: "Ditolak",
    label: "Ditolak",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
];

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  trend?: boolean;
}

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

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  active,
  onClick,
  children,
  count,
}) => {
  const getActiveColors = (status: string) => {
    switch (status) {
      case "Diterima":
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

export default function PengaduanPages() {
  const navigate = useNavigate();
  const [pengaduanList, setPengaduanList] = useState<Pengaduan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Semua");
  const [sortField, setSortField] = useState<string | null>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 10;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Token tidak ditemukan");

        const [pengaduanResponse] = await Promise.all([
          axios.get(`${API_CONFIG.baseURL}/api/pengaduan`, {
            headers: {
              ...API_CONFIG.headers,
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setPengaduanList(
          Array.isArray(pengaduanResponse.data)
            ? pengaduanResponse.data
            : pengaduanResponse.data.data || [],
        );
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal mengambil data pengaduan");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, kategoriFilter, searchTerm]);

  const filteredPengaduanList = pengaduanList.filter((pengaduan) => {
    const statusMatch =
      statusFilter === "Semua" || pengaduan.status === statusFilter;
    const kategoriMatch =
      kategoriFilter === "" || pengaduan.kategori === kategoriFilter;
    const searchMatch =
      searchTerm === "" ||
      (pengaduan.nama?.toLowerCase() || "").includes(
        searchTerm.toLowerCase(),
      ) ||
      (pengaduan.nomor_telepon || "").includes(searchTerm) ||
      (pengaduan.detail_pengaduan?.toLowerCase() || "").includes(
        searchTerm.toLowerCase(),
      );
    return statusMatch && kategoriMatch && searchMatch;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedPengaduanList = [...filteredPengaduanList].sort((a, b) => {
    if (!sortField) return 0;
    if (sortField === "created_at") {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  const totalPengaduan = pengaduanList.length;
  const totalDiajukan = pengaduanList.filter(
    (p) => p.status === "Diajukan",
  ).length;
  const totalDiterima = pengaduanList.filter(
    (p) => p.status === "Diterima",
  ).length;

  const totalPages = Math.ceil(filteredPengaduanList.length / itemsPerPage);

  const paginatedPengaduanList = sortedPengaduanList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleDeletePengaduan = (id: string) => {
    toast.custom(
      (t) => (
        <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <Trash2 className="h-5 w-5 text-red-500" />
            <div>
              <h3 className="font-medium text-gray-900">Konfirmasi Hapus</h3>
              <p className="text-sm text-gray-500">
                Apakah Anda yakin ingin menghapus pengaduan ini?
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
                    (async () => {
                      setIsDeleting(true);
                      setDeletingId(id);
                      const token = localStorage.getItem("authToken");
                      if (!token) {
                        setIsDeleting(false);
                        setDeletingId(null);
                        reject("Token tidak ditemukan. Silakan login kembali.");
                        navigate("/");
                        return;
                      }
                      try {
                        await axios.delete(
                          `${API_CONFIG.baseURL}/api/pengaduan/${id}`,
                          {
                            headers: {
                              ...API_CONFIG.headers,
                              Authorization: `Bearer ${token}`,
                            },
                          },
                        );
                        setPengaduanList((prev) =>
                          prev.filter((item) => item.id !== id),
                        );
                        resolve("Pengaduan berhasil dihapus.");
                      } catch {
                        reject("Gagal menghapus pengaduan.");
                      } finally {
                        setIsDeleting(false);
                        setDeletingId(null);
                      }
                    })();
                  }),
                  {
                    loading: "Menghapus pengaduan...",
                    success: (msg) => msg,
                    error: (msg) => msg,
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
      { duration: Infinity },
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
                  Pengaduan Warga
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Kelola dan pantau status pengaduan warga
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Stats Cards & Card Filter */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <StatCard
                title="Total Pengaduan"
                value={totalPengaduan}
                icon={Users}
                color="bg-blue-100 text-blue-600"
                trend={true}
              />
              <StatCard
                title="Pengaduan Diajukan"
                value={totalDiajukan}
                icon={Clock}
                color="bg-yellow-100 text-yellow-600"
              />
              <StatCard
                title="Pengaduan Diterima"
                value={totalDiterima}
                icon={Check}
                color="bg-green-100 text-green-600"
              />
            </div>

            {/* Filters and Search */}
            <form
              className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
              onSubmit={(e) => e.preventDefault()}
            >
              {/* Status Filter (Card Style) */}
              <div className="mb-4 flex flex-wrap gap-3">
                {statusOptions.map((status) => {
                  const count =
                    status.value === "Semua"
                      ? totalPengaduan
                      : status.value === "Diterima"
                        ? totalDiterima
                        : status.value === "Diajukan"
                          ? totalDiajukan
                          : totalPengaduan - totalDiterima - totalDiajukan;
                  return (
                    <FilterButton
                      key={status.value}
                      active={statusFilter === status.value}
                      onClick={() =>
                        setStatusFilter(status.value as StatusFilter)
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
                    placeholder="Cari nama, nomor telepon, atau detail..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-3 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={kategoriFilter}
                    onChange={(e) => setKategoriFilter(e.target.value)}
                    className="min-w-[150px] rounded-lg border border-gray-200 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Semua Kategori</option>
                    {kategoriOptions.map((kategori) => (
                      <option key={kategori.value} value={kategori.value}>
                        {kategori.label}
                      </option>
                    ))}
                  </select>
                  {kategoriFilter && (
                    <button
                      onClick={() => setKategoriFilter("")}
                      className="rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Data Table */}
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              {loading ? (
                <div className="flex h-64 items-center justify-center">
                  <Spinner size="xl" text="Memuat data..." />
                </div>
              ) : error ? (
                <div className="py-12 text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Error
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{error}</p>
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
                          Nama
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Nomor Telepon
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Kategori
                        </th>
                        <th
                          className="cursor-pointer px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase transition-colors hover:bg-gray-100"
                          onClick={() => handleSort("created_at")}
                        >
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            Tanggal Aduan
                            {sortField === "created_at" &&
                              (sortDirection === "asc" ? (
                                <ChevronUp className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5" />
                              ))}
                          </div>
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Detail Pengaduan
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
                      {paginatedPengaduanList.map((pengaduan) => (
                        <tr
                          key={pengaduan.id}
                          className="transition-colors hover:bg-gray-50"
                        >
                          <td className="max-w-[120px] px-3 py-2 text-xs font-medium whitespace-nowrap text-gray-900">
                            <div className="truncate" title={pengaduan.id}>
                              {pengaduan.id}
                            </div>
                          </td>
                          <td className="max-w-[150px] px-3 py-2 text-xs whitespace-nowrap text-gray-900">
                            <div className="truncate" title={pengaduan.nama}>
                              {pengaduan.nama}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-xs whitespace-nowrap text-gray-900">
                            {pengaduan.nomor_telepon}
                          </td>
                          <td className="px-3 py-2 text-xs whitespace-nowrap text-gray-900">
                            {pengaduan.kategori}
                          </td>
                          <td className="px-3 py-2 text-xs whitespace-nowrap text-gray-900">
                            {formatDate(pengaduan.created_at)}
                          </td>
                          <td className="max-w-[200px] px-3 py-2 text-xs text-gray-900">
                            <div
                              className="truncate"
                              title={pengaduan.detail_pengaduan}
                            >
                              {pengaduan.detail_pengaduan}
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${
                                pengaduan.status === "Diterima"
                                  ? "border-green-200 bg-green-50 text-green-700"
                                  : pengaduan.status === "Ditolak"
                                    ? "border-red-200 bg-red-50 text-red-700"
                                    : pengaduan.status === "Diajukan"
                                      ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                                      : "border-gray-200 bg-gray-50 text-gray-700"
                              }`}
                            >
                              {pengaduan.status === "Diterima" ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : pengaduan.status === "Ditolak" ? (
                                <XCircle className="h-4 w-4 text-red-600" />
                              ) : pengaduan.status === "Diajukan" ? (
                                <Clock className="h-4 w-4 text-yellow-600" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-gray-600" />
                              )}
                              {pengaduan.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs font-medium whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() =>
                                  navigate(`/admin/pengaduan/${pengaduan.id}`)
                                }
                                className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                              >
                                <Eye className="h-3 w-3" />
                                Verifikasi
                              </button>
                              <button
                                onClick={() =>
                                  handleDeletePengaduan(pengaduan.id)
                                }
                                className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                                disabled={
                                  isDeleting && deletingId === pengaduan.id
                                }
                              >
                                {isDeleting && deletingId === pengaduan.id ? (
                                  <span className="animate-spin">
                                    <Trash2 className="h-3 w-3" />
                                  </span>
                                ) : (
                                  <Trash2 className="h-3 w-3" />
                                )}
                                {isDeleting && deletingId === pengaduan.id
                                  ? "Menghapus..."
                                  : "Hapus"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {sortedPengaduanList.length === 0 && (
                    <div className="py-12 text-center">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        Tidak ada data
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Tidak ditemukan pengaduan yang sesuai dengan filter yang
                        dipilih.
                      </p>
                    </div>
                  )}
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
                          filteredPengaduanList.length,
                        )}
                      </span>{" "}
                      dari{" "}
                      <span className="font-medium">
                        {filteredPengaduanList.length}
                      </span>{" "}
                      pengaduan
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
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
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
                        ),
                      )}
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
