import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ChevronLeft,
  FileText,
  Calendar,
  User,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Edit,
} from "lucide-react";
import { API_CONFIG } from "../../config/api";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

// Helper function to format date strings
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString; // Return original string if formatting fails
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
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Disetujui":
        return {
          icon: CheckCircle,
          color: "bg-green-100 text-green-800 border-green-200",
          dotColor: "bg-green-500",
        };
      case "Ditolak":
        return {
          icon: XCircle,
          color: "bg-red-100 text-red-800 border-red-200",
          dotColor: "bg-red-500",
        };
      case "Diajukan":
      default:
        return {
          icon: Clock,
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          dotColor: "bg-yellow-500",
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${config.color}`}
    >
      <div className={`h-2 w-2 rounded-full ${config.dotColor}`}></div>
      <Icon className="h-4 w-4" />
      {status}
    </div>
  );
};

// Add type for field display props
interface FieldDisplayProps {
  label: string;
  value: string | number | null;
  icon: React.ComponentType<{ className?: string }>;
  type?: "text" | "date" | "age";
}

// Update FieldDisplay component with proper types
const FieldDisplay = ({
  label,
  value,
  icon: Icon,
  type = "text",
}: FieldDisplayProps) => {
  const displayValue = () => {
    if (!value) return "-";
    if (type === "date") return formatDate(value as string);
    if (type === "age") return `${Math.floor(value as number)} tahun`;
    return value.toString();
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex-shrink-0">
            <Icon className="mt-0.5 h-5 w-5 text-gray-500" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <dt className="mb-1 text-sm font-medium text-gray-600">{label}</dt>
          <dd className="text-sm break-words text-gray-900">
            {displayValue()}
          </dd>
        </div>
      </div>
    </div>
  );
};

// Add type for field configuration
interface FieldConfig {
  key: keyof Surat;
  icon: React.ComponentType<{ className?: string }>;
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

const suratInfo: FieldConfig[] = [
  { key: "nomor_surat", icon: FileText },
  { key: "jenis_surat", icon: FileText },
  { key: "tanggal_pengajuan", icon: Calendar, type: "date" },
  { key: "tanggal_disetujui", icon: Calendar, type: "date" },
  { key: "keperluan", icon: FileText },
  { key: "attachment_bukti_pendukung", icon: FileText },
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
        console.log("API Response Data:", response.data); // Log data mentah dari API
        console.log("Surat Data from API:", response.data); // Log data surat yang diharapkan (setelah perubahan)
        setSurat(response.data); // Mengatur state surat langsung dari response.data
        setStatus(response.data.status_surat || "Diajukan"); // Mengakses status_surat langsung dari response.data
        setCatatan(response.data.catatan || "");
        console.log("Surat state after setting:", response.data); // Log state surat setelah diatur (setelah perubahan)
      } catch (error) {
        console.error("Gagal mengambil data surat:", error);
      } finally {
        setLoading(false);
        console.log("Loading set to false"); // Log saat loading selesai
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
      // Mengubah metode dari PUT menjadi PATCH dan URL menjadi ${id}/status
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
      alert("Surat berhasil diverifikasi");
      if (surat) {
        setSurat({ ...surat, status_surat: status, catatan });
      }
    } catch (error) {
      console.error("Gagal memverifikasi surat:", error);
      alert("Gagal memverifikasi surat");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
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
          <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="text-center">
              <AlertCircle className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <p className="text-gray-600">Data surat tidak ditemukan.</p>
            </div>
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
          <div className="border-b bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="rounded-lg p-2 transition-colors hover:bg-gray-100" />
                  <Separator orientation="vertical" className="h-6" />
                  <button
                    onClick={() => navigate(-1)}
                    className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      Verifikasi Surat
                    </h1>
                    <p className="text-sm text-gray-500">
                      Review dan verifikasi dokumen
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={surat.status_surat || "Diajukan"} />
                  <button className="rounded-lg p-2 transition-colors hover:bg-gray-100">
                    <Download className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Document Header */}
            <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="mb-2 text-xl font-semibold text-gray-900">
                    {getJenisSuratLabel(surat.jenis_surat)}
                  </h2>
                  <p className="mb-4 text-gray-600">{surat.keperluan}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Diajukan: {formatDate(surat.tanggal_pengajuan)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {surat.nama_pemohon}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Left Column - Document Information */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Informasi Surat
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {suratInfo.map(({ key, icon, type }) => (
                    <FieldDisplay
                      key={key}
                      label={getFieldLabel(key)}
                      value={renderFieldValue(key, surat[key] ?? null)}
                      icon={icon}
                      type={type}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column - Personal Information */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <User className="h-5 w-5 text-blue-600" />
                  Data Pemohon
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {personalInfo.map(({ key, icon, type }) => (
                    <FieldDisplay
                      key={key}
                      label={getFieldLabel(key)}
                      value={renderFieldValue(key, surat[key] ?? null)}
                      icon={icon}
                      type={type}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Verification Panel */}
            <div className="mt-8 space-y-6">
              {/* Verification Form */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Edit className="h-5 w-5 text-blue-600" />
                  Panel Verifikasi
                </h3>

                <div className="space-y-6">
                  {/* Status Selection */}
                  <div>
                    <label className="mb-3 block text-sm font-medium text-gray-700">
                      Status Verifikasi
                    </label>
                    <div className="space-y-2">
                      {["Diajukan", "Disetujui", "Ditolak"].map(
                        (statusOption) => (
                          <label
                            key={statusOption}
                            className="flex items-center"
                          >
                            <input
                              type="radio"
                              name="status"
                              value={statusOption}
                              checked={status === statusOption}
                              onChange={(e) => setStatus(e.target.value)}
                              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-3 text-sm text-gray-700">
                              {statusOption}
                            </span>
                          </label>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label
                      htmlFor="catatan"
                      className="mb-3 block text-sm font-medium text-gray-700"
                    >
                      Catatan Verifikasi
                    </label>
                    <textarea
                      id="catatan"
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      rows={4}
                      className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      placeholder="Tambahkan catatan verifikasi..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleVerifikasi}
                      disabled={submitting}
                      className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                          Memproses...
                        </span>
                      ) : (
                        "Simpan Verifikasi"
                      )}
                    </button>

                    <button
                      onClick={() => navigate(-1)}
                      className="w-full rounded-lg bg-gray-100 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200"
                    >
                      Kembali
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <h4 className="mb-2 text-sm font-medium text-blue-900">
                  Informasi Cepat
                </h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>• Pastikan semua data sudah sesuai</p>
                  <p>• Periksa kelengkapan dokumen</p>
                  <p>• Berikan catatan jika diperlukan</p>
                  <p>• Status dapat diubah kapan saja</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
