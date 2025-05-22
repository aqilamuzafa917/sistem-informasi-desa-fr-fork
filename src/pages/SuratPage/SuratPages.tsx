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

export default function SuratPages() {
  const navigate = useNavigate();
  const [suratList, setSuratList] = useState<Surat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Semua");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [open, setOpen] = React.useState(false);
  const [jenisSuratFilter, setJenisSuratFilter] = React.useState("");

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
          "https://thankful-urgently-silkworm.ngrok-free.app/api/surat",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "69420",
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

  const filteredSuratList = suratList.filter((surat) => {
    const statusMatch =
      statusFilter === "Semua" || surat.status_surat === statusFilter;
    const jenisMatch =
      jenisSuratFilter === "" || surat.jenis_surat === jenisSuratFilter;
    return statusMatch && jenisMatch;
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

  const sortedSuratList = [...filteredSuratList].sort((a, b) => {
    if (!sortField) return 0;

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
                <BreadcrumbPage>Surat</BreadcrumbPage>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="mb-0 flex justify-end">
            <Button className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
              Buat Surat
            </Button>
          </div>
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-gray-200 p-4">
              <p className="font-medium text-gray-700">Total Surat</p>
              <p className="mt-2 text-center text-4xl font-bold">
                {suratList.length}
              </p>
            </div>
            <div className="rounded-xl bg-gray-200 p-4">
              <p className="font-medium text-gray-700">SK Belum Verifikasi</p>
              <p className="mt-2 text-center text-4xl font-bold">
                {
                  suratList.filter((surat) => surat.status_surat === "Diajukan")
                    .length
                }
              </p>
            </div>
            <div className="rounded-xl bg-gray-200 p-4">
              <p className="font-medium text-gray-700">Total Disetujui</p>
              <p className="mt-2 text-center text-4xl font-bold">
                {
                  suratList.filter(
                    (surat) => surat.status_surat === "Disetujui",
                  ).length
                }
              </p>
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex justify-center">
              <div className="flex overflow-hidden rounded-full bg-gray-200">
                {(
                  [
                    "Semua",
                    "Disetujui",
                    "Diajukan",
                    "Ditolak",
                  ] as StatusFilter[]
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
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                  >
                    {jenisSuratFilter
                      ? frameworks.find((f) => f.value === jenisSuratFilter)
                          ?.label
                      : "Pilih Jenis Surat"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Cari Jenis Surat" />
                    <CommandList>
                      <CommandEmpty>Jenis tidak ditemukan</CommandEmpty>
                      <CommandGroup>
                        {frameworks.map((f) => (
                          <CommandItem
                            key={f.value}
                            value={f.value}
                            onSelect={(val) => {
                              setJenisSuratFilter(
                                val === jenisSuratFilter ? "" : val,
                              );
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                jenisSuratFilter === f.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {f.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {jenisSuratFilter && (
                <Button
                  variant="outline"
                  onClick={() => setJenisSuratFilter("")}
                >
                  Reset Jenis Surat
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
                    <TableHeadCell>No. Surat</TableHeadCell>
                    <TableHeadCell>Jenis Surat</TableHeadCell>
                    <TableHeadCell
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("tanggal_pengajuan")}
                    >
                      <div className="flex items-center justify-between">
                        <span>Tanggal Pengajuan</span>
                        {sortField === "tanggal_pengajuan" &&
                          (sortDirection === "asc" ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronUp className="h-5 w-5" />
                          ))}
                      </div>
                    </TableHeadCell>
                    <TableHeadCell
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("tanggal_disetujui")}
                    >
                      <div className="flex items-center justify-between">
                        <span>Tanggal Disetujui</span>
                        {sortField === "tanggal_disetujui" &&
                          (sortDirection === "asc" ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronUp className="h-5 w-5" />
                          ))}
                      </div>
                    </TableHeadCell>
                    <TableHeadCell>NIK Pemohon</TableHeadCell>
                    <TableHeadCell>Keperluan</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell>Aksi</TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedSuratList.map((surat) => (
                    <TableRow key={surat.id_surat}>
                      <TableCell>{surat.nomor_surat}</TableCell>
                      <TableCell>{surat.jenis_surat}</TableCell>
                      <TableCell>
                        {formatDate(surat.tanggal_pengajuan)}
                      </TableCell>
                      <TableCell>
                        {surat.tanggal_disetujui
                          ? formatDate(surat.tanggal_disetujui)
                          : "-"}
                      </TableCell>
                      <TableCell>{surat.nik_pemohon}</TableCell>
                      <TableCell>{surat.keperluan}</TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            surat.status_surat === "Disetujui"
                              ? "bg-green-100 text-green-800"
                              : surat.status_surat === "Ditolak"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {surat.status_surat}
                        </span>
                      </TableCell>
                      <TableCell>
                        <ButtonFlowbite
                          size="xs"
                          color="info"
                          className="flex items-center gap-1"
                          onClick={() => navigate(`/surat/${surat.id_surat}`)}
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
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
