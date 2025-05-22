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
  Label,
  FileInput,
} from "flowbite-react";
import { Card } from "@/components/ui/card";
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsGithub,
  BsDribbble,
} from "react-icons/bs";

export default function PengaduanWargaPage() {
  const [formData, setFormData] = useState({
    nama: "",
    nomorHp: "",
    kategori: "",
    detailPengaduan: "",
    lampiran: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      lampiran: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    // Validasi nomor HP (hanya angka dan minimal 10 digit)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.nomorHp)) {
      setSubmitError("Nomor HP harus berupa angka dan minimal 10 digit");
      setIsSubmitting(false);
      return;
    }

    // Simulasi pengiriman data ke server
    setTimeout(() => {
      console.log("Data pengaduan:", formData);
      // Di sini nantinya akan ada kode untuk mengirim data ke API

      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Reset form setelah berhasil submit
      setFormData({
        nama: "",
        nomorHp: "",
        kategori: "",
        detailPengaduan: "",
        lampiran: null,
      });

      // Reset pesan sukses setelah beberapa detik
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  const kategoriOptions = [
    { value: "", label: "Pilih Kategori Pengaduan" },
    { value: "umum", label: "Umum" },
    { value: "sosial", label: "Sosial" },
    { value: "keamanan", label: "Keamanan" },
    { value: "kesehatan", label: "Kesehatan" },
    { value: "kebersihan", label: "Kebersihan" },
    { value: "permintaan", label: "Permintaan" },
  ];

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

      <div className="container mx-auto flex-grow px-4 py-8">
        <Card className="p-6">
          <h2 className="mb-6 text-2xl font-bold">Pengaduan Warga</h2>
          <p className="mb-6 text-gray-600">
            Silakan lengkapi formulir di bawah ini untuk melaporkan kejadian
            atau masalah yang sedang Anda alami. Pengaduan Anda akan
            ditindaklanjuti oleh petugas desa dalam waktu 1-3 hari kerja.
          </p>

          {submitSuccess && (
            <div className="mb-6 rounded-lg bg-green-100 p-4 text-sm text-green-700 dark:bg-green-200 dark:text-green-800">
              Pengaduan Anda berhasil dikirim! Petugas desa akan segera
              menindaklanjuti laporan Anda.
            </div>
          )}

          {submitError && (
            <div className="mb-6 rounded-lg bg-red-100 p-4 text-sm text-red-700 dark:bg-red-200 dark:text-red-800">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="nama"
                  className="w-full rounded-md border p-2"
                  placeholder="Masukkan nama lengkap Anda"
                  value={formData.nama}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Nomor HP
                </label>
                <input
                  type="tel"
                  name="nomorHp"
                  className="w-full rounded-md border p-2"
                  placeholder="Contoh: 081234567890"
                  value={formData.nomorHp}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Kategori Pengaduan
              </label>
              <select
                name="kategori"
                className="w-full rounded-md border p-2"
                value={formData.kategori}
                onChange={handleInputChange}
                required
              >
                {kategoriOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Detail Pengaduan
              </label>
              <textarea
                name="detailPengaduan"
                className="w-full rounded-md border p-2"
                rows="6"
                placeholder="Jelaskan secara detail pengaduan atau masalah yang Anda alami..."
                value={formData.detailPengaduan}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="lampiran" value="Lampiran (Opsional)" />
              </div>
              <FileInput
                id="lampiran"
                name="lampiran"
                helperText="Upload foto atau dokumen pendukung (JPG, PNG, PDF, maks. 5MB)"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Mengirim..." : "Kirim Pengaduan"}
              </button>
            </div>
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
