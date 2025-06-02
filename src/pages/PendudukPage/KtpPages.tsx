// import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
// import { cn } from "@/lib/utils"; // cn is not used
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Spinner,
  Pagination,
  TextInput,
  Button as ButtonFlowbite,
} from "flowbite-react";
import {
  Search,
  // ChevronsUpDown, // ChevronsUpDown is not used
  ChevronUp,
  ChevronDown,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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

// interface PaginatedPendudukData { // Not used if API returns Penduduk[] directly
//   current_page: number;
//   data: Penduduk[];
//   last_page?: number;
//   total?: number;
//   per_page?: number;
// }

// interface PendudukResponse { // Not used if API returns Penduduk[] directly
//   status: string;
//   data: PaginatedPendudukData;
// }

interface PendudukStatsResponse {
  total_penduduk: number;
  total_laki_laki: number;
  total_perempuan: number;
}

export default function DataKTPPages() {
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
  // const [totalPendudukCount, setTotalPendudukCount] = useState(0); // totalPendudukCount is obtained from stats
  const itemsPerPage = 10;

  // State for stats API
  const [stats, setStats] = useState<PendudukStatsResponse | null>(null);

  const formatDate = useCallback((dateString: string | null) => {
    if (!dateString) return "-";
    // Assuming dateString is in "DD-MM-YYYY" format as per example, needs parsing
    // If API returns "YYYY-MM-DDTHH:mm:ss.sssZ" then new Date(dateString) is fine
    // For "DD-MM-YYYY", we need to parse it manually or use a library
    if (dateString.includes("T")) {
      // ISO format like "2025-05-13T09:45:20.000000Z"
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } else if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
      // DD-MM-YYYY format
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
    return dateString; // Fallback if format is unexpected
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
        const response = await axios.get<Penduduk[]>(
          `https://thankful-urgently-silkworm.ngrok-free.app/api/penduduk?page=${currentPage}&per_page=${itemsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "69420",
            },
          },
        );
        const pendudukItems = response.data;

        if (Array.isArray(pendudukItems)) {
          setPendudukList(pendudukItems);
          // Preliminary totalPages calculation if stats are not yet loaded.
          // This will be refined by the dedicated useEffect for totalPages once stats are available.
          if (!stats) {
            if (pendudukItems.length === 0 && currentPage > 1) {
              setTotalPages(currentPage - 1);
            } else if (pendudukItems.length < itemsPerPage) {
              setTotalPages(currentPage);
            } else {
              setTotalPages(currentPage + 1);
            }
          }
        } else {
          console.error(
            "Expected an array of penduduk items, but received:",
            pendudukItems,
          );
          setPendudukList([]);
          setTotalPages(0);
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
      } finally {
        setLoading(false);
      }
    };
    fetchPendudukData();
  }, [navigate, currentPage, itemsPerPage]); // Removed searchTerm from dependencies

  // useEffect for calculating totalPages, primarily based on stats
  useEffect(() => {
    if (stats && stats.total_penduduk > 0) {
      setTotalPages(Math.ceil(stats.total_penduduk / itemsPerPage));
    } else if (stats && stats.total_penduduk === 0) {
      setTotalPages(0);
    }
    // If stats is null, the preliminary calculation in fetchPendudukData is used until stats load.
  }, [stats, itemsPerPage]);

  useEffect(() => {
    const fetchPendudukStats = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          return;
        }
        const response = await axios.get<PendudukStatsResponse>(
          "https://thankful-urgently-silkworm.ngrok-free.app/api/penduduk/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "69420",
            },
          },
        );
        if (response.data) {
          setStats(response.data);
        } else {
          setStats(null);
        }
      } catch (err) {
        console.error("Error fetching penduduk stats:", err);
        setStats(null);
      }
    };
    fetchPendudukStats();
  }, [navigate]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleSort = (field: keyof Penduduk) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedPendudukList = useMemo(() => {
    // Apply client-side filtering first
    const filteredList = pendudukList.filter((penduduk) => {
      if (!searchTerm) return true; // If no search term, show all
      const term = searchTerm.toLowerCase();
      return (
        penduduk.nik.toLowerCase().includes(term) ||
        penduduk.nama.toLowerCase().includes(term)
      );
    });

    // Then sort the filtered list
    const listToSort = [...filteredList];
    if (!sortField) return listToSort;

    listToSort.sort((a, b) => {
      let valA = a[sortField] as string | number;
      let valB = b[sortField] as string | number;

      if (sortField === "tanggal_lahir") {
        // Special handling for DD-MM-YYYY dates if not already Date objects
        const dateA = new Date(a.tanggal_lahir.split("-").reverse().join("-")); // Convert DD-MM-YYYY to YYYY-MM-DD for Date constructor
        const dateB = new Date(b.tanggal_lahir.split("-").reverse().join("-"));
        valA = dateA.getTime();
        valB = dateB.getTime();
      } else if (sortField === "created_at" || sortField === "updated_at") {
        valA = new Date(a[sortField]!).getTime();
        valB = new Date(b[sortField]!).getTime();
      } else if (typeof valA === "string" && typeof valB === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return listToSort;
  }, [pendudukList, sortField, sortDirection, searchTerm]);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  // const handleLogout = () => {
  //   // Clear authentication token (e.g., from localStorage)
  //   localStorage.removeItem("authToken");
  //   // Redirect to login page
  //   navigate("/");
  // };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  Penduduk Desa
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data KTP</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="mb-0 flex justify-end">
            <Button onClick={() => navigate("/dataktp/tambahktp")} className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
              Tambah KTP
            </Button>
          </div>
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-gray-200 p-4">
              <p className="font-medium text-gray-700">Total Penduduk</p>
              <p className="mt-2 text-center text-4xl font-bold">
                {stats?.total_penduduk ?? "-"}
              </p>
            </div>
            <div className="rounded-xl bg-gray-200 p-4">
              <p className="font-medium text-gray-700">Total Laki-laki</p>
              <p className="mt-2 text-center text-4xl font-bold">
                {stats?.total_laki_laki ?? "-"}
              </p>
            </div>
            <div className="rounded-xl bg-gray-200 p-4">
              <p className="font-medium text-gray-700">Total Perempuan</p>
              <p className="mt-2 text-center text-4xl font-bold">
                {stats?.total_perempuan ?? "-"}
              </p>
            </div>
          </div>

          <div className="my-4">
            <TextInput
              icon={Search}
              type="search"
              placeholder="Cari berdasarkan NIK atau Nama..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="min-h-[100vh] flex-1 rounded-xl bg-white p-4 shadow-sm md:min-h-min">
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <Spinner size="xl" />
              </div>
            ) : error ? (
              <div className="py-4 text-center text-red-500">{error}</div>
            ) : sortedPendudukList.length === 0 ? (
              <div className="py-4 text-center text-gray-500">
                Tidak ada data penduduk.
              </div>
            ) : (
              <Table striped>
                <TableHead>
                  <TableRow>
                    <TableHeadCell
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("nik")}
                    >
                      <div className="flex items-center justify-between">
                        <span>NIK</span>
                        {sortField === "nik" &&
                          (sortDirection === "asc" ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronUp className="h-5 w-5" />
                          ))}
                      </div>
                    </TableHeadCell>
                    <TableHeadCell
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("nama")}
                    >
                      <div className="flex items-center justify-between">
                        <span>Nama</span>
                        {sortField === "nama" &&
                          (sortDirection === "asc" ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronUp className="h-5 w-5" />
                          ))}
                      </div>
                    </TableHeadCell>
                    <TableHeadCell>Tempat Lahir</TableHeadCell>
                    <TableHeadCell
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("tanggal_lahir")}
                    >
                      <div className="flex items-center justify-between">
                        <span>Tgl. Lahir</span>
                        {sortField === "tanggal_lahir" &&
                          (sortDirection === "asc" ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronUp className="h-5 w-5" />
                          ))}
                      </div>
                    </TableHeadCell>
                    <TableHeadCell>Jenis Kelamin</TableHeadCell>
                    <TableHeadCell>Alamat</TableHeadCell>
                    <TableHeadCell>Aksi</TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedPendudukList.map((penduduk) => (
                    <TableRow key={penduduk.nik}>
                      <TableCell>{penduduk.nik}</TableCell>
                      <TableCell>{penduduk.nama}</TableCell>
                      <TableCell>{penduduk.tempat_lahir}</TableCell>
                      <TableCell>
                        {formatDate(penduduk.tanggal_lahir)}
                      </TableCell>
                      <TableCell>{penduduk.jenis_kelamin}</TableCell>
                      <TableCell>{`${penduduk.alamat}, RT ${penduduk.rt}/${penduduk.rw}, ${penduduk.desa_kelurahan}, ${penduduk.kecamatan}, ${penduduk.kabupaten_kota}, ${penduduk.provinsi} ${penduduk.kode_pos}`}</TableCell>
                      <TableCell>
                        <ButtonFlowbite
                          size="xs"
                          color="info"
                          className="flex items-center gap-1"
                          onClick={() => navigate(`/dataktp/${penduduk.nik}`)}
                        >
                          <Eye className="h-4 w-4" />
                          <span>Detail</span>
                        </ButtonFlowbite>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center text-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                  showIcons
                />
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
