import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import {
  Search,
  ChevronUp,
  ChevronDown,
  Eye,
  Users,
  User,
  UserCheck,
  Filter,
  AlertCircle,
  Plus,
  Home,
  Trash2,
  Pencil,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "../../config/api";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface Penduduk {
  nik: string;
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: "Laki-laki" | "Perempuan";
  alamat: string;
  rt: string;
  rw: string;
  desa_kelurahan: string;
  kecamatan: string;
  kabupaten_kota: string;
  provinsi: string;
  kode_pos: string;
  agama: string;
  status_perkawinan: string;
  pekerjaan: string;
  kewarganegaraan: string;
  pendidikan: string;
  no_kk: string;
  created_at: string;
  updated_at: string;
}

interface PendudukStatsResponse {
  total_penduduk: number;
  total_laki_laki: number;
  total_perempuan: number;
  total_kk: number;
}

interface ApiResponse {
  status: string;
  data: Penduduk[];
  message: string;
}

export default function PendudukPages() {
  const navigate = useNavigate();
  const [allPendudukData, setAllPendudukData] = useState<Penduduk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Penduduk | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State for stats API
  const [stats, setStats] = useState<PendudukStatsResponse | null>(null);

  const [selectedGender, setSelectedGender] = useState<string>("");

  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const formatDate = useCallback((dateString: string | null) => {
    if (!dateString) return "-";
    if (dateString.includes("T")) {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } else if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
      const parts = dateString.split("-");
      if (parts.length === 3) {
        const date = new Date(
          parseInt(parts[2]),
          parseInt(parts[1]) - 1,
          parseInt(parts[0]),
        );
        return date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
      }
    }
    return dateString;
  }, []);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = allPendudukData;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (penduduk) =>
          penduduk.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
          penduduk.nama.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply gender filter
    if (selectedGender) {
      filtered = filtered.filter(
        (penduduk) => penduduk.jenis_kelamin === selectedGender,
      );
    }

    // Apply sorting
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === "string" && typeof bValue === "string") {
          const comparison = aValue.localeCompare(bValue);
          return sortDirection === "asc" ? comparison : -comparison;
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [allPendudukData, searchTerm, selectedGender, sortField, sortDirection]);

  // Calculate pagination
  const totalItems = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredAndSortedData.slice(startIndex, endIndex);

  // Generate pagination numbers (max 5 pages)
  const getPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show 5 pages with ellipsis
      if (currentPage <= 3) {
        // Show first 5 pages
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        // Show last 5 pages
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show 2 pages before and 2 pages after current page
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  const paginationNumbers = getPaginationNumbers();

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedGender]);

  useEffect(() => {
    const fetchPendudukData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Token tidak ditemukan. Silakan login kembali.");
          setLoading(false);
          navigate("/");
          return;
        }

        const response = await axios.get<ApiResponse>(
          `${API_CONFIG.baseURL}/api/penduduk`,
          {
            headers: {
              ...API_CONFIG.headers,
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.data && Array.isArray(response.data.data)) {
          setAllPendudukData(response.data.data);
        } else {
          setAllPendudukData([]);
        }
      } catch (err) {
        console.error("Error fetching penduduk data:", err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          setError("Sesi Anda telah berakhir. Silakan login kembali.");
          navigate("/");
        } else {
          setError("Gagal mengambil data penduduk.");
        }
        setAllPendudukData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPendudukData();
  }, [navigate]);

  useEffect(() => {
    const fetchPendudukStats = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await axios.get<PendudukStatsResponse>(
          `${API_CONFIG.baseURL}/api/penduduk/stats`,
          {
            headers: {
              ...API_CONFIG.headers,
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setStats(response.data);
      } catch (err) {
        console.error("Error fetching penduduk stats:", err);
        setStats(null);
      }
    };
    fetchPendudukStats();
  }, [navigate]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (field: keyof Penduduk) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGender(event.target.value);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handleDelete = async (nik: string) => {
    toast.custom(
      (t) => (
        <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div>
              <h3 className="font-medium text-gray-900">Konfirmasi Hapus</h3>
              <p className="text-sm text-gray-500">
                Apakah Anda yakin ingin menghapus penduduk ini?
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
                    setDeleteLoading(nik);
                    const token = localStorage.getItem("authToken");
                    if (!token) {
                      reject("Token tidak ditemukan. Silakan login kembali.");
                      setDeleteLoading(null);
                      return;
                    }
                    // Move async logic to an inner function
                    (async () => {
                      try {
                        await axios.delete(
                          `${API_CONFIG.baseURL}/api/penduduk/${nik}`,
                          {
                            headers: {
                              ...API_CONFIG.headers,
                              Authorization: `Bearer ${token}`,
                            },
                          },
                        );
                        setAllPendudukData((prev) =>
                          prev.filter((p) => p.nik !== nik),
                        );
                        resolve("Penduduk berhasil dihapus");
                      } catch (error) {
                        console.error("Error deleting penduduk:", error);
                        reject("Gagal menghapus penduduk. Silakan coba lagi.");
                      } finally {
                        setDeleteLoading(null);
                      }
                    })();
                  }),
                  {
                    loading: "Menghapus penduduk...",
                    success: (msg: string) => msg,
                    error: (msg: string) => msg,
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
                  Data Penduduk
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Kelola data Penduduk desa
                </p>
              </div>
              <Button
                onClick={() => navigate("/admin/penduduk/tambah")}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-lg transition-colors hover:bg-blue-700 hover:shadow-xl"
              >
                <Plus className="h-5 w-5" />
                Tambah Penduduk
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="flex items-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mr-4 rounded-full bg-blue-100 p-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Penduduk
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats?.total_penduduk?.toLocaleString() ?? "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mr-4 rounded-full bg-purple-100 p-3">
                  <Home className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Kepala Keluarga
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats?.total_kk?.toLocaleString() ?? "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mr-4 rounded-full bg-green-100 p-3">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Laki-laki</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats?.total_laki_laki?.toLocaleString() ?? "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mr-4 rounded-full bg-pink-100 p-3">
                  <UserCheck className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Perempuan</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats?.total_perempuan?.toLocaleString() ?? "-"}
                  </p>
                </div>
              </div>
            </div>
            <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                  <div className="relative max-w-md flex-1">
                    <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari berdasarkan NIK atau Nama..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <select
                      value={selectedGender}
                      onChange={handleGenderChange}
                      className="min-w-[160px] appearance-none rounded-lg border border-gray-300 bg-white py-3 pr-8 pl-10 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Semua Gender</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Menampilkan {currentPageData.length} dari {totalItems} data
                </div>
              </div>
            </div>
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
              ) : currentPageData.length === 0 ? (
                <div className="py-12 text-center">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Tidak ada data
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Tidak ditemukan penduduk yang sesuai dengan filter yang
                    dipilih.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          className="cursor-pointer px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase transition-colors select-none hover:bg-gray-100"
                          onClick={() => handleSort("nik")}
                        >
                          NIK{" "}
                          {sortField === "nik" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="inline h-4 w-4" />
                            ) : (
                              <ChevronDown className="inline h-4 w-4" />
                            ))}
                        </th>
                        <th
                          className="cursor-pointer px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase transition-colors select-none hover:bg-gray-100"
                          onClick={() => handleSort("nama")}
                        >
                          Nama{" "}
                          {sortField === "nama" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="inline h-4 w-4" />
                            ) : (
                              <ChevronDown className="inline h-4 w-4" />
                            ))}
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Tempat Lahir
                        </th>
                        <th
                          className="cursor-pointer px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase transition-colors select-none hover:bg-gray-100"
                          onClick={() => handleSort("tanggal_lahir")}
                        >
                          Tgl. Lahir{" "}
                          {sortField === "tanggal_lahir" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="inline h-4 w-4" />
                            ) : (
                              <ChevronDown className="inline h-4 w-4" />
                            ))}
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Jenis Kelamin
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Alamat
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {currentPageData.map((penduduk) => (
                        <tr
                          key={penduduk.nik}
                          className="transition-colors hover:bg-gray-50"
                        >
                          <td className="max-w-[120px] px-3 py-2 text-xs font-medium whitespace-nowrap text-gray-900">
                            <div className="truncate" title={penduduk.nik}>
                              {penduduk.nik}
                            </div>
                          </td>
                          <td className="max-w-[150px] px-3 py-2 text-xs font-medium whitespace-nowrap text-gray-900">
                            <div className="truncate" title={penduduk.nama}>
                              {penduduk.nama}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-xs whitespace-nowrap text-gray-900">
                            {penduduk.tempat_lahir}
                          </td>
                          <td className="px-3 py-2 text-xs whitespace-nowrap text-gray-900">
                            {formatDate(penduduk.tanggal_lahir)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${penduduk.jenis_kelamin === "Laki-laki" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"}`}
                            >
                              {penduduk.jenis_kelamin === "Laki-laki" ? (
                                <User className="mr-1 h-3 w-3" />
                              ) : (
                                <UserCheck className="mr-1 h-3 w-3" />
                              )}
                              {penduduk.jenis_kelamin}
                            </span>
                          </td>
                          <td className="max-w-[250px] px-3 py-2 text-xs text-gray-900">
                            <div
                              className="truncate"
                              title={`${penduduk.alamat}, RT ${penduduk.rt}/${penduduk.rw}, ${penduduk.desa_kelurahan}, ${penduduk.kecamatan}, ${penduduk.kabupaten_kota}, ${penduduk.provinsi} ${penduduk.kode_pos}`}
                            >{`${penduduk.alamat}, RT ${penduduk.rt}/${penduduk.rw}, ${penduduk.desa_kelurahan}, ${penduduk.kecamatan}, ${penduduk.kabupaten_kota}, ${penduduk.provinsi} ${penduduk.kode_pos}`}</div>
                          </td>
                          <td className="px-3 py-2 text-xs font-medium whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() =>
                                  navigate(`/admin/penduduk/${penduduk.nik}`)
                                }
                                className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                              >
                                <Eye className="h-3 w-3" />
                                Detail
                              </button>
                              <button
                                onClick={() =>
                                  navigate(
                                    `/admin/penduduk/edit/${penduduk.nik}`,
                                  )
                                }
                                className="inline-flex items-center gap-1 rounded-md bg-yellow-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none"
                              >
                                <Pencil className="h-3 w-3" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(penduduk.nik)}
                                disabled={deleteLoading === penduduk.nik}
                                className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                              >
                                {deleteLoading === penduduk.nik ? (
                                  <Spinner size="sm" className="h-3 w-3" />
                                ) : (
                                  <Trash2 className="h-3 w-3" />
                                )}
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {!loading && !error && currentPageData.length > 0 && (
                <div className="border-t border-gray-200 bg-white px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Menampilkan {startIndex + 1}-
                      {Math.min(endIndex, totalItems)} dari {totalItems} data
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        variant="outline"
                      >
                        Sebelumnya
                      </Button>
                      {/* Pagination number buttons */}
                      {paginationNumbers.map((page) => (
                        <Button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          variant={page === currentPage ? "default" : "outline"}
                          className={page === currentPage ? "font-bold" : ""}
                          disabled={page === currentPage}
                        >
                          {page}
                        </Button>
                      ))}
                      <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        variant="outline"
                      >
                        Selanjutnya
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
