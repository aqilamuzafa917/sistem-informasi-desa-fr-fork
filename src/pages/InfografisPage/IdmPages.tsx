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
  TrendingUp,
  Landmark,
  Banknote,
  PiggyBank,
  Plus,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface IDMVariable {
  id: number;
  indikator_idm: string;
  skor: number;
  keterangan: string;
  kegiatan: string;
  nilai_plus: number;
  pelaksana: string[];
  kategori: string;
  tahun: number;
  created_at: string;
  updated_at: string;
}

interface IDMResponse {
  idm: {
    id: number;
    tahun: number;
    skor_idm: number;
    status_idm: string;
    target_status: string;
    skor_minimal: number;
    penambahan: number;
    komponen: {
      skorIKE: number;
      skorIKS: number;
      skorIKL: number;
    };
    created_at: string;
    updated_at: string;
  };
  variabel_ike: IDMVariable[];
  variabel_iks: IDMVariable[];
  variabel_ikl: IDMVariable[];
}

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
        <p className="text-3xl font-bold text-gray-900">{value.toFixed(4)}</p>
      </div>
      <div className={`rounded-full p-3 ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </div>
);

export default function IDMPages() {
  const navigate = useNavigate();
  const [idmData, setIdmData] = useState<IDMResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<{ [key: string]: number }>({
    IKS: 1,
    IKE: 1,
    IKL: 1,
  });

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedYear) return;
      setIsLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Token tidak ditemukan. Silakan login kembali.");
          setIsLoading(false);
          navigate("/");
          return;
        }
        const response = await axios.get<IDMResponse>(
          `${API_CONFIG.baseURL}/api/publik/idm/${selectedYear}`,
          { headers: { ...API_CONFIG.headers } },
        );
        setIdmData(response.data);
        setError(null); // Reset error jika data berhasil diambil
      } catch {
        setError("Gagal mengambil data IDM. Data Belum Tersedia.");
        setIdmData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedYear, navigate]);

  // Fetch daftar tahun yang tersedia dari API
  useEffect(() => {
    const fetchAvailableYears = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Token tidak ditemukan. Silakan login kembali.");
          navigate("/");
          return;
        }

        // Range tahun yang ingin dicek (dinamis, 2 tahun sebelum tahun sekarang)
        const currentYear = new Date().getFullYear();
        const minYear = currentYear - 2;
        const yearsToCheck = [];
        for (let y = minYear; y <= currentYear; y++) {
          yearsToCheck.push(y);
        }
        const foundYears: number[] = [];
        for (const year of yearsToCheck) {
          try {
            const response = await axios.get<IDMResponse>(
              `${API_CONFIG.baseURL}/api/publik/idm/${year}`,
              { headers: { ...API_CONFIG.headers } },
            );
            if (
              response.data &&
              ((response.data.variabel_ike &&
                response.data.variabel_ike.length > 0) ||
                (response.data.variabel_iks &&
                  response.data.variabel_iks.length > 0) ||
                (response.data.variabel_ikl &&
                  response.data.variabel_ikl.length > 0))
            ) {
              foundYears.push(year);
            }
          } catch (e) {
            console.log("Tahun", year, "tidak ada data atau error:", e);
            // Abaikan error, lanjut ke tahun berikutnya
          }
        }
        foundYears.sort((a, b) => b - a); // Urutkan dari terbaru
        setAvailableYears(foundYears);
        if (foundYears.length > 0) {
          setSelectedYear(foundYears[0]);
        }
      } catch {
        setError("Gagal mengambil data tahun yang tersedia.");
      }
    };

    fetchAvailableYears();
  }, [navigate]);

  const filterIDMByKategori = (kategori: string) => {
    if (!idmData) return [];
    const key = `variabel_${kategori.toLowerCase()}` as keyof typeof idmData;
    return (idmData[key] as IDMVariable[]) || [];
  };

  const getPaginatedData = (data: IDMVariable[], kategori: string) => {
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

  const getTotalScoreByKategori = (kategori: string) => {
    if (!idmData) return 0;
    switch (kategori) {
      case "IKS":
        return idmData.idm.komponen.skorIKS;
      case "IKE":
        return idmData.idm.komponen.skorIKE;
      case "IKL":
        return idmData.idm.komponen.skorIKL;
      default:
        return 0;
    }
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

  const renderIDMTable = (data: IDMVariable[], kategori: string) => {
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
          <p className="text-lg font-medium">Tidak ada data IDM</p>
          <p className="text-sm">Belum ada data IDM untuk kategori ini</p>
        </div>
      );
    }

    const paginatedData = getPaginatedData(data, kategori);
    const total = getTotalScoreByKategori(kategori);

    return (
      <div className="space-y-4">
        {/* Summary Card */}
        <div
          className={`rounded-xl border p-4 ${
            kategori === "IKS"
              ? "border-green-100 bg-gradient-to-r from-green-50 to-emerald-50"
              : kategori === "IKE"
                ? "border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50"
                : "border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`rounded-lg p-2 ${
                  kategori === "IKS"
                    ? "bg-green-100"
                    : kategori === "IKE"
                      ? "bg-purple-100"
                      : "bg-orange-100"
                }`}
              >
                {kategori === "IKS" ? (
                  <Landmark className="h-5 w-5 text-green-600" />
                ) : kategori === "IKE" ? (
                  <Banknote className="h-5 w-5 text-purple-600" />
                ) : (
                  <PiggyBank className="h-5 w-5 text-orange-600" />
                )}
              </div>
              <div>
                <p
                  className={`text-sm font-medium ${
                    kategori === "IKS"
                      ? "text-green-900"
                      : kategori === "IKE"
                        ? "text-purple-900"
                        : "text-orange-900"
                  }`}
                >
                  Total {kategori}
                </p>
                <p
                  className={`text-2xl font-bold ${
                    kategori === "IKS"
                      ? "text-green-700"
                      : kategori === "IKE"
                        ? "text-purple-700"
                        : "text-orange-700"
                  }`}
                >
                  {total.toFixed(4)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-sm ${
                  kategori === "IKS"
                    ? "text-green-600"
                    : kategori === "IKE"
                      ? "text-purple-600"
                      : "text-orange-600"
                }`}
              >
                {data.length} indikator
              </p>
              <p
                className={`text-xs ${
                  kategori === "IKS"
                    ? "text-green-500"
                    : kategori === "IKE"
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
                  <TableHead>Indikator</TableHead>
                  <TableHead>Skor</TableHead>
                  <TableHead>Nilai Plus</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead>Kegiatan</TableHead>
                  <TableHead>Pelaksana</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <span className="font-medium">{item.indikator_idm}</span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        {Math.round(item.skor)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        {item.nilai_plus.toFixed(4)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="truncate">{item.keterangan}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="truncate">{item.kegiatan}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.pelaksana.map((p, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
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

  const kategoris = ["IKS", "IKE", "IKL"];

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 items-center justify-center p-4">
            <Spinner size="xl" text="Memuat data..." />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Indeks Desa Membangun (IDM)
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Pantau dan kelola data Indeks Desa Membangun
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Select
                  value={selectedYear?.toString() || ""}
                  onValueChange={(value) => {
                    setSelectedYear(value ? parseInt(value) : null);
                    setCurrentPage({ IKS: 1, IKE: 1, IKL: 1 });
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
                  onClick={() => navigate("/admin/idm/tambah")}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-lg transition-colors hover:bg-blue-700 hover:shadow-xl"
                >
                  <Plus className="h-5 w-5" />
                  Tambah IDM
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4 p-6 pt-0">
            {/* Summary Cards */}
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-4">
              <StatCard
                title="Skor IDM"
                value={idmData?.idm.skor_idm || 0}
                icon={TrendingUp}
                color="bg-blue-100 text-blue-600"
              />
              <StatCard
                title="Skor IKS"
                value={idmData?.idm.komponen.skorIKS || 0}
                icon={Landmark}
                color="bg-green-100 text-green-600"
              />
              <StatCard
                title="Skor IKE"
                value={idmData?.idm.komponen.skorIKE || 0}
                icon={Banknote}
                color="bg-purple-100 text-purple-600"
              />
              <StatCard
                title="Skor IKL"
                value={idmData?.idm.komponen.skorIKL || 0}
                icon={PiggyBank}
                color="bg-orange-100 text-orange-600"
              />
            </div>

            {/* Tables */}
            <div className="space-y-8">
              {kategoris.map((kategori) => {
                const data = filterIDMByKategori(kategori);
                return (
                  <div
                    key={kategori}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                  >
                    <div className="p-6">{renderIDMTable(data, kategori)}</div>
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
