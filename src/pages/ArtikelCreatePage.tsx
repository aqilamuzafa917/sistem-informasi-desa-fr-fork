import { useState, useRef } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  Button as FlowbiteButton,
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterIcon,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
  Label,
  Select,
  Textarea,
  FileInput,
  Alert,
} from "flowbite-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsGithub,
  BsDribbble,
  BsImage,
} from "react-icons/bs";

interface FormData {
  name: string;
  title: string;
  category: string;
  content: string;
  image: File | null;
}

export default function ArtikelCreatePage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    title: "",
    category: "Berita",
    content: "",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string | null;
  }>({ type: null, message: null });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    "Berita",
    "Acara",
    "Budaya",
    "Pemerintahan",
    "Pendidikan",
    "Kesehatan",
    "Lainnya",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi form
    if (!formData.name.trim()) {
      setSubmitStatus({
        type: "error",
        message: "Judul artikel tidak boleh kosong",
      });
      return;
    }
    if (!formData.title.trim()) {
      setSubmitStatus({
        type: "error",
        message: "Judul artikel tidak boleh kosong",
      });
      return;
    }

    if (!formData.content.trim()) {
      setSubmitStatus({
        type: "error",
        message: "Konten artikel tidak boleh kosong",
      });
      return;
    }

    if (!formData.image) {
      setSubmitStatus({
        type: "error",
        message: "Gambar artikel harus diunggah",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: null });

    try {
      // Simulasi pengiriman data ke server
      // Dalam implementasi nyata, ini akan memanggil API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Reset form setelah berhasil
      setFormData({
        name: "",
        title: "",
        category: "Berita",
        content: "",
        image: null,
      });
      setPreviewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSubmitStatus({
        type: "success",
        message:
          "Artikel berhasil dikirim dan sedang menunggu persetujuan admin",
      });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Terjadi kesalahan saat mengirim artikel. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      {/* Navbar Section */}
      <Navbar fluid rounded className="mb-8 border-y-2">
        <NavbarBrand href="/">
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Desa Batujajar Timur
          </span>
        </NavbarBrand>
        <div className="flex md:order-2">
          <FlowbiteButton>Hubungi Kami</FlowbiteButton>
          <NavbarToggle />
        </div>
        <NavbarCollapse>
          <NavbarLink href="/">Beranda</NavbarLink>
          <NavbarLink href="#FiturDesa">Fitur Desa</NavbarLink>
          <NavbarLink href="/profildesa">Profil Desa</NavbarLink>
          <NavbarLink href="infografis/penduduk">Infografis</NavbarLink>
          <NavbarLink href="/artikeldesa" active>
            Artikel
          </NavbarLink>
          <NavbarLink href="/petafasilitasdesa">Peta Fasilitas</NavbarLink>
        </NavbarCollapse>
      </Navbar>

      <div className="container mx-auto flex-grow px-4 py-8">
        <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
            Buat Artikel Baru
          </h1>

          {submitStatus.type && (
            <Alert
              color={submitStatus.type === "success" ? "success" : "failure"}
              className="mb-6"
            >
              {submitStatus.message}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Nama Penulis</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Masukkan nama penulis"
                required
              />
            </div>

            <div>
              <Label htmlFor="title" className="mb-2 block">
                Judul Artikel
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Masukkan judul artikel"
                required
              />
            </div>

            <div>
              <Label htmlFor="category" className="mb-2 block">
                Kategori
              </Label>
              <Select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="content" className="mb-2 block">
                Konten Artikel
              </Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Tulis konten artikel di sini..."
                rows={10}
                required
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="image" className="mb-2 block">
                Gambar Artikel
              </Label>
              <div className="flex items-center space-x-4">
                <FileInput
                  id="image"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="mb-2"
                />
              </div>
            </div>

            {previewImage && (
              <div className="mt-4">
                <Label htmlFor="preview">Preview Gambar</Label>
                <div className="relative h-64 w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/artikeldesa")}
                type="button"
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Mengirim..." : "Kirim Artikel"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <Footer
        container
        className="mt-auto rounded-none bg-white dark:bg-gray-900"
      >
        <div className="w-full text-center">
          <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
            <FooterBrand
              href="/"
              src="/flowbite-react.svg"
              alt="Flowbite Logo"
              name="Desa Batujajar Timur"
            />
            <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
              <FooterIcon href="#" icon={BsFacebook} />
              <FooterIcon href="#" icon={BsInstagram} />
              <FooterIcon href="#" icon={BsTwitter} />
              <FooterIcon href="#" icon={BsGithub} />
              <FooterIcon href="#" icon={BsDribbble} />
            </div>
          </div>
          <FooterDivider />
          <div className="w-full sm:flex sm:items-center sm:justify-between">
            <FooterCopyright href="#" by="Desa Batujajar Timur" year={2023} />
            <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
              <FooterLink href="#">Tentang</FooterLink>
              <FooterLink href="#">Kebijakan Privasi</FooterLink>
              <FooterLink href="#">Lisensi</FooterLink>
              <FooterLink href="#">Kontak</FooterLink>
            </div>
          </div>
        </div>
      </Footer>
    </div>
  );
}
