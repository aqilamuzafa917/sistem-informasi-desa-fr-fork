import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  // catatan: string | null;
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
  data_pengikut_pindah: string | null;
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

export default function VerifikasiSuratPages() {
  const { id } = useParams();
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
          `https://thankful-urgently-silkworm.ngrok-free.app/api/surat/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "69420",
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
        `https://thankful-urgently-silkworm.ngrok-free.app/api/surat/${id}/status`,
        {
          status_surat: status,
          catatan: catatan,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        },
      );
      alert("Surat berhasil diverifikasi");
    } catch (error) {
      console.error("Gagal memverifikasi surat:", error);
      alert("Gagal memverifikasi surat");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-screen items-center justify-center">
            <div>Loading...</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );

  if (!surat)
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-screen items-center justify-center">
            <div>Data surat tidak ditemukan.</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );

  // Filter hanya field yang tidak null dan bukan nomor_surat
  const nonNullFields = Object.entries(surat).filter(
    ([key, value]) => value !== null && key !== "nomor_surat",
  );

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
                  Surat
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Verifikasi Surat</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-6xl space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Verifikasi Surat {getJenisSuratLabel(surat.jenis_surat)}
              </h1>
              <p className="text-muted-foreground mt-2">
                ID Surat: {surat.id_surat}
              </p>
            </div>

            <Card className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {nonNullFields.map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>{getFieldLabel(key)}</Label>
                    <Input
                      id={key}
                      value={value?.toString() || ""}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Verifikasi</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status Surat</Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-md border p-2"
                  >
                    <option value="Diajukan">Diajukan</option>
                    <option value="Disetujui">Disetujui</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                </div>

                <div className="space-y-2">
                  {" "}
                  <Label htmlFor="catatan">Catatan</Label>
                  <textarea
                    id="catatan"
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    className="min-h-[100px] w-full rounded-md border p-2"
                    placeholder="Tambahkan catatan jika diperlukan"
                  />
                </div>

                <Button
                  onClick={handleVerifikasi}
                  disabled={submitting}
                  className="w-full md:w-auto"
                >
                  {submitting ? "Memproses..." : "Simpan Verifikasi"}
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
