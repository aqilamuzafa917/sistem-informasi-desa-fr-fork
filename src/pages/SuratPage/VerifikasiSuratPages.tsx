import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ChevronLeft,
  FileText,
  Calendar,
  User,
  MapPin,
  Clock,
  Eye,
  Check,
  LucideIcon,
} from "lucide-react";
import { API_CONFIG } from "../../config/api";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { toast } from "sonner";

// Helper function to format date strings
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString;
  }
};

// Interface untuk semua kemungkinan field dari response surat
interface Surat {
  id_surat: number;
  nomor_surat: string | null;
  jenis_surat: string;
  tanggal_pengajuan: string | null;
  tanggal_disetujui: string | null;
  nik_pemohon: string | null;
  keperluan: string | null;
  status_surat: string | null;
  catatan: string | null;
  created_at: string | null;
  updated_at: string | null;
  attachment_bukti_pendukung: string | null;
  nik_penduduk_meninggal: string | null;
  alamat_terakhir_meninggal: string | null;
  tanggal_kematian: string | null;
  waktu_kematian: string | null;
  tempat_kematian: string | null;
  penyebab_kematian: string | null;
  hubungan_pelapor_kematian: string | null;
  alamat_tujuan: string | null;
  rt_tujuan: string | null;
  rw_tujuan: string | null;
  kelurahan_desa_tujuan: string | null;
  kecamatan_tujuan: string | null;
  kabupaten_kota_tujuan: string | null;
  provinsi_tujuan: string | null;
  alasan_pindah: string | null;
  klasifikasi_pindah: string | null;
  data_pengikut_pindah?: Array<{ nik: string }> | null;
  nama_bayi: string | null;
  tempat_dilahirkan: string | null;
  tempat_kelahiran: string | null;
  tanggal_lahir_bayi: string | null;
  waktu_lahir_bayi: string | null;
  jenis_kelamin_bayi: string | null;
  jenis_kelahiran: string | null;
  anak_ke: string | null;
  penolong_kelahiran: string | null;
  berat_bayi_kg: string | null;
  panjang_bayi_cm: string | null;
  nik_penduduk_ibu: string | null;
  nik_penduduk_ayah: string | null;
  nik_penduduk_pelapor_lahir: string | null;
  hubungan_pelapor_lahir: string | null;
  nama_usaha: string | null;
  jenis_usaha: string | null;
  alamat_usaha: string | null;
  status_bangunan_usaha: string | null;
  perkiraan_modal_usaha: string | null;
  perkiraan_pendapatan_usaha: string | null;
  jumlah_tenaga_kerja: string | null;
  sejak_tanggal_usaha: string | null;
  penghasilan_perbulan_kepala_keluarga: string | null;
  pekerjaan_kepala_keluarga: string | null;
  nik_penduduk_siswa: string | null;
  nama_sekolah: string | null;
  nisn_siswa: string | null;
  kelas_siswa: string | null;
  nomor_ktp_hilang: string | null;
  tanggal_perkiraan_hilang: string | null;
  lokasi_perkiraan_hilang: string | null;
  kronologi_singkat: string | null;
  nomor_laporan_polisi: string | null;
  tanggal_laporan_polisi: string | null;
  deleted_at: string | null;
  nama_pemohon: string | null;
  tempat_lahir_pemohon: string | null;
  status_perkawinan_pemohon: string | null;
  tanggal_lahir_pemohon: string | null;
  jenis_kelamin_pemohon: string | null;
  alamat_pemohon: string | null;
  umur_pemohon: number | null;
  nama_meninggal: string | null;
  tempat_lahir_meninggal: string | null;
  tanggal_lahir_meninggal: string | null;
  jenis_kelamin_meninggal: string | null;
  umur_saat_meninggal: number | null;
  nik_meninggal: string | null;
  hari_kematian: string | null;
  nama_ibu: string | null;
  umur_ibu_saat_kelahiran: number | null;
  nama_ayah: string | null;
  umur_ayah_saat_kelahiran: number | null;
  nama_siswa: string | null;
  tempat_lahir_siswa: string | null;
  tanggal_lahir_siswa: string | null;
  jenis_kelamin_siswa: string | null;
  umur_siswa: number | null;
}

// Fungsi untuk mendapatkan label yang lebih user-friendly dari nama field
const getFieldLabel = (key: string): string => {
  const labels: Record<string, string> = {
    id_surat: "ID Surat",
    jenis_surat: "Jenis Surat",
    tanggal_pengajuan: "Tanggal Pengajuan",
    tanggal_disetujui: "Tanggal Disetujui",
    nik_pemohon: "NIK Pemohon",
    keperluan: "Keperluan",
    status_surat: "Status Surat",
    catatan: "Catatan",
    created_at: "Dibuat Pada",
    updated_at: "Diperbarui Pada",
    attachment_bukti_pendukung: "Bukti Pendukung",
    nik_penduduk_meninggal: "NIK Penduduk Meninggal",
    alamat_terakhir_meninggal: "Alamat Terakhir",
    tanggal_kematian: "Tanggal Kematian",
    waktu_kematian: "Waktu Kematian",
    tempat_kematian: "Tempat Kematian",
    penyebab_kematian: "Penyebab Kematian",
    hubungan_pelapor_kematian: "Hubungan Pelapor",
    alamat_tujuan: "Alamat Tujuan",
    rt_tujuan: "RT Tujuan",
    rw_tujuan: "RW Tujuan",
    kelurahan_desa_tujuan: "Kelurahan/Desa Tujuan",
    kecamatan_tujuan: "Kecamatan Tujuan",
    kabupaten_kota_tujuan: "Kabupaten/Kota Tujuan",
    provinsi_tujuan: "Provinsi Tujuan",
    alasan_pindah: "Alasan Pindah",
    klasifikasi_pindah: "Klasifikasi Pindah",
    data_pengikut_pindah: "Data Pengikut Pindah",
    nama_bayi: "Nama Bayi",
    tempat_dilahirkan: "Tempat Dilahirkan",
    tempat_kelahiran: "Tempat Kelahiran",
    tanggal_lahir_bayi: "Tanggal Lahir Bayi",
    waktu_lahir_bayi: "Waktu Lahir Bayi",
    jenis_kelamin_bayi: "Jenis Kelamin Bayi",
    jenis_kelahiran: "Jenis Kelahiran",
    anak_ke: "Anak Ke",
    penolong_kelahiran: "Penolong Kelahiran",
    berat_bayi_kg: "Berat Bayi (kg)",
    panjang_bayi_cm: "Panjang Bayi (cm)",
    nik_penduduk_ibu: "NIK Ibu",
    nik_penduduk_ayah: "NIK Ayah",
    nik_penduduk_pelapor_lahir: "NIK Pelapor Kelahiran",
    hubungan_pelapor_lahir: "Hubungan Pelapor Kelahiran",
    nama_usaha: "Nama Usaha",
    jenis_usaha: "Jenis Usaha",
    alamat_usaha: "Alamat Usaha",
    status_bangunan_usaha: "Status Bangunan Usaha",
    perkiraan_modal_usaha: "Perkiraan Modal Usaha",
    perkiraan_pendapatan_usaha: "Perkiraan Pendapatan Usaha",
    jumlah_tenaga_kerja: "Jumlah Tenaga Kerja",
    sejak_tanggal_usaha: "Sejak Tanggal",
    penghasilan_perbulan_kepala_keluarga:
      "Penghasilan Perbulan Kepala Keluarga",
    pekerjaan_kepala_keluarga: "Pekerjaan Kepala Keluarga",
    nik_penduduk_siswa: "NIK Siswa",
    nama_sekolah: "Nama Sekolah",
    nisn_siswa: "NISN Siswa",
    kelas_siswa: "Kelas Siswa",
    nomor_ktp_hilang: "Nomor KTP Hilang",
    tanggal_perkiraan_hilang: "Tanggal Perkiraan Hilang",
    lokasi_perkiraan_hilang: "Lokasi Perkiraan Hilang",
    kronologi_singkat: "Kronologi Singkat",
    nomor_laporan_polisi: "Nomor Laporan Polisi",
    tanggal_laporan_polisi: "Tanggal Laporan Polisi",
    nama_pemohon: "Nama Pemohon",
    tempat_lahir_pemohon: "Tempat Lahir Pemohon",
    status_perkawinan_pemohon: "Status Perkawinan Pemohon",
    tanggal_lahir_pemohon: "Tanggal Lahir Pemohon",
    jenis_kelamin_pemohon: "Jenis Kelamin Pemohon",
    alamat_pemohon: "Alamat Pemohon",
    umur_pemohon: "Umur Pemohon",
    nama_meninggal: "Nama Meninggal",
    tempat_lahir_meninggal: "Tempat Lahir",
    tanggal_lahir_meninggal: "Tanggal Lahir",
    jenis_kelamin_meninggal: "Jenis Kelamin",
    umur_saat_meninggal: "Umur Saat Meninggal",
    nik_meninggal: "NIK",
    hari_kematian: "Hari Kematian",
    nama_ibu: "Nama Ibu",
    umur_ibu_saat_kelahiran: "Umur Ibu Saat Kelahiran",
    nama_ayah: "Nama Ayah",
    umur_ayah_saat_kelahiran: "Umur Ayah Saat Kelahiran",
    nama_siswa: "Nama Siswa",
    tempat_lahir_siswa: "Tempat Lahir Siswa",
    tanggal_lahir_siswa: "Tanggal Lahir Siswa",
    jenis_kelamin_siswa: "Jenis Kelamin Siswa",
    umur_siswa: "Umur Siswa",
  };

  return (
    labels[key] ||
    key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
};

// Fungsi untuk mendapatkan terjemahan jenis surat
const getJenisSuratLabel = (jenisSurat: string): string => {
  const jenisSuratMap: Record<string, string> = {
    SK_KEHILANGAN_KTP: "Surat Keterangan Kehilangan KTP",
    SK_DOMISILI: "Surat Keterangan Domisili",
    SK_KEMATIAN: "Surat Keterangan Kematian",
    SK_USAHA: "Surat Keterangan Usaha",
    KARTU_INDONESIA_PINTAR: "Kartu Indonesia Pintar",
    SKTM: "Surat Keterangan Tidak Mampu",
    SK_PINDAH: "Surat Keterangan Pindah",
    SK_KELAHIRAN: "Surat Keterangan Kelahiran",
  };

  return jenisSuratMap[jenisSurat] || jenisSurat;
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    Diajukan: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: Clock,
      label: "Menunggu Verifikasi",
    },
    Disetujui: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: Check,
      label: "Disetujui",
    },
    Ditolak: {
      bg: "bg-red-100",
      text: "text-red-800",
      icon: Check,
      label: "Ditolak",
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.Diajukan;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${config.bg} ${config.text}`}
    >
      <Icon size={14} />
      {config.label}
    </span>
  );
};

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
}

const InfoCard = ({
  icon: Icon,
  label,
  value,
  className = "",
}: InfoCardProps) => (
  <div className={`rounded-lg bg-gray-50 p-4 ${className}`}>
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex-shrink-0">
        <Icon className="h-5 w-5 text-gray-600" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-sm font-medium text-gray-600">{label}</p>
        <p className="break-words text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

// Add type for field configuration
interface FieldConfig {
  key: keyof Surat;
  icon: LucideIcon;
  type?: "text" | "date" | "age";
}

// Update the field configurations with proper types
const personalInfo: FieldConfig[] = [
  { key: "nama_pemohon", icon: User },
  { key: "nik_pemohon", icon: FileText },
  { key: "tempat_lahir_pemohon", icon: MapPin },
  { key: "tanggal_lahir_pemohon", icon: Calendar, type: "date" },
  { key: "umur_pemohon", icon: User, type: "age" },
  { key: "jenis_kelamin_pemohon", icon: User },
  { key: "status_perkawinan_pemohon", icon: User },
  { key: "alamat_pemohon", icon: MapPin },
];

const renderFieldValue = (
  key: string,
  value: string | number | Array<{ nik: string }> | null,
): string => {
  if (key === "data_pengikut_pindah" && Array.isArray(value)) {
    return value
      .map((pengikut, index) => `NIK Pengikut ${index + 1}: ${pengikut.nik}`)
      .join("\n");
  }
  return String(value || "");
};

export default function VerifikasiSuratPages() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [surat, setSurat] = useState<Surat | null>(null);
  const [loading, setLoading] = useState(true);
  const [catatan, setCatatan] = useState("");
  const [status, setStatus] = useState("Diajukan");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSurat = async () => {
      try {
        const token =
          localStorage.getItem("token") || localStorage.getItem("authToken");
        const response = await axios.get(
          `${API_CONFIG.baseURL}/api/surat/${id}`,
          {
            headers: {
              ...API_CONFIG.headers,
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setSurat(response.data);
        setStatus(response.data.status_surat || "Diajukan");
        setCatatan(response.data.catatan || "");
      } catch (error) {
        console.error("Gagal mengambil data surat:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSurat();
    }
  }, [id]);

  const handleVerifikasi = async () => {
    try {
      setSubmitting(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      await axios.patch(
        `${API_CONFIG.baseURL}/api/surat/${id}/status`,
        {
          status_surat: status,
          catatan: catatan,
        },
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Surat berhasil diverifikasi!", {
        description: "Status surat telah diperbarui",
        duration: 2000,
      });
      setTimeout(() => {
        window.location.href = "/admin/surat";
      }, 2000);
    } catch (error) {
      console.error("Gagal memverifikasi surat:", error);
      if (axios.isAxiosError(error) && error.response?.data?.errors) {
        const errorMessages = Object.entries(error.response.data.errors)
          .map(
            ([field, messages]) =>
              `${field}: ${(messages as string[]).join(", ")}`,
          )
          .join("\n");
        toast.error("Gagal memverifikasi surat", {
          description: errorMessages,
        });
      } else {
        toast.error("Gagal memverifikasi surat", {
          description:
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan saat memverifikasi surat. Silakan coba lagi.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-64 items-center justify-center">
            <div>Loading...</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!surat) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-64 items-center justify-center">
            <div>Data surat tidak ditemukan.</div>
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
          <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate("/admin/surat")}
                    className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      Verifikasi Surat
                    </h1>
                    <p className="text-sm text-gray-500">
                      ID: {surat.id_surat}
                    </p>
                  </div>
                </div>
                <StatusBadge status={surat.status_surat || "Diajukan"} />
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Main Content */}
              <div className="space-y-6 lg:col-span-2">
                {/* Document Header */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <span className="mb-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                        {getJenisSuratLabel(surat.jenis_surat)}
                      </span>
                      <h2 className="mb-4 text-2xl font-bold text-gray-900">
                        {surat.nomor_surat || "Surat Baru"}
                      </h2>
                    </div>
                  </div>
                  {/* Document Meta */}
                  <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <InfoCard
                      icon={User}
                      label="Pemohon"
                      value={surat.nama_pemohon || "-"}
                    />
                    <InfoCard
                      icon={Calendar}
                      label="Tanggal Pengajuan"
                      value={formatDate(surat.tanggal_pengajuan)}
                    />
                    <InfoCard
                      icon={Clock}
                      label="Tanggal Disetujui"
                      value={formatDate(surat.tanggal_disetujui)}
                    />
                  </div>
                  {/* Document Content */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Detail Surat
                      </h3>
                    </div>
                    <div className="prose max-w-none">
                      <div className="rounded-lg bg-gray-50 p-6 leading-relaxed break-words whitespace-pre-wrap text-gray-700">
                        {surat.keperluan ||
                          "Tidak ada keperluan yang disebutkan"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Data Pemohon
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {personalInfo.map(({ key, icon }) => (
                      <InfoCard
                        key={key}
                        icon={icon}
                        label={getFieldLabel(key)}
                        value={renderFieldValue(key, surat[key] ?? null)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Verification Panel */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Panel Verifikasi
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Status Surat
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Diajukan">Menunggu Verifikasi</option>
                        <option value="Disetujui">Setujui Surat</option>
                        <option value="Ditolak">Tolak Surat</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Catatan Verifikasi
                      </label>
                      <textarea
                        value={catatan}
                        onChange={(e) => setCatatan(e.target.value)}
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        placeholder="Tambahkan catatan verifikasi..."
                      />
                    </div>
                    <div className="space-y-3 border-t border-gray-200 pt-4">
                      <button
                        onClick={handleVerifikasi}
                        disabled={submitting}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 font-medium text-white transition-all duration-200 hover:from-green-600 hover:to-green-700 disabled:from-green-300 disabled:to-green-400"
                      >
                        {submitting ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Memproses...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            Simpan Verifikasi
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Document Info */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Informasi Surat
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Jenis Surat</span>
                      <span className="font-medium text-gray-900">
                        {getJenisSuratLabel(surat.jenis_surat)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dibuat</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(surat.created_at)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Diperbarui</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(surat.updated_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
