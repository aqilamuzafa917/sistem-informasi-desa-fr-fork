import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Spinner } from "flowbite-react"; // For loading indicator

interface PendudukDetail {
  created_at: string;
  updated_at: string;
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
}

export default function DetailKtpPages() {
  const { nik } = useParams<{ nik: string }>();
  const navigate = useNavigate();
  const [penduduk, setPenduduk] = useState<PendudukDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = useCallback(
    (dateString: string | null, includeTime: boolean = false) => {
      if (!dateString) return "-";
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "long",
        year: "numeric",
      };
      if (includeTime) {
        options.hour = "2-digit";
        options.minute = "2-digit";
        options.second = "2-digit";
      }
      if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
        const parts = dateString.split("-");
        if (parts.length === 3) {
          const parsedDate = new Date(
            parseInt(parts[2]),
            parseInt(parts[1]) - 1,
            parseInt(parts[0]),
          );
          return parsedDate.toLocaleDateString("id-ID", options);
        }
      }
      return date.toLocaleDateString("id-ID", options);
    },
    [],
  );

  useEffect(() => {
    const fetchDetailKtp = async () => {
      if (!nik) {
        setError("NIK tidak ditemukan di URL.");
        setLoading(false);
        return;
      }
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
        const response = await axios.get<PendudukDetail[]>(
          `https://thankful-urgently-silkworm.ngrok-free.app/api/penduduk/cari?query=${nik}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "69420",
            },
          },
        );

        if (Array.isArray(response.data) && response.data.length > 0) {
          setPenduduk(response.data[0]); // Use the first item in the array
        } else if (Array.isArray(response.data) && response.data.length === 0) {
          setError("Data penduduk dengan NIK tersebut tidak ditemukan.");
        } else {
          console.error("Unexpected response structure:", response.data);
          setError(
            "Struktur data dari API tidak sesuai. Diharapkan sebuah array.",
          );
        }
      } catch (err) {
        console.error("Error fetching KTP detail:", err);
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            setError("Sesi Anda telah berakhir. Silakan login kembali.");
            navigate("/");
          } else if (err.response?.status === 404) {
            // This might still be relevant if the /cari endpoint itself returns 404 for no results instead of an empty array
            setError("Data penduduk tidak ditemukan (API 404).");
          } else {
            setError("Gagal mengambil detail data KTP.");
          }
        } else {
          setError("Terjadi kesalahan yang tidak diketahui.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetailKtp();
  }, [nik, navigate, formatDate]); // Added formatDate to dependencies as it's used inside

  const detailItems = penduduk
    ? [
        { label: "NIK", value: penduduk.nik },
        { label: "Nama Lengkap", value: penduduk.nama },
        { label: "Tempat Lahir", value: penduduk.tempat_lahir },
        { label: "Tanggal Lahir", value: formatDate(penduduk.tanggal_lahir) },
        { label: "Jenis Kelamin", value: penduduk.jenis_kelamin },
        {
          label: "Alamat",
          value: `${penduduk.alamat}, RT ${penduduk.rt} RW ${penduduk.rw}`,
        },
        { label: "Desa/Kelurahan", value: penduduk.desa_kelurahan },
        { label: "Kecamatan", value: penduduk.kecamatan },
        { label: "Kabupaten/Kota", value: penduduk.kabupaten_kota },
        { label: "Provinsi", value: penduduk.provinsi },
        { label: "Kode Pos", value: penduduk.kode_pos },
        { label: "Agama", value: penduduk.agama },
        { label: "Status Perkawinan", value: penduduk.status_perkawinan },
        { label: "Pekerjaan", value: penduduk.pekerjaan },
        { label: "Kewarganegaraan", value: penduduk.kewarganegaraan },
        { label: "Data Dibuat", value: formatDate(penduduk.created_at, true) },
        {
          label: "Data Diperbarui",
          value: formatDate(penduduk.updated_at, true),
        },
      ]
    : [];

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
                  <BreadcrumbLink onClick={() => navigate("/dataktp")}>
                    Data KTP
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Detail Data KTP</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Button
            variant="outline"
            onClick={() => navigate("/dataktp")}
            className="mb-4 w-fit"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>

          {loading && (
            <div className="flex justify-center py-10">
              <Spinner size="xl" />
            </div>
          )}
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-center text-red-700">
              {error}
            </div>
          )}

          {penduduk && !loading && !error && (
            <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Detail Informasi Penduduk
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Rincian data pribadi penduduk.
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  {detailItems.map((item) => (
                    <div
                      key={item.label}
                      className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-4"
                    >
                      <dt className="text-sm font-medium text-gray-500">
                        {item.label}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
