import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea"; // Assuming you have a Textarea component
import { API_CONFIG } from "../../config/api";

// Interface for the form data, can be expanded as needed
interface FormData {
  jenis_surat: string;
  nik_pemohon?: string;
  keperluan?: string;
  // SK_PINDAH fields
  alamat_tujuan?: string;
  rt_tujuan?: string;
  rw_tujuan?: string;
  kelurahan_desa_tujuan?: string;
  kecamatan_tujuan?: string;
  kabupaten_kota_tujuan?: string;
  provinsi_tujuan?: string;
  alasan_pindah?: string;
  klasifikasi_pindah?: string;
  data_pengikut_pindah?: string; // Consider how to handle this - text, JSON?
  // SK_KEMATIAN fields
  nik_penduduk_meninggal?: string;
  tanggal_kematian?: string;
  waktu_kematian?: string;
  tempat_kematian?: string;
  penyebab_kematian?: string;
  hubungan_pelapor_kematian?: string;
  // SK_KELAHIRAN fields
  nama_bayi?: string;
  tempat_dilahirkan?: string; // e.g., Rumah Sakit, Rumah
  tempat_kelahiran?: string; // e.g., Nama Kota/Kabupaten
  tanggal_lahir_bayi?: string;
  waktu_lahir_bayi?: string;
  jenis_kelamin_bayi?: string;
  jenis_kelahiran?: string; // e.g., Tunggal, Kembar
  anak_ke?: string;
  penolong_kelahiran?: string; // e.g., Dokter, Bidan
  berat_bayi_kg?: string;
  panjang_bayi_cm?: string;
  nik_penduduk_ibu?: string;
  nik_penduduk_ayah?: string;
  nik_penduduk_pelapor_lahir?: string;
  hubungan_pelapor_lahir?: string;
  // SK_USAHA fields
  nama_usaha?: string;
  jenis_usaha?: string;
  alamat_usaha?: string;
  status_bangunan_usaha?: string;
  perkiraan_modal_usaha?: string;
  perkiraan_pendapatan_usaha?: string;
  jumlah_tenaga_kerja?: string;
  sejak_tanggal_usaha?: string;
  // SK_TIDAK_MAMPU & SKTM_KIP fields
  penghasilan_perbulan_kepala_keluarga?: string;
  pekerjaan_kepala_keluarga?: string;
  // KARTU_INDONESIA_PINTAR fields (extends SKTM)
  nik_penduduk_siswa?: string;
  nama_sekolah?: string;
  nisn_siswa?: string;
  kelas_siswa?: string;
  // SK_KEHILANGAN_KTP fields
  nomor_ktp_hilang?: string;
  tanggal_perkiraan_hilang?: string;
  lokasi_perkiraan_hilang?: string;
  kronologi_singkat?: string;
  nomor_laporan_polisi?: string;
  tanggal_laporan_polisi?: string;
  // SK_KEHILANGAN_KK (similar to KTP but for KK)
  nomor_kk_hilang?: string;
  // SK_UMUM fields
  deskripsi_keperluan?: string;
  attachment_bukti_pendukung?: File | null;
}

const jenisSuratOptions = [
  { value: "", label: "Pilih Jenis Surat" },
  { value: "SK_DOMISILI", label: "SK Domisili" },
  { value: "SK_PINDAH", label: "SK Pindah" },
  { value: "SK_KEMATIAN", label: "SK Kematian" },
  { value: "SK_KELAHIRAN", label: "SK Kelahiran" },
  { value: "SK_USAHA", label: "SK Usaha" },
  { value: "SKTM", label: "SK Tidak Mampu (SKTM)" },
  {
    value: "KARTU_INDONESIA_PINTAR",
    label: "SKTM untuk Kartu Indonesia Pintar (KIP)",
  },
  { value: "SK_KEHILANGAN_KTP", label: "SK Kehilangan KTP" },
  // Add other letter types as needed, e.g., SK_KEHILANGAN_KK, SK_UMUM
];

export default function SuratCreate() {
  const [jenisSurat, setJenisSurat] = useState("");
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleJenisSuratChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newJenisSurat = e.target.value;
    setJenisSurat(newJenisSurat);
    // Reset form data, but keep jenis_surat
    setFormData({ jenis_surat: newJenisSurat });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const dataToSubmit = new window.FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) {
        dataToSubmit.append(key, value);
      } else if (value !== undefined && value !== null) {
        dataToSubmit.append(key, String(value));
      }
    });
    dataToSubmit.append("jenis_surat", jenisSurat);

    // Temp log to see data
    for (const pair of dataToSubmit.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    // alert("Check console for form data.");
    // setSubmitting(false);
    // return;

    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const response = await axios.post(
        `${API_CONFIG.baseURL}/api/surat`,
        dataToSubmit,
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Server Response:", response.data);
      alert("Pengajuan surat berhasil dikirim!");
      // Optionally, redirect or clear form
      setJenisSurat("");
      setFormData({});
    } catch (error) {
      console.error("Gagal mengirim pengajuan surat:", error);
      alert("Gagal mengirim pengajuan surat. Lihat konsol untuk detail.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderFormField = (
    name: keyof FormData,
    label: string,
    type: string = "text",
    required: boolean = true,
    options?: { value: string; label: string }[],
    component?: "input" | "textarea" | "select",
  ) => (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {component === "textarea" ? (
        <Textarea
          id={name}
          name={name}
          value={(formData[name] as string) || ""}
          onChange={handleInputChange}
          required={required}
          className="bg-background"
          placeholder={`Masukkan ${label.toLowerCase()}`}
        />
      ) : component === "select" && options ? (
        <select
          id={name}
          name={name}
          value={(formData[name] as string) || ""}
          onChange={handleInputChange}
          required={required}
          className="bg-background w-full rounded-md border p-2"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "file" ? (
        <Input
          id={name}
          name={name}
          type={type}
          onChange={handleFileChange} // Special handler for files
          required={required}
          className="bg-background"
        />
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          value={(formData[name] as string) || ""}
          onChange={handleInputChange}
          required={required}
          className="bg-background"
          placeholder={`Masukkan ${label.toLowerCase()}`}
        />
      )}
    </div>
  );

  const renderForm = () => {
    switch (jenisSurat) {
      case "SK_DOMISILI":
        return (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {renderFormField("nik_pemohon", "NIK Pemohon", "text", true)}
            {renderFormField(
              "keperluan",
              "Keperluan",
              "text",
              true,
              undefined,
              "textarea",
            )}
          </div>
        );
      case "SK_PINDAH":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField("nik_pemohon", "NIK Pemohon")}
              {renderFormField(
                "keperluan",
                "Keperluan",
                "text",
                true,
                undefined,
                "textarea",
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField("alamat_tujuan", "Alamat Tujuan")}
              <div className="grid grid-cols-2 gap-6">
                {renderFormField("rt_tujuan", "RT Tujuan")}
                {renderFormField("rw_tujuan", "RW Tujuan")}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField(
                "kelurahan_desa_tujuan",
                "Kelurahan/Desa Tujuan",
              )}
              {renderFormField("kecamatan_tujuan", "Kecamatan Tujuan")}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField(
                "kabupaten_kota_tujuan",
                "Kabupaten/Kota Tujuan",
              )}
              {renderFormField("provinsi_tujuan", "Provinsi Tujuan")}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField(
                "alasan_pindah",
                "Alasan Pindah",
                "text",
                true,
                [
                  { value: "", label: "Pilih Alasan" },
                  { value: "Pekerjaan", label: "Pekerjaan" },
                  { value: "Pendidikan", label: "Pendidikan" },
                  { value: "Keamanan", label: "Keamanan" },
                  { value: "Kesehatan", label: "Kesehatan" },
                  { value: "Perumahan", label: "Perumahan" },
                  { value: "Keluarga", label: "Keluarga" },
                  { value: "Lainnya", label: "Lainnya" },
                ],
                "select",
              )}
              {renderFormField(
                "klasifikasi_pindah",
                "Klasifikasi Pindah",
                "text",
                true,
                [
                  { value: "", label: "Pilih Klasifikasi" },
                  {
                    value: "Dalam Satu Kelurahan/Desa",
                    label: "Dalam Satu Kelurahan/Desa",
                  },
                  {
                    value: "Antar Kelurahan/Desa",
                    label: "Antar Kelurahan/Desa",
                  },
                  { value: "Antar Kecamatan", label: "Antar Kecamatan" },
                  {
                    value: "Antar Kabupaten/Kota dalam satu Provinsi",
                    label: "Antar Kabupaten/Kota dalam satu Provinsi",
                  },
                  { value: "Antar Provinsi", label: "Antar Provinsi" },
                ],
                "select",
              )}
            </div>
            {renderFormField(
              "data_pengikut_pindah",
              "Data Pengikut Pindah (Nama, NIK, Hubungan - pisahkan dengan ; jika lebih dari satu)",
              "text",
              false,
              undefined,
              "textarea",
            )}
          </div>
        );
      case "SK_KEMATIAN":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField("nik_pemohon", "NIK Pemohon (Pelapor)")}
              {renderFormField(
                "keperluan",
                "Keperluan Surat Kematian",
                "text",
                true,
                undefined,
                "textarea",
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField(
                "nik_penduduk_meninggal",
                "NIK Penduduk Meninggal",
              )}
              {renderFormField("tanggal_kematian", "Tanggal Kematian", "date")}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField("waktu_kematian", "Waktu Kematian", "time")}
              {renderFormField("tempat_kematian", "Tempat Kematian")}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField("penyebab_kematian", "Penyebab Kematian")}
              {renderFormField(
                "hubungan_pelapor_kematian",
                "Hubungan Pelapor dengan yang Meninggal",
              )}
            </div>
          </div>
        );
      case "SK_KELAHIRAN":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField("nik_pemohon", "NIK Pemohon (Pelapor)")}
              {renderFormField(
                "hubungan_pelapor_lahir",
                "Hubungan Pelapor dengan Bayi",
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField("nik_penduduk_ibu", "NIK Ibu")}
              {renderFormField("nik_penduduk_ayah", "NIK Ayah")}
            </div>
            <hr />
            <h3 className="text-lg font-medium">Data Bayi</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField("nama_bayi", "Nama Bayi")}
              {renderFormField(
                "jenis_kelamin_bayi",
                "Jenis Kelamin Bayi",
                "text",
                true,
                [
                  { value: "", label: "Pilih Jenis Kelamin" },
                  { value: "LAKI-LAKI", label: "Laki-laki" },
                  { value: "PEREMPUAN", label: "Perempuan" },
                ],
                "select",
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField(
                "tempat_dilahirkan",
                "Tempat Dilahirkan (RS, Rumah, dll)",
              )}
              {renderFormField(
                "tempat_kelahiran",
                "Tempat Kelahiran (Kota/Kab)",
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField(
                "tanggal_lahir_bayi",
                "Tanggal Lahir Bayi",
                "date",
              )}
              {renderFormField("waktu_lahir_bayi", "Waktu Lahir Bayi", "time")}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField(
                "jenis_kelahiran",
                "Jenis Kelahiran",
                "text",
                true,
                [
                  { value: "", label: "Pilih Jenis Kelahiran" },
                  { value: "Tunggal", label: "Tunggal" },
                  { value: "Kembar 2", label: "Kembar 2" },
                  { value: "Kembar 3", label: "Kembar 3" },
                  { value: "Kembar 4", label: "Kembar 4" },
                  { value: "Lainnya", label: "Lainnya" },
                ],
                "select",
              )}
              {renderFormField("anak_ke", "Anak Ke-", "number")}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField(
                "penolong_kelahiran",
                "Penolong Kelahiran",
                "text",
                true,
                [
                  { value: "", label: "Pilih Penolong" },
                  { value: "Dokter", label: "Dokter" },
                  { value: "Bidan/Perawat", label: "Bidan/Perawat" },
                  { value: "Dukun", label: "Dukun" },
                  { value: "Lainnya", label: "Lainnya" },
                ],
                "select",
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField("berat_bayi_kg", "Berat Bayi (kg)", "number")}
              {renderFormField(
                "panjang_bayi_cm",
                "Panjang Bayi (cm)",
                "number",
              )}
            </div>
          </div>
        );
      case "SK_USAHA":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField("nik_pemohon", "NIK Pemohon")}
              {renderFormField(
                "keperluan",
                "Keperluan Surat Usaha",
                "text",
                true,
                undefined,
                "textarea",
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField("nama_usaha", "Nama Usaha")}
              {renderFormField("jenis_usaha", "Jenis Usaha")}
            </div>
            {renderFormField(
              "alamat_usaha",
              "Alamat Usaha",
              "text",
              true,
              undefined,
              "textarea",
            )}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField(
                "status_bangunan_usaha",
                "Status Bangunan Usaha",
                "text",
                true,
                [
                  { value: "", label: "Pilih Status" },
                  { value: "Milik Sendiri", label: "Milik Sendiri" },
                  { value: "Sewa", label: "Sewa" },
                  { value: "Kontrak", label: "Kontrak" },
                  { value: "Lainnya", label: "Lainnya" },
                ],
                "select",
              )}
              {renderFormField(
                "sejak_tanggal_usaha",
                "Sejak Tanggal Usaha",
                "date",
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {renderFormField(
                "perkiraan_modal_usaha",
                "Perkiraan Modal Usaha (Rp)",
                "number",
              )}
              {renderFormField(
                "perkiraan_pendapatan_usaha",
                "Perkiraan Pendapatan Usaha /bulan (Rp)",
                "number",
              )}
              {renderFormField(
                "jumlah_tenaga_kerja",
                "Jumlah Tenaga Kerja",
                "number",
              )}
            </div>
          </div>
        );
      case "SKTM":
      case "KARTU_INDONESIA_PINTAR":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField(
                "nik_pemohon",
                "NIK Pemohon (Kepala Keluarga atau yang bertanggung jawab)",
              )}
              {renderFormField(
                "keperluan",
                "Keperluan Surat",
                "text",
                true,
                undefined,
                "textarea",
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField(
                "penghasilan_perbulan_kepala_keluarga",
                "Penghasilan Perbulan Kepala Keluarga (Rp)",
                "number",
              )}
              {renderFormField(
                "pekerjaan_kepala_keluarga",
                "Pekerjaan Kepala Keluarga",
              )}
            </div>
            {jenisSurat === "KARTU_INDONESIA_PINTAR" && (
              <>
                <hr />
                <h3 className="text-lg font-medium">Data Siswa Penerima KIP</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {renderFormField("nik_penduduk_siswa", "NIK Siswa")}
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {renderFormField("nama_sekolah", "Nama Sekolah")}
                  {renderFormField("nisn_siswa", "NISN Siswa")}
                </div>
                {renderFormField("kelas_siswa", "Kelas Siswa")}
              </>
            )}
          </div>
        );
      case "SK_KEHILANGAN_KTP":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField("nik_pemohon", "NIK Pemohon")}
              {renderFormField(
                "keperluan",
                "Keperluan Surat Kehilangan KTP",
                "text",
                false,
                undefined,
                "textarea",
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField("nomor_ktp_hilang", "Nomor KTP yang Hilang")}
              {renderFormField(
                "tanggal_perkiraan_hilang",
                "Tanggal Perkiraan Hilang",
                "date",
              )}
            </div>
            {renderFormField(
              "lokasi_perkiraan_hilang",
              "Lokasi Perkiraan Hilang",
            )}
            {renderFormField(
              "kronologi_singkat",
              "Kronologi Singkat Kehilangan",
              "text",
              true,
              undefined,
              "textarea",
            )}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField(
                "nomor_laporan_polisi",
                "Nomor Laporan Polisi (Jika Ada)",
                "text",
                false,
              )}
              {renderFormField(
                "tanggal_laporan_polisi",
                "Tanggal Laporan Polisi (Jika Ada)",
                "date",
                false,
              )}
            </div>
          </div>
        );
      // Add more cases for other surat types here...
      // e.g. SK_KEHILANGAN_KK, SK_UMUM
      default:
        return (
          <div className="text-muted-foreground py-8 text-center">
            Silakan pilih jenis surat untuk menampilkan formulir pengajuan.
          </div>
        );
    }
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
                  Surat
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Buat Pengajuan Surat</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-6xl space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Formulir Pengajuan Surat
              </h1>
              <p className="text-muted-foreground mt-2">
                Lengkapi data di bawah ini untuk mengajukan surat.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="jenis_surat">
                      Jenis Surat <span className="text-destructive">*</span>
                    </Label>
                    <select
                      id="jenis_surat"
                      name="jenis_surat"
                      value={jenisSurat}
                      onChange={handleJenisSuratChange}
                      required
                      className="bg-background w-full rounded-md border p-2"
                    >
                      {jenisSuratOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dynamic form part */}
                  {jenisSurat && (
                    <Card className="border p-6 shadow-sm">
                      {" "}
                      {/* Inner card for dynamic fields */}
                      <h2 className="mb-4 text-xl font-semibold">
                        Detail untuk{" "}
                        {jenisSuratOptions.find(
                          (opt) => opt.value === jenisSurat,
                        )?.label || jenisSurat}
                      </h2>
                      {renderForm()}
                    </Card>
                  )}

                  {/* Common field for all letters */}
                  <div className="space-y-2">
                    <Label htmlFor="attachment_bukti_pendukung">
                      Lampiran Bukti Pendukung (Opsional)
                    </Label>
                    <Input
                      id="attachment_bukti_pendukung"
                      name="attachment_bukti_pendukung"
                      type="file"
                      onChange={handleFileChange}
                      className="bg-background"
                    />
                    <p className="text-muted-foreground text-sm">
                      Unggah file jika ada bukti pendukung yang diperlukan
                      (misalnya: surat pengantar RT/RW, foto, dll).
                    </p>
                  </div>

                  {jenisSurat && (
                    <div className="flex justify-end pt-4">
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full md:w-auto"
                      >
                        {submitting ? "Mengirim..." : "Ajukan Surat"}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </form>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
