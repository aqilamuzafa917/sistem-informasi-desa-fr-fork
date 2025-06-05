import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
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
import { useState, useEffect } from "react";
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

interface PengaduanResponse {
  data: Pengaduan[];
}

interface StatsResponse {
  total_pengaduan: number;
  total_diajukan: number;
  total_diterima: number;
  total_ditolak: number;
}

type StatusFilter = "Semua" | "Diterima" | "Diajukan" | "Ditolak";

export default function PengaduanPages() {
  const navigate = useNavigate();
  const [pengaduanList, setPengaduanList] = useState<Pengaduan[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Semua");
  const [sortField, setSortField] = useState<string | null>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [open, setOpen] = React.useState(false);
  const [kategoriFilter, setKategoriFilter] = React.useState("");

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

        const [pengaduanResponse, statsResponse] = await Promise.all([
          axios.get<PengaduanResponse>(
            "https://thankful-urgently-silkworm.ngrok-free.app/api/pengaduan",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "ngrok-skip-browser-warning": "69420",
              },
            },
          ),
          axios.get<StatsResponse>(
            "https://thankful-urgently-silkworm.ngrok-free.app/api/pengaduan/stats",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "ngrok-skip-browser-warning": "69420",
              },
            },
          ),
        ]);

        setPengaduanList(
          Array.isArray(pengaduanResponse.data)
            ? pengaduanResponse.data
            : pengaduanResponse.data.data || [],
        );
        setStats(statsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal mengambil data pengaduan");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPengaduanList = pengaduanList.filter((pengaduan) => {
    const statusMatch =
      statusFilter === "Semua" || pengaduan.status === statusFilter;
    const kategoriMatch =
      kategoriFilter === "" || pengaduan.kategori === kategoriFilter;
    return statusMatch && kategoriMatch;
  });

  const handleStatusFilterClick = (status: StatusFilter) => {
    setStatusFilter(status);
  };

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

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbPage>Pengaduan Warga</BreadcrumbPage>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-gray-200 p-4">
              <p className="font-medium text-gray-700">Total Pengaduan</p>
              <p className="mt-2 text-center text-4xl font-bold">
                {stats?.total_pengaduan || 0}
              </p>
            </div>
            <div className="rounded-xl bg-gray-200 p-4">
              <p className="font-medium text-gray-700">Pengaduan Diajukan</p>
              <p className="mt-2 text-center text-4xl font-bold">
                {stats?.total_diajukan || 0}
              </p>
            </div>
            <div className="rounded-xl bg-gray-200 p-4">
              <p className="font-medium text-gray-700">Pengaduan Diterima</p>
              <p className="mt-2 text-center text-4xl font-bold">
                {stats?.total_diterima || 0}
              </p>
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex justify-center">
              <div className="flex overflow-hidden rounded-full bg-gray-200">
                {(
                  ["Semua", "Diterima", "Diajukan", "Ditolak"] as StatusFilter[]
                ).map((status) => (
                  <div
                    key={status}
                    className={`cursor-pointer px-4 py-2 font-medium ${
                      statusFilter === status
                        ? "bg-gray-300"
                        : "hover:bg-gray-300"
                    }`}
                    onClick={() => handleStatusFilterClick(status)}
                  >
                    {status}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                  >
                    {kategoriFilter
                      ? kategoriOptions.find((k) => k.value === kategoriFilter)
                          ?.label
                      : "Pilih Jenis Pengaduan"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Cari Jenis Pengaduan" />
                    <CommandList>
                      <CommandEmpty>Jenis tidak ditemukan</CommandEmpty>
                      <CommandGroup>
                        {kategoriOptions.map((k) => (
                          <CommandItem
                            key={k.value}
                            value={k.value}
                            onSelect={(val) => {
                              setKategoriFilter(
                                val === kategoriFilter ? "" : val,
                              );
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                kategoriFilter === k.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {k.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {kategoriFilter && (
                <Button variant="outline" onClick={() => setKategoriFilter("")}>
                  Reset Jenis Pengaduan
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
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <Table striped>
                <TableHead>
                  <TableRow>
                    <TableHeadCell>ID</TableHeadCell>
                    <TableHeadCell>Nama</TableHeadCell>
                    <TableHeadCell>Nomor Telepon</TableHeadCell>
                    <TableHeadCell>Kategori</TableHeadCell>
                    <TableHeadCell
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("created_at")}
                    >
                      <div className="flex items-center justify-between">
                        <span>Tanggal Pengaduan</span>
                        {sortField === "created_at" &&
                          (sortDirection === "asc" ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronUp className="h-5 w-5" />
                          ))}
                      </div>
                    </TableHeadCell>
                    <TableHeadCell>Detail Pengaduan</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell>Aksi</TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedPengaduanList.map((pengaduan) => (
                    <TableRow key={pengaduan.id}>
                      <TableCell>{pengaduan.id}</TableCell>
                      <TableCell>{pengaduan.nama}</TableCell>
                      <TableCell>{pengaduan.nomor_telepon}</TableCell>
                      <TableCell>{pengaduan.kategori}</TableCell>
                      <TableCell>{formatDate(pengaduan.created_at)}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {pengaduan.detail_pengaduan}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            pengaduan.status === "Diterima"
                              ? "bg-green-100 text-green-800"
                              : pengaduan.status === "Ditolak"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {pengaduan.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <ButtonFlowbite
                            size="xs"
                            color="info"
                            className="flex items-center gap-1"
                            onClick={() =>
                              navigate(`/pengaduan/${pengaduan.id}`)
                            }
                          >
                            <Eye className="h-4 w-4" />
                            <span>Detail</span>
                          </ButtonFlowbite>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
