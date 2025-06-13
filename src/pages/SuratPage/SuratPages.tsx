import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Eye,
  Plus,
  ChevronDown,
  ChevronUp,
  Search,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  AlertCircle,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "../../config/api";
import { Spinner } from "@/components/ui/spinner";

const frameworks = [
  { value: "SK_KEHILANGAN_KTP", label: "SK Kehilangan KTP" },
  { value: "SK_DOMISILI", label: "SK Domisili" },
  { value: "SK_KEMATIAN", label: "SK Kematian" },
  { value: "SK_USAHA", label: "SK Usaha" },
  { value: "KARTU_INDONESIA_PINTAR", label: "KIP" },
  { value: "SKTM", label: "SKTM" },
  { value: "SK_PINDAH", label: "SK Pindah" },
  { value: "SK_KELAHIRAN", label: "SK Kelahiran" },
];

interface Surat {
  id_surat: number;
  nomor_surat: string;
  jenis_surat: string;
  tanggal_pengajuan: string;
  tanggal_disetujui: string | null;
  nik_pemohon: string;
  keperluan: string;
  status_surat: string;
}

interface SuratResponse {
  data: Surat[];
}

type StatusFilter = "Semua" | "Disetujui" | "Diajukan" | "Ditolak";

const statusOptions = [
  {
    value: "Semua",
    label: "Semua",
    color: "bg-gray-100 text-gray-800",
    icon: FileText,
  },
  {
    value: "Disetujui",
    label: "Disetujui",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
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
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
      active
        ? "scale-105 bg-blue-600 text-white shadow-lg"
        : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`}
  >
    {children}
    {count !== undefined && (
      <span
        className={`rounded-full px-2 py-0.5 text-xs ${
          active ? "bg-blue-500" : "bg-gray-100 text-gray-600"
        }`}
      >
        {count}
      </span>
    )}
  </button>
);

export default function SuratPages() {
  const navigate = useNavigate();
  const [suratList, setSuratList] = useState<Surat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Semua");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [jenisSuratFilter, setJenisSuratFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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
    const fetchSuratData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Token tidak ditemukan");
        const response = await axios.get<SuratResponse>(
          `${API_CONFIG.baseURL}/api/surat`,
          {
            headers: {
              ...API_CONFIG.headers,
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setSuratList(response.data.data);
      } catch (err) {
        console.error("Error fetching surat data:", err);
        setError("Gagal mengambil data surat");
      } finally {
        setLoading(false);
      }
    };
    fetchSuratData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, jenisSuratFilter, searchTerm]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Disetujui":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Diajukan":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "Ditolak":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disetujui":
        return "bg-green-50 text-green-700 border-green-200";
      case "Diajukan":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Ditolak":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const filteredSuratList = suratList.filter((surat) => {
    const statusMatch =
      statusFilter === "Semua" || surat.status_surat === statusFilter;
    const jenisMatch =
      jenisSuratFilter === "" || surat.jenis_surat === jenisSuratFilter;
    const searchMatch =
      searchTerm === "" ||
      (surat.nomor_surat?.toLowerCase() || "").includes(
        searchTerm.toLowerCase(),
      ) ||
      (surat.nik_pemohon || "").includes(searchTerm) ||
      (surat.keperluan?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    return statusMatch && jenisMatch && searchMatch;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const isValidSortField = (
    field: string | null,
  ): field is "tanggal_pengajuan" | "tanggal_disetujui" => {
    return field === "tanggal_pengajuan" || field === "tanggal_disetujui";
  };

  const sortedSuratList = [...filteredSuratList].sort((a, b) => {
    if (!sortField || !isValidSortField(sortField)) return 0;

    if (sortField === "tanggal_pengajuan") {
      const dateA = new Date(a.tanggal_pengajuan).getTime();
      const dateB = new Date(b.tanggal_pengajuan).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }

    if (sortField === "tanggal_disetujui") {
      if (!a.tanggal_disetujui && !b.tanggal_disetujui) return 0;
      if (!a.tanggal_disetujui) return sortDirection === "asc" ? 1 : -1;
      if (!b.tanggal_disetujui) return sortDirection === "asc" ? -1 : 1;
      const dateA = new Date(a.tanggal_disetujui).getTime();
      const dateB = new Date(b.tanggal_disetujui).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }

    return 0;
  });

  const handleDownloadPdf = async (nik_pemohon: string, id_surat: number) => {
    try {
      const pdfUrl = `${API_CONFIG.baseURL}/api/publik/surat/${nik_pemohon}/${id_surat}/pdf`;
      const response = await fetch(pdfUrl, {
        headers: {
          ...API_CONFIG.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`Gagal mengunduh PDF. Status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `surat_${nik_pemohon}_${id_surat}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading PDF:", err);
    }
  };

  const totalSurat = suratList.length;
  const totalDiajukan = suratList.filter(
    (s) => s.status_surat === "Diajukan",
  ).length;
  const totalDisetujui = suratList.filter(
    (s) => s.status_surat === "Disetujui",
  ).length;

  const totalPages = Math.ceil(filteredSuratList.length / itemsPerPage);

  const paginatedSuratList = sortedSuratList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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
                  Manajemen Surat
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Kelola dan pantau status surat keterangan
                </p>
              </div>
              <Button
                onClick={() => navigate("/surat/buat")}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-lg transition-colors hover:bg-blue-700 hover:shadow-xl"
              >
                <Plus className="h-5 w-5" />
                Buat Surat
              </Button>
            </div>
          </div>

          <div className="p-6">
            {/* Stats Cards & Card Filter */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <StatCard
                title="Total Surat"
                value={totalSurat}
                icon={FileText}
                color="bg-blue-100 text-blue-600"
                trend={true}
              />
              <StatCard
                title="Surat Diajukan"
                value={totalDiajukan}
                icon={Clock}
                color="bg-yellow-100 text-yellow-600"
              />
              <StatCard
                title="Surat Disetujui"
                value={totalDisetujui}
                icon={CheckCircle}
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
                      ? totalSurat
                      : status.value === "Disetujui"
                        ? totalDisetujui
                        : status.value === "Diajukan"
                          ? totalDiajukan
                          : totalSurat - totalDisetujui - totalDiajukan;
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
                    placeholder="Cari nomor surat, NIK, atau keperluan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-3 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={jenisSuratFilter}
                    onChange={(e) => setJenisSuratFilter(e.target.value)}
                    className="min-w-[150px] rounded-lg border border-gray-200 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Semua Jenis Surat</option>
                    {frameworks.map((framework) => (
                      <option key={framework.value} value={framework.value}>
                        {framework.label}
                      </option>
                    ))}
                  </select>

                  {jenisSuratFilter && (
                    <button
                      onClick={() => setJenisSuratFilter("")}
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
                          No. Surat
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Jenis Surat
                        </th>
                        <th
                          className="max-w-[110px] min-w-[90px] cursor-pointer px-1 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase transition-colors hover:bg-gray-100"
                          onClick={() => handleSort("tanggal_pengajuan")}
                        >
                          <div className="flex items-center gap-1">
                            Tgl Pengajuan
                            {sortField === "tanggal_pengajuan" &&
                              (sortDirection === "asc" ? (
                                <ChevronUp className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5" />
                              ))}
                          </div>
                        </th>
                        <th
                          className="max-w-[110px] min-w-[90px] cursor-pointer px-1 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase transition-colors hover:bg-gray-100"
                          onClick={() => handleSort("tanggal_disetujui")}
                        >
                          <div className="flex items-center gap-1">
                            Tgl Disetujui
                            {sortField === "tanggal_disetujui" &&
                              (sortDirection === "asc" ? (
                                <ChevronUp className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5" />
                              ))}
                          </div>
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          NIK Pemohon
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Keperluan
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
                      {paginatedSuratList.map((surat) => (
                        <tr
                          key={surat.id_surat}
                          className="transition-colors hover:bg-gray-50"
                        >
                          <td className="max-w-[120px] px-3 py-2 text-xs font-medium whitespace-nowrap text-gray-900">
                            <div className="truncate" title={surat.nomor_surat}>
                              {surat.nomor_surat}
                            </div>
                          </td>
                          <td className="max-w-[220px] px-3 py-2 text-xs whitespace-nowrap text-gray-900">
                            <div
                              className="truncate"
                              title={
                                frameworks.find(
                                  (f) => f.value === surat.jenis_surat,
                                )?.label || surat.jenis_surat.replace(/_/g, " ")
                              }
                            >
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                                <FileText className="h-3 w-3" />
                                {frameworks.find(
                                  (f) => f.value === surat.jenis_surat,
                                )?.label ||
                                  surat.jenis_surat.replace(/_/g, " ")}
                              </span>
                            </div>
                          </td>
                          <td className="max-w-[110px] min-w-[90px] px-1 py-2 text-xs whitespace-nowrap text-gray-900">
                            {formatDate(surat.tanggal_pengajuan)}
                          </td>
                          <td className="max-w-[110px] min-w-[90px] px-1 py-2 text-xs whitespace-nowrap text-gray-900">
                            {surat.tanggal_disetujui
                              ? formatDate(surat.tanggal_disetujui)
                              : "-"}
                          </td>
                          <td className="px-3 py-2 font-mono text-xs whitespace-nowrap text-gray-900">
                            {surat.nik_pemohon}
                          </td>
                          <td className="max-w-[200px] px-3 py-2 text-xs text-gray-900">
                            <div className="truncate" title={surat.keperluan}>
                              {surat.keperluan}
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusColor(surat.status_surat)}`}
                            >
                              {getStatusIcon(surat.status_surat)}
                              {surat.status_surat}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs font-medium whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() =>
                                  navigate(`/surat/${surat.id_surat}`)
                                }
                                className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                              >
                                <Eye className="h-3 w-3" />
                                Detail
                              </button>
                              {surat.status_surat === "Disetujui" && (
                                <button
                                  onClick={() =>
                                    handleDownloadPdf(
                                      surat.nik_pemohon,
                                      surat.id_surat,
                                    )
                                  }
                                  className="inline-flex items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                                >
                                  <Download className="h-3 w-3" />
                                  PDF
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {sortedSuratList.length === 0 && (
                    <div className="py-12 text-center">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        Tidak ada data
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Tidak ditemukan surat yang sesuai dengan filter yang
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
                          filteredSuratList.length,
                        )}
                      </span>{" "}
                      dari{" "}
                      <span className="font-medium">
                        {filteredSuratList.length}
                      </span>{" "}
                      surat
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
