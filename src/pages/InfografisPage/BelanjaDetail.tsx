import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah } from "@/utils/formatters";
import axios from "axios";
import { API_CONFIG } from "@/config/api";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  TrendingUp,
  ShoppingCart,
  Package,
  AlertTriangle,
} from "lucide-react";

interface Belanja {
  id_belanja: number;
  tahun_anggaran: number;
  tanggal_realisasi: string;
  kategori: string;
  sub_kategori: string;
  deskripsi: string;
  jumlah: string;
  sumber_dana: string;
  keterangan: string;
  user: {
    id: number;
    name: string;
  };
  penerima_vendor: string;
}

interface BelanjaResponse {
  status: string;
  data: {
    current_page: number;
    data: Belanja[];
    total: number;
    last_page: number;
    next_page_url: string | null;
  };
}

export default function BelanjaDetail() {
  const navigate = useNavigate();
  const [belanjaData, setBelanjaData] = useState<Belanja[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [currentPage, setCurrentPage] = useState<{ [key: string]: number }>({
    "Belanja Barang": 1,
    "Belanja Modal": 1,
    "Belanja Tak Terduga": 1,
  });

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const fetchAllBelanja = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Token tidak ditemukan. Silakan login kembali.");
          setIsLoading(false);
          navigate("/");
          return;
        }

        let allData: Belanja[] = [];
        let currentPage = 1;
        let hasNextPage = true;

        while (hasNextPage) {
          const response = await axios.get<BelanjaResponse>(
            `${API_CONFIG.baseURL}/api/belanja?page=${currentPage}`,
            {
              headers: {
                ...API_CONFIG.headers,
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (response.data.status === "success") {
            allData = [...allData, ...response.data.data.data];
            hasNextPage = response.data.data.next_page_url !== null;
            currentPage++;
          } else {
            throw new Error("Failed to fetch data");
          }
        }

        // Sort data by tahun_anggaran in descending order
        allData.sort((a, b) => b.tahun_anggaran - a.tahun_anggaran);

        setBelanjaData(allData);

        // Set initial year to the latest year in the data
        if (allData.length > 0) {
          const latestYear = allData[0].tahun_anggaran;
          setSelectedYear(latestYear);
        }
      } catch (err) {
        console.error("Error fetching belanja data:", err);
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            setError("Sesi Anda telah berakhir. Silakan login kembali.");
            navigate("/");
          } else if (err.response?.status === 404) {
            setError("Endpoint API tidak ditemukan (404).");
          } else {
            setError("Gagal mengambil data belanja.");
          }
        } else {
          setError("Terjadi kesalahan yang tidak diketahui.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllBelanja();
  }, [navigate]);

  const filterBelanjaByKategori = (kategori: string) => {
    return belanjaData
      .filter((item) => item.kategori === kategori)
      .filter((item) => item.tahun_anggaran === selectedYear);
  };

  const getPaginatedData = (data: Belanja[], kategori: string) => {
    const startIndex = (currentPage[kategori] - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return data.slice(startIndex, endIndex);
  };

  const handlePageChange = (kategori: string, newPage: number) => {
    setCurrentPage((prev) => ({
      ...prev,
      [kategori]: newPage,
    }));
  };

  const getTotalByKategori = (kategori: string) => {
    return filterBelanjaByKategori(kategori).reduce(
      (total, item) => total + parseFloat(item.jumlah),
      0,
    );
  };

  const getGrandTotal = () => {
    return belanjaData
      .filter((item) => item.tahun_anggaran === selectedYear)
      .reduce((total, item) => total + parseFloat(item.jumlah), 0);
  };

  const renderPagination = (totalItems: number, kategori: string) => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (totalPages <= 1) return null;

    return (
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Menampilkan {(currentPage[kategori] - 1) * ITEMS_PER_PAGE + 1} -{" "}
          {Math.min(currentPage[kategori] * ITEMS_PER_PAGE, totalItems)} dari{" "}
          {totalItems} data
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handlePageChange(kategori, currentPage[kategori] - 1)
            }
            disabled={currentPage[kategori] === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            {currentPage[kategori]} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handlePageChange(kategori, currentPage[kategori] + 1)
            }
            disabled={currentPage[kategori] === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const renderBelanjaTable = (data: Belanja[], kategori: string) => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <div className="h-8 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-8 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-8 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    if (data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <p className="text-lg font-medium">Tidak ada data belanja</p>
          <p className="text-sm">Belum ada data belanja untuk kategori ini</p>
        </div>
      );
    }

    const paginatedData = getPaginatedData(data, kategori);
    const total = getTotalByKategori(kategori);

    return (
      <div className="space-y-4">
        {/* Summary Card */}
        <div
          className={`rounded-xl border p-4 ${
            kategori === "Belanja Barang"
              ? "border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50"
              : kategori === "Belanja Modal"
                ? "border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50"
                : "border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`rounded-lg p-2 ${
                  kategori === "Belanja Barang"
                    ? "bg-blue-100"
                    : kategori === "Belanja Modal"
                      ? "bg-purple-100"
                      : "bg-orange-100"
                }`}
              >
                {kategori === "Belanja Barang" ? (
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                ) : kategori === "Belanja Modal" ? (
                  <Package className="h-5 w-5 text-purple-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                )}
              </div>
              <div>
                <p
                  className={`text-sm font-medium ${
                    kategori === "Belanja Barang"
                      ? "text-blue-900"
                      : kategori === "Belanja Modal"
                        ? "text-purple-900"
                        : "text-orange-900"
                  }`}
                >
                  Total {kategori}
                </p>
                <p
                  className={`text-2xl font-bold ${
                    kategori === "Belanja Barang"
                      ? "text-blue-700"
                      : kategori === "Belanja Modal"
                        ? "text-purple-700"
                        : "text-orange-700"
                  }`}
                >
                  {formatRupiah(total)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-sm ${
                  kategori === "Belanja Barang"
                    ? "text-blue-600"
                    : kategori === "Belanja Modal"
                      ? "text-purple-600"
                      : "text-orange-600"
                }`}
              >
                {data.length} transaksi
              </p>
              <p
                className={`text-xs ${
                  kategori === "Belanja Barang"
                    ? "text-blue-500"
                    : kategori === "Belanja Modal"
                      ? "text-purple-500"
                      : "text-orange-500"
                }`}
              >
                Tahun {selectedYear}
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal Realisasi</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Penerima/Vendor</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((item) => (
                  <TableRow key={item.id_belanja}>
                    <TableCell>
                      {new Date(item.tanggal_realisasi).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        {item.kategori}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="truncate font-medium">{item.deskripsi}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        {item.penerima_vendor}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-600">
                          {item.keterangan}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="block text-right font-bold text-gray-900">
                        {formatRupiah(parseFloat(item.jumlah))}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {renderPagination(data.length, kategori)}
      </div>
    );
  };

  const availableYears = Array.from(
    new Set(belanjaData.map((item) => item.tahun_anggaran)),
  ).sort((a, b) => b - a);

  const kategoris = ["Belanja Barang", "Belanja Modal", "Belanja Tak Terduga"];

  // Add console log to debug filtering
  useEffect(() => {
    console.log("Selected Year:", selectedYear);
    console.log(
      "Filtered Data:",
      belanjaData.filter((item) => item.tahun_anggaran === selectedYear),
    );
  }, [selectedYear, belanjaData]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2"
                    onClick={() => navigate(-1)}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Detail Belanja Desa
                  </h1>
                </div>
                <div className="flex items-center gap-4">
                  <Select
                    value={selectedYear.toString()}
                    onValueChange={(value) => {
                      setSelectedYear(parseInt(value));
                      setCurrentPage({
                        "Belanja Barang": 1,
                        "Belanja Modal": 1,
                        "Belanja Tak Terduga": 1,
                      });
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Pilih Tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-lg transition-colors hover:bg-blue-700 hover:shadow-xl"
                    onClick={() => navigate("/admin/belanja/tambah")}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Tambah Belanja
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-6">
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-100">
                      Total Belanja
                    </p>
                    <p className="text-2xl font-bold">
                      {formatRupiah(getGrandTotal())}
                    </p>
                  </div>
                  <div className="bg-opacity-30 rounded-lg bg-blue-400 p-3">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tables */}
            <div className="space-y-8">
              {kategoris.map((kategori) => {
                const data = filterBelanjaByKategori(kategori);
                return (
                  <div
                    key={kategori}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                  >
                    <div className="p-6">
                      {renderBelanjaTable(data, kategori)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
