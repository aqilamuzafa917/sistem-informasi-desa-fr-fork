import { useState } from "react";
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
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import dynamic from "next/dynamic";
import axios from "axios";
import { toast } from "sonner";
import { Toaster } from "sonner";

// Fix for default marker icon in Leaflet
delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface FormData {
  penulis_artikel: string;
  judul_artikel: string;
  kategori_artikel: string;
  tanggal_kejadian: string;
  location_name: string;
  latitude: number | null;
  longitude: number | null;
  status_artikel: string;
  isi_artikel: string;
  jenis_artikel: string;
  media_artikel: File[] | null;
}

// Dynamic import for MapContainer to avoid SSR issues
const MapWithNoSSR = dynamic(() => Promise.resolve(MapContainer), {
  ssr: false,
});

function LocationMarker({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

export default function ArtikelCreatePage() {
  const [formData, setFormData] = useState<FormData>({
    penulis_artikel: "",
    judul_artikel: "",
    kategori_artikel: "Berita",
    tanggal_kejadian: "",
    location_name: "",
    latitude: null,
    longitude: null,
    status_artikel: "Resmi",
    isi_artikel: "",
    jenis_artikel: "warga",
    media_artikel: null,
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      setFormData((prev) => ({
        ...prev,
        media_artikel: prev.media_artikel
          ? [...prev.media_artikel, ...newFiles]
          : newFiles,
      }));

      // Create preview URLs for new images
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewImages((prev) => [...prev, ...newPreviewUrls]);

      // Cleanup function for new preview URLs
      return () => {
        newPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => {
      const newFiles = prev.media_artikel ? [...prev.media_artikel] : [];
      newFiles.splice(index, 1);
      return {
        ...prev,
        media_artikel: newFiles.length > 0 ? newFiles : null,
      };
    });

    setPreviewImages((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]); // Cleanup the URL
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Token tidak ditemukan");

      const formDataToSend = new FormData();

      // Handle multiple media_artikel files
      if (formData.media_artikel) {
        formData.media_artikel.forEach((file) => {
          formDataToSend.append("media_artikel[]", file);
        });
      }

      // Add other form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "media_artikel" && value !== null) {
          formDataToSend.append(key, value.toString());
        }
      });

      const response = await axios.post(
        "https://thankful-urgently-silkworm.ngrok-free.app/api/artikel",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            "ngrok-skip-browser-warning": "69420",
          },
        },
      );

      if (response.data) {
        toast.success("Artikel berhasil dibuat!", {
          description: "Halaman akan dimuat ulang dalam beberapa detik",
          duration: 2000,
        });

        // Wait for 2 seconds to show toast before refreshing
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      if (axios.isAxiosError(error) && error.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = Object.entries(error.response.data.errors)
          .map(
            ([field, messages]) =>
              `${field}: ${(messages as string[]).join(", ")}`,
          )
          .join("\n");
        toast.error("Gagal membuat artikel", {
          description: errorMessages,
        });
      } else {
        toast.error("Gagal membuat artikel", {
          description:
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan saat mengirim artikel. Silakan coba lagi.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <Toaster richColors position="top-center" />
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="penulis_artikel">Nama Penulis</Label>
                <Input
                  id="penulis_artikel"
                  name="penulis_artikel"
                  value={formData.penulis_artikel}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="judul_artikel">Judul Artikel</Label>
                <Input
                  id="judul_artikel"
                  name="judul_artikel"
                  value={formData.judul_artikel}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="kategori_artikel">Kategori</Label>
                <Select
                  id="kategori_artikel"
                  name="kategori_artikel"
                  value={formData.kategori_artikel}
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
                <Label htmlFor="tanggal_kejadian">Tanggal Kejadian</Label>
                <Input
                  id="tanggal_kejadian"
                  name="tanggal_kejadian"
                  type="date"
                  value={formData.tanggal_kejadian}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="location_name">Nama Lokasi</Label>
                <Input
                  id="location_name"
                  name="location_name"
                  value={formData.location_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude ?? ""}
                    onChange={handleInputChange}
                    placeholder="Klik pada peta untuk mengisi koordinat"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude ?? ""}
                    onChange={handleInputChange}
                    placeholder="Klik pada peta untuk mengisi koordinat"
                  />
                </div>
              </div>
            </div>

            <div className="h-[400px] w-full">
              <MapWithNoSSR
                center={[
                  formData.latitude ?? -6.913331,
                  formData.longitude ?? 107.511669,
                ]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker onLocationSelect={handleLocationSelect} />
              </MapWithNoSSR>
            </div>

            <div>
              <Label htmlFor="isi_artikel" className="mb-2 block">
                Isi Artikel
              </Label>
              <Textarea
                id="isi_artikel"
                name="isi_artikel"
                value={formData.isi_artikel}
                onChange={handleInputChange}
                placeholder="Tulis isi artikel di sini..."
                rows={10}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="media_artikel">Gambar Artikel</Label>
                <Input
                  id="media_artikel"
                  name="media_artikel"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  multiple
                  required
                />
                <p className="text-muted-foreground mt-1 text-sm">
                  Anda dapat memilih lebih dari satu gambar
                </p>
              </div>

              {previewImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="group relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-32 w-full rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="bg-destructive text-destructive-foreground absolute top-2 right-2 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Hapus gambar"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
