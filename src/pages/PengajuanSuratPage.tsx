import { useState } from "react";
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

export default function PengajuanSuratPage() {
  const [jenisSurat, setJenisSurat] = useState("");
  const [formData, setFormData] = useState({});

  const handleJenisSuratChange = (e) => {
    setJenisSurat(e.target.value);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      jenis_surat: jenisSurat,
    };
    console.log("Data yang dikirim:", dataToSubmit);
    // Implementasi pengiriman data ke API bisa ditambahkan di sini
    alert("Pengajuan surat berhasil dikirim!");
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
                  rows="3"
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
                  rows="3"
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
                rows="4"
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
