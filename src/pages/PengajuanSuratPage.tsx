import { useState } from "react";
import axios from "axios";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterIcon,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
} from "flowbite-react";
import { Card } from "@/components/ui/card";
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsGithub,
  BsDribbble,
} from "react-icons/bs";

// Define an interface for the API payload
interface SuratPayload {
  id_surat?: number | null;
  nomor_surat?: string | null;
  jenis_surat: string;
  tanggal_pengajuan?: string | null;
  tanggal_disetujui?: string | null;
  nik_pemohon?: string | null;
  keperluan?: string | null;
  status_surat?: string;
  catatan?: string | null;
  attachment_bukti_pendukung?: string | null;
  nik_penduduk_meninggal?: string | null;
  alamat_terakhir_meninggal?: string | null;
  tanggal_kematian?: string | null;
  waktu_kematian?: string | null;
  tempat_kematian?: string | null;
  penyebab_kematian?: string | null;
  hubungan_pelapor_kematian?: string | null;
  alamat_tujuan?: string | null;
  rt_tujuan?: string | null;
  rw_tujuan?: string | null;
  kelurahan_desa_tujuan?: string | null;
  kecamatan_tujuan?: string | null;
  kabupaten_kota_tujuan?: string | null;
  provinsi_tujuan?: string | null;
  alasan_pindah?: string | null;
  klasifikasi_pindah?: string | null;
  data_pengikut_pindah?: string | null; // Assuming string, adjust if it's an object/array
  nama_bayi?: string | null;
  tempat_dilahirkan?: string | null;
  tempat_kelahiran?: string | null;
  tanggal_lahir_bayi?: string | null;
  waktu_lahir_bayi?: string | null;
  jenis_kelamin_bayi?: string | null;
  jenis_kelahiran?: string | null;
  anak_ke?: number | string | null; // API shows number, but form might pass string
  penolong_kelahiran?: string | null;
  berat_bayi_kg?: number | string | null;
  panjang_bayi_cm?: number | string | null;
  nik_penduduk_ibu?: string | null;
  nik_penduduk_ayah?: string | null;
  nik_penduduk_pelapor_lahir?: string | null;
  hubungan_pelapor_lahir?: string | null;
  nama_usaha?: string | null;
  jenis_usaha?: string | null;
  alamat_usaha?: string | null;
  status_bangunan_usaha?: string | null;
  perkiraan_modal_usaha?: number | string | null;
  perkiraan_pendapatan_usaha?: number | string | null;
  jumlah_tenaga_kerja?: number | string | null;
  sejak_tanggal_usaha?: string | null;
  penghasilan_perbulan_kepala_keluarga?: number | string | null;
  pekerjaan_kepala_keluarga?: string | null;
  nik_penduduk_siswa?: string | null;
  nama_sekolah?: string | null;
  nisn_siswa?: string | null;
  kelas_siswa?: string | null;
  nomor_ktp_hilang?: string | null;
  tanggal_perkiraan_hilang?: string | null;
  lokasi_perkiraan_hilang?: string | null;
  kronologi_singkat?: string | null;
  nomor_laporan_polisi?: string | null;
  tanggal_laporan_polisi?: string | null;
  deleted_at?: string | null;
  // Optional fields from API response, not typically sent in POST, but good for type completeness
  nama_pemohon?: string | null;
  tempat_lahir_pemohon?: string | null;
  status_perkawinan_pemohon?: string | null;
  tanggal_lahir_pemohon?: string | null;
  jenis_kelamin_pemohon?: string | null;
  alamat_pemohon?: string | null;
  umur_pemohon?: number | null;
  nama_meninggal?: string | null;
  nik_meninggal?: string | null; // Added for SK_KEMATIAN mapping
  tempat_lahir_meninggal?: string | null;
  tanggal_lahir_meninggal?: string | null;
  jenis_kelamin_meninggal?: string | null;
  umur_saat_meninggal?: number | null;
  // nik_meninggal already listed under nik_penduduk_meninggal
  hari_kematian?: string | null;
  nama_ibu?: string | null;
  umur_ibu_saat_kelahiran?: number | null;
  nama_ayah?: string | null;
  umur_ayah_saat_kelahiran?: number | null;
  nama_siswa?: string | null;
  tempat_lahir_siswa?: string | null;
  tanggal_lahir_siswa?: string | null;
  jenis_kelamin_siswa?: string | null;
  umur_siswa?: number | null;
}

export default function PengajuanSuratPage() {
  const [jenisSurat, setJenisSurat] = useState("");
  const [formData, setFormData] = useState<Partial<SuratPayload>>({});

  const handleJenisSuratChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setJenisSurat(e.target.value);
    setFormData({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Initialize with all keys from SuratPayload set to null or default
    const defaultApiData: SuratPayload = {
      id_surat: null,
      nomor_surat: null,
      jenis_surat: jenisSurat, // This comes from the form selection
      tanggal_pengajuan: new Date().toISOString(), // Set current date
      tanggal_disetujui: null,
      nik_pemohon: null,
      keperluan: null,
      status_surat: "Diajukan", // Default status
      catatan: null,
      attachment_bukti_pendukung: null,
      nik_penduduk_meninggal: null,
      alamat_terakhir_meninggal: null,
      tanggal_kematian: null,
      waktu_kematian: null,
      tempat_kematian: null,
      penyebab_kematian: null,
      hubungan_pelapor_kematian: null,
      alamat_tujuan: null,
      rt_tujuan: null,
      rw_tujuan: null,
      kelurahan_desa_tujuan: null,
      kecamatan_tujuan: null,
      kabupaten_kota_tujuan: null,
      provinsi_tujuan: null,
      alasan_pindah: null,
      klasifikasi_pindah: null,
      data_pengikut_pindah: null,
      nama_bayi: null,
      tempat_dilahirkan: null,
      tempat_kelahiran: null,
      tanggal_lahir_bayi: null,
      waktu_lahir_bayi: null,
      jenis_kelamin_bayi: null,
      jenis_kelahiran: null,
      anak_ke: null,
      penolong_kelahiran: null,
      berat_bayi_kg: null,
      panjang_bayi_cm: null,
      nik_penduduk_ibu: null,
      nik_penduduk_ayah: null,
      nik_penduduk_pelapor_lahir: null,
      hubungan_pelapor_lahir: null,
      nama_usaha: null,
      jenis_usaha: null,
      alamat_usaha: null,
      status_bangunan_usaha: null,
      perkiraan_modal_usaha: null,
      perkiraan_pendapatan_usaha: null,
      jumlah_tenaga_kerja: null,
      sejak_tanggal_usaha: null,
      penghasilan_perbulan_kepala_keluarga: null,
      pekerjaan_kepala_keluarga: null,
      nik_penduduk_siswa: null,
      nama_sekolah: null,
      nisn_siswa: null,
      kelas_siswa: null,
      nomor_ktp_hilang: null,
      tanggal_perkiraan_hilang: null,
      lokasi_perkiraan_hilang: null,
      kronologi_singkat: null,
      nomor_laporan_polisi: null,
      tanggal_laporan_polisi: null,
      deleted_at: null,
    };

    // Merge formData into apiData using object spreading
    const apiData: SuratPayload = {
      ...defaultApiData,
      ...formData,
    };

    // Special handling for SK_KEMATIAN's nik_meninggal and nik_penduduk_meninggal
    if (jenisSurat === "SK_KEMATIAN" && formData.nik_penduduk_meninggal) {
      apiData.nik_meninggal = formData.nik_penduduk_meninggal;
    }

    console.log("Data yang dikirim:", apiData);

    try {
      const response = await axios.post(
        "https://thankful-urgently-silkworm.ngrok-free.app/api/publik/surat",
        apiData,
        {
          headers: {
            "ngrok-skip-browser-warning": "69420",
          },
        },
      );
      console.log("Respon API:", response.data);
      alert("Pengajuan surat berhasil dikirim!");
      // Optionally reset form or redirect user
      setJenisSurat("");
      setFormData({});
    } catch (error) {
      console.error("Error mengirim data:", error);
      if (axios.isAxiosError(error) && error.response) {
        // Handle validation errors or other specific API errors
        console.error("Detail error:", error.response.data);
        alert(
          `Gagal mengirim pengajuan: ${
            error.response.data.message || "Terjadi kesalahan pada server."
          }`,
        );
      } else {
        alert("Gagal mengirim pengajuan. Silakan coba lagi.");
      }
    }
  };

  // Render form berdasarkan jenis surat yang dipilih
  const renderForm = () => {
    switch (jenisSurat) {
      case "SK_PINDAH":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  NIK Pemohon
                </label>
                <input
                  type="text"
                  name="nik_pemohon"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Keperluan
                </label>
                <input
                  type="text"
                  name="keperluan"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Alamat Tujuan
                </label>
                <input
                  type="text"
                  name="alamat_tujuan"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    RT Tujuan
                  </label>
                  <input
                    type="text"
                    name="rt_tujuan"
                    className="w-full rounded-md border p-2"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    RW Tujuan
                  </label>
                  <input
                    type="text"
                    name="rw_tujuan"
                    className="w-full rounded-md border p-2"
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Kelurahan/Desa Tujuan
                </label>
                <input
                  type="text"
                  name="kelurahan_desa_tujuan"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Kecamatan Tujuan
                </label>
                <input
                  type="text"
                  name="kecamatan_tujuan"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Kabupaten/Kota Tujuan
                </label>
                <input
                  type="text"
                  name="kabupaten_kota_tujuan"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Provinsi Tujuan
                </label>
                <input
                  type="text"
                  name="provinsi_tujuan"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Alasan Pindah
                </label>
                <select
                  name="alasan_pindah"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Pilih Alasan</option>
                  <option value="Pekerjaan">Pekerjaan</option>
                  <option value="Pendidikan">Pendidikan</option>
                  <option value="Keamanan">Keamanan</option>
                  <option value="Kesehatan">Kesehatan</option>
                  <option value="Perumahan">Perumahan</option>
                  <option value="Keluarga">Keluarga</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Klasifikasi Pindah
                </label>
                <select
                  name="klasifikasi_pindah"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Pilih Klasifikasi</option>
                  <option value="Dalam Satu Kelurahan/Desa">
                    Dalam Satu Kelurahan/Desa
                  </option>
                  <option value="Antar Kelurahan/Desa">
                    Antar Kelurahan/Desa
                  </option>
                  <option value="Antar Kecamatan">Antar Kecamatan</option>
                  <option value="Antar Kabupaten/Kota dalam satu Provinsi">
                    Antar Kabupaten/Kota dalam satu Provinsi
                  </option>
                  <option value="Antar Provinsi">Antar Provinsi</option>
                </select>
              </div>
            </div>
          </div>
        );

      case "SK_DOMISILI":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  NIK Pemohon
                </label>
                <input
                  type="text"
                  name="nik_pemohon"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Keperluan
                </label>
                <input
                  type="text"
                  name="keperluan"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
        );

      case "SK_KEMATIAN":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  NIK Pemohon
                </label>
                <input
                  type="text"
                  name="nik_pemohon"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Keperluan
                </label>
                <input
                  type="text"
                  name="keperluan"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  NIK Penduduk Meninggal
                </label>
                <input
                  type="text"
                  name="nik_penduduk_meninggal"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Tanggal Kematian
                </label>
                <input
                  type="date"
                  name="tanggal_kematian"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Waktu Kematian
                </label>
                <input
                  type="time"
                  name="waktu_kematian"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Tempat Kematian
                </label>
                <input
                  type="text"
                  name="tempat_kematian"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Penyebab Kematian
                </label>
                <input
                  type="text"
                  name="penyebab_kematian"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Hubungan Pelapor Kematian
                </label>
                <input
                  type="text"
                  name="hubungan_pelapor_kematian"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
        );

      case "SK_KELAHIRAN":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  NIK Pemohon
                </label>
                <input
                  type="text"
                  name="nik_pemohon"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Keperluan
                </label>
                <input
                  type="text"
                  name="keperluan"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            {/* Tambahkan field lain untuk SK Kelahiran */}
          </div>
        );

      case "SK_USAHA":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  NIK Pemohon
                </label>
                <input
                  type="text"
                  name="nik_pemohon"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Keperluan
                </label>
                <input
                  type="text"
                  name="keperluan"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Nama Usaha
                </label>
                <input
                  type="text"
                  name="nama_usaha"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Jenis Usaha
                </label>
                <input
                  type="text"
                  name="jenis_usaha"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Alamat Usaha
                </label>
                <input
                  type="text"
                  name="alamat_usaha"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Status Bangunan Usaha
                </label>
                <select
                  name="status_bangunan_usaha"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Pilih Status</option>
                  <option value="Milik Sendiri">Milik Sendiri</option>
                  <option value="Sewa">Sewa</option>
                  <option value="Kontrak">Kontrak</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Sejak Tanggal Usaha
                </label>
                <input
                  type="date"
                  name="sejak_tanggal_usaha"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Perkiraan Modal Usaha
                </label>
                <input
                  type="number"
                  name="perkiraan_modal_usaha"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Perkiraan Pendapatan Usaha
                </label>
                <input
                  type="number"
                  name="perkiraan_pendapatan_usaha"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Jumlah Tenaga Kerja
                </label>
                <input
                  type="number"
                  name="jumlah_tenaga_kerja"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
        );

      case "SK_KEHILANGAN_KTP":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  NIK Pemohon
                </label>
                <input
                  type="text"
                  name="nik_pemohon"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Keperluan
                </label>
                <input
                  type="text"
                  name="keperluan"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Nomor KTP Hilang
                </label>
                <input
                  type="text"
                  name="nomor_ktp_hilang"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Tanggal Perkiraan Hilang
                </label>
                <input
                  type="date"
                  name="tanggal_perkiraan_hilang"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Lokasi Perkiraan Hilang
                </label>
                <input
                  type="text"
                  name="lokasi_perkiraan_hilang"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Kronologi Singkat
                </label>
                <textarea
                  name="kronologi_singkat"
                  className="w-full rounded-md border p-2"
                  rows={3}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Nomor Laporan Polisi
                </label>
                <input
                  type="text"
                  name="nomor_laporan_polisi"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Tanggal Laporan Polisi
                </label>
                <input
                  type="date"
                  name="tanggal_laporan_polisi"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
        );

      case "SK_KEHILANGAN_KK":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  NIK Pemohon
                </label>
                <input
                  type="text"
                  name="nik_pemohon"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Keperluan
                </label>
                <input
                  type="text"
                  name="keperluan"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Nomor KK Hilang
                </label>
                <input
                  type="text"
                  name="nomor_kk_hilang"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Tanggal Perkiraan Hilang
                </label>
                <input
                  type="date"
                  name="tanggal_perkiraan_hilang"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Lokasi Perkiraan Hilang
                </label>
                <input
                  type="text"
                  name="lokasi_perkiraan_hilang"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Kronologi Singkat
                </label>
                <textarea
                  name="kronologi_singkat"
                  className="w-full rounded-md border p-2"
                  rows={3}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
            </div>
          </div>
        );

      case "SK_UMUM":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  NIK Pemohon
                </label>
                <input
                  type="text"
                  name="nik_pemohon"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Keperluan
                </label>
                <input
                  type="text"
                  name="keperluan"
                  className="w-full rounded-md border p-2"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Deskripsi Keperluan
              </label>
              <textarea
                name="deskripsi_keperluan"
                className="w-full rounded-md border p-2"
                rows={4}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
          </div>
        );

      default:
        return (
          <div className="py-8 text-center text-gray-600">
            Silakan pilih jenis surat untuk menampilkan formulir pengajuan
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar fluid rounded className="mb-8 border-y-2">
        <NavbarBrand href="/">
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Desa Batujajar Timur
          </span>
        </NavbarBrand>
        <div className="flex md:order-2">
          <Button>Hubungi Kami</Button>
          <NavbarToggle />
        </div>
        <NavbarCollapse>
          <NavbarLink href="/">Beranda</NavbarLink>
          <NavbarLink href="/#FiturDesa" active>
            Fitur Desa
          </NavbarLink>
          <NavbarLink href="/profildesa">Profil Desa</NavbarLink>
          <NavbarLink href="/infografis/penduduk">Infografis</NavbarLink>
          <NavbarLink href="/artikeldesa">Artikel</NavbarLink>
          <NavbarLink href="/petafasilitasdesa">Peta Fasilitas</NavbarLink>
        </NavbarCollapse>
      </Navbar>

      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <h2 className="mb-6 text-2xl font-bold">Pengajuan Surat</h2>
          <p className="mb-6 text-gray-600">
            Silahkan lengkapi formulir pengajuan surat sesuai dengan kebutuhan
            Anda. Pilih jenis surat yang ingin diajukan, kemudian isi data yang
            diperlukan dengan lengkap dan benar. Pengajuan surat akan diproses
            dalam waktu 1-3 hari kerja.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium">
                Jenis Surat
              </label>
              <select
                className="w-full rounded-md border p-2"
                value={jenisSurat}
                onChange={handleJenisSuratChange}
                required
              >
                <option value="">Pilih Jenis Surat</option>
                <option value="SK_PINDAH">SK Pindah</option>
                <option value="SK_DOMISILI">SK Domisili</option>
                <option value="SK_KEMATIAN">SK Kematian</option>
                <option value="SK_KELAHIRAN">SK Kelahiran</option>
                <option value="SK_USAHA">SK Usaha</option>
                <option value="SK_TIDAK_MAMPU">SK Tidak Mampu</option>
                <option value="SKTM_KIP">SKTM KIP</option>
                <option value="SK_KEHILANGAN_KTP">SK Kehilangan KTP</option>
                <option value="SK_KEHILANGAN_KK">SK Kehilangan KK</option>
                <option value="SK_UMUM">SK Umum</option>
              </select>
            </div>

            {jenisSurat && (
              <div className="mb-6 rounded-md border p-4">
                <h3 className="mb-4 text-lg font-semibold">
                  Formulir {jenisSurat.replace("_", " ")}
                </h3>
                {renderForm()}
              </div>
            )}

            {jenisSurat && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Ajukan Surat
                </button>
              </div>
            )}
          </form>
        </Card>
      </div>
      <Footer container className="mt-auto rounded-none">
        <div className="w-full">
          <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
            <div>
              <FooterBrand href="/" src="" name="Desa Batujajar Timur" />
            </div>
            <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
              <div>
                <FooterTitle title="Tentang" />
                <FooterLinkGroup col>
                  <FooterLink href="/profildesa">Profil Desa</FooterLink>
                  <FooterLink href="#">Visi & Misi</FooterLink>
                </FooterLinkGroup>
              </div>
              <div>
                <FooterTitle title="Ikuti Kami" />
                <FooterLinkGroup col>
                  <FooterLink href="#">Facebook</FooterLink>
                  <FooterLink href="#">Instagram</FooterLink>
                </FooterLinkGroup>
              </div>
              <div>
                <FooterTitle title="Informasi" />
                <FooterLinkGroup col>
                  <FooterLink href="#">Kontak</FooterLink>
                  <FooterLink href="#">Layanan</FooterLink>
                </FooterLinkGroup>
              </div>
            </div>
          </div>
          <FooterDivider />
          <div className="w-full sm:flex sm:items-center sm:justify-between">
            <FooterCopyright href="/" by="Desa Batujajar Timur™" year={2023} />
            <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
              <FooterIcon href="#" icon={BsFacebook} />
              <FooterIcon href="#" icon={BsInstagram} />
              <FooterIcon href="#" icon={BsTwitter} />
              <FooterIcon href="#" icon={BsGithub} />
              <FooterIcon href="#" icon={BsDribbble} />
            </div>
          </div>
        </div>
      </Footer>
    </div>
  );
}
