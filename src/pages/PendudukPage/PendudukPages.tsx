import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Pagination } from "flowbite-react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "../../config/api";
import { Spinner } from "@/components/ui/spinner";

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
  created_at: string;
  updated_at: string;
}

interface PendudukStatsResponse {
  total_penduduk: number;
  total_laki_laki: number;
  total_perempuan: number;
  total_kk: number;
}

export default function PendudukPages() {
  const navigate = useNavigate();
  const [pendudukList, setPendudukList] = useState<Penduduk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Penduduk | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 15;

  // State for stats API
  const [stats, setStats] = useState<PendudukStatsResponse | null>(null);

  const [selectedGender, setSelectedGender] = useState<string>("");

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

        // Remove pagination parameters since server doesn't support it
        const queryParams = new URLSearchParams();

        if (searchTerm) {
          queryParams.append("search", searchTerm);
        }

        if (selectedGender) {
          queryParams.append("gender", selectedGender);
        }

        const response = await axios.get(
          `${API_CONFIG.baseURL}/api/penduduk?${queryParams.toString()}`,
          {
            headers: {
              ...API_CONFIG.headers,
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const allData = response.data;

        if (Array.isArray(allData)) {
          // Filter data based on search term if it exists
          let filteredData = allData;
          if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filteredData = allData.filter(
              (item) =>
                item.nik.toLowerCase().includes(searchLower) ||
                item.nama.toLowerCase().includes(searchLower),
            );
          }

          // Filter by gender if selected
          if (selectedGender) {
            filteredData = filteredData.filter(
              (item) => item.jenis_kelamin === selectedGender,
            );
          }

          // Calculate total pages
          const total = filteredData.length;
          const totalPagesCount = Math.ceil(total / itemsPerPage);

          // Get current page data
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const currentPageData = filteredData.slice(startIndex, endIndex);

          setPendudukList(currentPageData);
          setTotalPages(totalPagesCount);
          setTotalItems(total);
        } else {
          console.error(
            "Struktur respons API tidak sesuai. Diharapkan array.",
            allData,
          );
          setPendudukList([]);
          setTotalPages(0);
          setTotalItems(0);
        }
      } catch (err) {
        console.error("Error fetching penduduk data:", err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          setError("Sesi Anda telah berakhir. Silakan login kembali.");
          navigate("/");
        } else {
          setError("Gagal mengambil data penduduk.");
        }
        setPendudukList([]);
        setTotalPages(0);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };
    fetchPendudukData();
  }, [navigate, currentPage, itemsPerPage, searchTerm, selectedGender]);

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
    setCurrentPage(1);
  };

  const handleSort = (field: keyof Penduduk) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGender(event.target.value);
    setCurrentPage(1);
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
                  Menampilkan {pendudukList.length} dari {totalItems} data
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
              ) : pendudukList.length === 0 ? (
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
                      {pendudukList.map((penduduk) => (
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
                            <button
                              onClick={() =>
                                navigate(`/admin/penduduk/${penduduk.nik}`)
                              }
                              className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                            >
                              <Eye className="h-3 w-3" />
                              Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {totalPages > 1 && (
                <div className="border-t border-gray-200 bg-white px-4 py-3">
                  <div className="flex justify-end">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={onPageChange}
                      showIcons
                    />
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
