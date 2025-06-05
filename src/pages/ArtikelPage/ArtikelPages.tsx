// import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Button as ButtonFlowbite,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Spinner,
  Pagination,
} from "flowbite-react";
import {
  Eye,
  Check,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "../../config/api";

const jenisArtikelOptions = [
  { value: "warga", label: "Warga" },
  { value: "resmi", label: "Resmi" },
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
  // updated_at: string; // Not displayed in table
}

// Adjusted interface to match the actual API response structure
interface PaginatedArtikelData {
  current_page: number;
  data: Artikel[];
  last_page?: number; // To determine total pages
  total?: number; // Alternative to determine total pages
  per_page?: number; // To confirm items per page from API
}

interface ArtikelResponse {
  status: string; // e.g., "success"
  data: PaginatedArtikelData;
}

type StatusArtikelFilter = "Semua" | "Diterbitkan" | "Diajukan" | "Ditolak";

export default function ArtikelPages() {
  const navigate = useNavigate();
  const [artikelList, setArtikelList] = useState<Artikel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] =
    useState<StatusArtikelFilter>("Semua");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalArtikelCount, setTotalArtikelCount] = useState(0); // State for total articles
  const itemsPerPage = 10;

  // State for stats API
  const [artikelDiajukanCount, setArtikelDiajukanCount] = useState(0);
  const [artikelDiterbitkanCount, setArtikelDiterbitkanCount] = useState(0);
  // We could add a loading/error state for stats if needed
  // const [statsLoading, setStatsLoading] = useState(true);
  // const [statsError, setStatsError] = useState<string | null>(null);

  const [openJenisArtikelFilter, setOpenJenisArtikelFilter] =
    React.useState(false);
  const [jenisArtikelFilter, setJenisArtikelFilter] = React.useState("");

  const formatDate = useCallback((dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
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
          // navigate("/"); // Optional: redirect to login if no token
          return;
        }
        const response = await axios.get(
          `${API_CONFIG.baseURL}/api/artikel?page=${currentPage}&per_page=${itemsPerPage}`,
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

          // Calculate total pages based on available information
          if (responseData.last_page) {
            setTotalPages(responseData.last_page);
          } else if (
            typeof responseData.total === "number" &&
            responseData.per_page
          ) {
            setTotalPages(
              Math.ceil(responseData.total / responseData.per_page),
            );
          } else if (typeof responseData.total === "number") {
            setTotalPages(Math.ceil(responseData.total / itemsPerPage));
          } else {
            // Fallback for totalPages if total count is unknown and no last_page.
            setTotalPages(articles && articles.length > 0 ? 1 : 0);
          }
        } else {
          setArtikelList([]);
          setTotalPages(0);
          setTotalArtikelCount(0); // Reset total count
        }
      } catch (err) {
        console.error("Error fetching artikel data:", err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          setError("Sesi Anda telah berakhir. Silakan login kembali.");
          // navigate("/"); // Optional: redirect to login on 401
        } else {
          setError("Gagal mengambil data artikel.");
        }
        setArtikelList([]); // Clear data on error
        setTotalPages(0); // Reset pages on error
        setTotalArtikelCount(0); // Reset total count on error
      } finally {
        setLoading(false);
      }
    };
    fetchArtikelData();
  }, [navigate, currentPage]);

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

  const filteredArtikelList = React.useMemo(() => {
    return artikelList.filter((artikel) => {
      let statusMatch = false;
      const artikelStatusLower = artikel.status_artikel?.toLowerCase() || ""; // Safer: handle potential null/undefined
      const statusFilterLower = statusFilter.toLowerCase();

      if (statusFilter === "Semua") {
        statusMatch = true;
      } else if (statusFilter === "Diterbitkan") {
        // Match "diterbitkan" or "disetujui" for the "Diterbitkan" filter
        statusMatch =
          artikelStatusLower === "diterbitkan" ||
          artikelStatusLower === "disetujui";
      } else {
        // For "Diajukan", "Ditolak", match the specific status
        statusMatch = artikelStatusLower === statusFilterLower;
      }

      const jenisMatch =
        jenisArtikelFilter === "" ||
        artikel.jenis_artikel === jenisArtikelFilter;
      return statusMatch && jenisMatch;
    });
  }, [artikelList, statusFilter, jenisArtikelFilter]);

  const handleStatusFilterClick = (status: StatusArtikelFilter) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedArtikelList = React.useMemo(() => {
    const listToSort = [...filteredArtikelList];
    if (!sortField) return listToSort;

    listToSort.sort((a, b) => {
      let valA, valB;

      if (
        sortField === "created_at" ||
        sortField === "tanggal_publikasi_artikel"
      ) {
        valA = a[sortField] ? new Date(a[sortField]!).getTime() : 0;
        valB = b[sortField] ? new Date(b[sortField]!).getTime() : 0;
        if (!a[sortField])
          valA = sortDirection === "asc" ? Infinity : -Infinity; // Handle nulls for sorting
        if (!b[sortField])
          valB = sortDirection === "asc" ? Infinity : -Infinity;
      } else if (sortField === "id_artikel") {
        valA = a.id_artikel;
        valB = b.id_artikel;
      } else {
        // Fallback for string comparisons (e.g., judul, kategori)
        valA = (a[sortField as keyof Artikel] as string)?.toLowerCase() || "";
        valB = (b[sortField as keyof Artikel] as string)?.toLowerCase() || "";
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return listToSort;
  }, [filteredArtikelList, sortField, sortDirection]);

  const getStatusLabel = (statusKey: string) => {
    const lowerStatus = statusKey?.toLowerCase();
    if (lowerStatus === "diterbitkan" || lowerStatus === "disetujui")
      return "Diterbitkan"; // Assuming 'disetujui' is a possible alias
    if (lowerStatus === "diajukan") return "Diajukan";
    if (lowerStatus === "ditolak") return "Ditolak";
    return statusKey; // Fallback to original status if not mapped
  };

  const getStatusColor = (statusKey: string) => {
    const lowerStatus = statusKey?.toLowerCase();
    if (lowerStatus === "diterbitkan" || lowerStatus === "disetujui")
      return "bg-green-100 text-green-800";
    if (lowerStatus === "ditolak") return "bg-red-100 text-red-800";
    // Default for "diajukan" or other statuses
    return "bg-yellow-100 text-yellow-800";
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

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
                  <BreadcrumbPage>Artikel Desa</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="mb-0 flex justify-end">
            <Button
              onClick={() => navigate("/artikel/buat")}
              className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              Buat Artikel
            </Button>
          </div>
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-gray-200 p-4">
              <p className="font-medium text-gray-700">Total Artikel</p>
              <p className="mt-2 text-center text-4xl font-bold">
                {totalArtikelCount}
              </p>
            </div>
            <div className="rounded-xl bg-gray-200 p-4">
              <p className="font-medium text-gray-700">Artikel Diajukan</p>
              <p className="mt-2 text-center text-4xl font-bold">
                {artikelDiajukanCount}
              </p>
            </div>
            <div className="rounded-xl bg-gray-200 p-4">
              <p className="font-medium text-gray-700">Artikel Diterbitkan</p>
              <p className="mt-2 text-center text-4xl font-bold">
                {artikelDiterbitkanCount}
              </p>
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex justify-center">
              <div className="flex overflow-hidden rounded-full bg-gray-200">
                {(
                  [
                    "Semua",
                    "Diterbitkan",
                    "Diajukan",
                    "Ditolak",
                  ] as StatusArtikelFilter[]
                ).map((status) => (
                  <div
                    key={status}
                    className={`cursor-pointer px-4 py-2 font-medium ${statusFilter === status ? "bg-gray-300" : "hover:bg-gray-300"}`}
                    onClick={() => handleStatusFilterClick(status)}
                  >
                    {status}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Popover
                open={openJenisArtikelFilter}
                onOpenChange={setOpenJenisArtikelFilter}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openJenisArtikelFilter}
                    className="w-[200px] justify-between"
                  >
                    {jenisArtikelFilter
                      ? jenisArtikelOptions.find(
                          (option) => option.value === jenisArtikelFilter,
                        )?.label
                      : "Pilih Jenis Artikel"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Cari Jenis Artikel" />
                    <CommandList>
                      <CommandEmpty>Jenis tidak ditemukan.</CommandEmpty>
                      <CommandGroup>
                        {jenisArtikelOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={(currentValue) => {
                              setJenisArtikelFilter(
                                currentValue === jenisArtikelFilter
                                  ? ""
                                  : currentValue,
                              );
                              setOpenJenisArtikelFilter(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                jenisArtikelFilter === option.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {jenisArtikelFilter && (
                <Button
                  variant="outline"
                  onClick={() => setJenisArtikelFilter("")}
                >
                  Reset Jenis Artikel
                </Button>
              )}
            </div>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-white p-4 shadow-sm md:min-h-min">
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <Spinner size="xl" />
              </div>
            ) : error ? (
              <div className="py-4 text-center text-red-500">{error}</div>
            ) : sortedArtikelList.length === 0 ? (
              <div className="py-4 text-center text-gray-500">
                Tidak ada data artikel.
              </div>
            ) : (
              <Table striped>
                <TableHead>
                  <TableRow>
                    <TableHeadCell
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("id_artikel")}
                    >
                      <div className="flex items-center justify-between">
                        <span>Id</span>
                        {sortField === "id_artikel" &&
                          (sortDirection === "asc" ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronUp className="h-5 w-5" />
                          ))}
                      </div>
                    </TableHeadCell>
                    <TableHeadCell>Jenis</TableHeadCell>
                    <TableHeadCell
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("judul_artikel")}
                    >
                      <div className="flex items-center justify-between">
                        <span>Judul</span>
                        {sortField === "judul_artikel" &&
                          (sortDirection === "asc" ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronUp className="h-5 w-5" />
                          ))}
                      </div>
                    </TableHeadCell>
                    <TableHeadCell
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("kategori_artikel")}
                    >
                      <div className="flex items-center justify-between">
                        <span>Kategori</span>
                        {sortField === "kategori_artikel" &&
                          (sortDirection === "asc" ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronUp className="h-5 w-5" />
                          ))}
                      </div>
                    </TableHeadCell>
                    <TableHeadCell
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("created_at")}
                    >
                      <div className="flex items-center justify-between">
                        <span>Tgl. Dibuat</span>
                        {sortField === "created_at" &&
                          (sortDirection === "asc" ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronUp className="h-5 w-5" />
                          ))}
                      </div>
                    </TableHeadCell>
                    <TableHeadCell
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("tanggal_publikasi_artikel")}
                    >
                      <div className="flex items-center justify-between">
                        <span>Tgl. Publikasi</span>
                        {sortField === "tanggal_publikasi_artikel" &&
                          (sortDirection === "asc" ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronUp className="h-5 w-5" />
                          ))}
                      </div>
                    </TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell>Aksi</TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedArtikelList.map((artikel) => (
                    <TableRow key={artikel.id_artikel}>
                      <TableCell>{artikel.id_artikel}</TableCell>
                      <TableCell>
                        {
                          jenisArtikelOptions.find(
                            (opt) => opt.value === artikel.jenis_artikel,
                          )?.label
                        }
                      </TableCell>
                      <TableCell>{artikel.judul_artikel}</TableCell>
                      <TableCell>{artikel.kategori_artikel}</TableCell>
                      <TableCell>{formatDate(artikel.created_at)}</TableCell>
                      <TableCell>
                        {formatDate(artikel.tanggal_publikasi_artikel)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(artikel.status_artikel)}`}
                        >
                          {getStatusLabel(artikel.status_artikel)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <ButtonFlowbite
                          size="xs"
                          color="info"
                          className="flex items-center gap-1"
                          onClick={() =>
                            navigate(`/artikel/${artikel.id_artikel}`)
                          }
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
