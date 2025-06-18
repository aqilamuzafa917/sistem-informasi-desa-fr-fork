import { useState } from "react";
import {
  PlusCircle,
  MapPin,
  User,
  FileText,
  Camera,
  X,
  Send,
  ArrowLeft,
  Globe,
  Tag,
  CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "flowbite-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import dynamic from "next/dynamic";
import axios from "axios";
import { toast } from "sonner";
import NavbarDesa from "@/components/NavbarDesa";
import FooterDesa from "@/components/FooterDesa";
import { API_CONFIG } from "../config/api";
import { useDesa } from "@/contexts/DesaContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form as RHFForm,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar as RHFCalendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { id } from "date-fns/locale";

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
  tanggal_kejadian_artikel: string;
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

// Tambahkan zod schema untuk tanggal kejadian
const DateSchema = z.object({
  tanggal_kejadian: z.date({
    required_error: "Tanggal kejadian diperlukan.",
  }),
});

export default function ArtikelCreatePage() {
  const { desaConfig } = useDesa();
  const [formData, setFormData] = useState<FormData>({
    penulis_artikel: "",
    judul_artikel: "",
    kategori_artikel: "Berita",
    tanggal_kejadian_artikel: "",
    location_name: "",
    latitude: null,
    longitude: null,
    status_artikel: "",
    isi_artikel: "",
    jenis_artikel: "",
    media_artikel: null,
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  const categories = [
    { value: "Berita", icon: "📰", color: "bg-blue-100 text-blue-800" },
    { value: "Acara", icon: "🎉", color: "bg-purple-100 text-purple-800" },
    { value: "Budaya", icon: "🎭", color: "bg-pink-100 text-pink-800" },
    { value: "Pemerintahan", icon: "🏛️", color: "bg-gray-100 text-gray-800" },
    { value: "Pendidikan", icon: "📚", color: "bg-green-100 text-green-800" },
    { value: "Kesehatan", icon: "⚕️", color: "bg-red-100 text-red-800" },
    { value: "Lainnya", icon: "📝", color: "bg-yellow-100 text-yellow-800" },
  ];

  const steps = [
    { number: 1, title: "Informasi Dasar", icon: FileText },
    { number: 2, title: "Lokasi & Waktu", icon: MapPin },
    { number: 3, title: "Konten & Media", icon: Camera },
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
      const validFiles: File[] = [];
      for (const file of newFiles) {
        if (file.size > 2 * 1024 * 1024) {
          setImageUploadError("Ukuran file maksimal 2MB");
          return;
        }
        validFiles.push(file);
      }
      setImageUploadError(null);
      setFormData((prev) => ({
        ...prev,
        media_artikel: prev.media_artikel
          ? [...prev.media_artikel, ...validFiles]
          : validFiles,
      }));
      const newPreviewUrls = validFiles.map((file) =>
        URL.createObjectURL(file),
      );
      setPreviewImages((prev) => [...prev, ...newPreviewUrls]);
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
      URL.revokeObjectURL(newPreviews[index]);
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

  // Tambahkan form react-hook-form untuk tanggal kejadian
  const dateForm = useForm<z.infer<typeof DateSchema>>({
    resolver: zodResolver(DateSchema),
    defaultValues: {
      tanggal_kejadian: formData.tanggal_kejadian_artikel
        ? new Date(formData.tanggal_kejadian_artikel)
        : undefined,
    },
  });

  // Sinkronisasi perubahan tanggal ke formData utama
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        tanggal_kejadian_artikel: format(date, "yyyy-MM-dd"),
      }));
      dateForm.setValue("tanggal_kejadian", date, { shouldValidate: true });
      setDatePopoverOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      if (formData.media_artikel) {
        formData.media_artikel.forEach((file) => {
          formDataToSend.append("media_artikel[]", file);
        });
      }

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "media_artikel" && value !== null) {
          formDataToSend.append(key, value.toString());
        }
      });

      const response = await axios.post(
        `${API_CONFIG.baseURL}/api/publik/artikel`,
        formDataToSend,
        {
          headers: {
            ...API_CONFIG.headers,
          },
        },
      );

      if (response.data) {
        toast.success("Artikel berhasil dibuat!", {
          description:
            "Artikel Anda akan tayang setelah di moderasi admin atau disetujui admin",
          duration: 5000,
        });

        setTimeout(() => {
          window.location.href = "/artikeldesa";
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      if (axios.isAxiosError(error) && error.response?.data?.errors) {
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

  const selectedLocation =
    formData.latitude && formData.longitude
      ? { lat: formData.latitude, lng: formData.longitude }
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <NavbarDesa />

      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => (window.location.href = "/artikeldesa")}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Buat Artikel Baru
                </h1>
                <p className="text-gray-600">
                  Bagikan berita dan informasi dengan warga desa
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`flex items-center space-x-2 rounded-lg px-3 py-2 transition-all ${
                    currentStep === step.number
                      ? "bg-indigo-100 text-indigo-700"
                      : currentStep > step.number
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <step.icon className="h-4 w-4" />
                  <span className="hidden text-sm font-medium sm:block">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="animate-in slide-in-from-right space-y-6 rounded-2xl bg-white p-8 shadow-xl">
              <div className="mb-6 flex items-center space-x-3">
                <div className="rounded-full bg-indigo-100 p-3">
                  <FileText className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Informasi Dasar
                  </h2>
                  <p className="text-gray-600">
                    Mulai dengan informasi dasar artikel Anda
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <User className="h-4 w-4" />
                    <span>Nama Penulis</span>
                  </label>
                  <Input
                    name="penulis_artikel"
                    value={formData.penulis_artikel}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama penulis"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <FileText className="h-4 w-4" />
                    <span>Judul Artikel</span>
                  </label>
                  <Input
                    name="judul_artikel"
                    value={formData.judul_artikel}
                    onChange={handleInputChange}
                    placeholder="Tulis judul artikel yang menarik"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Tag className="h-4 w-4" />
                  <span>Kategori Artikel</span>
                </label>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          kategori_artikel: category.value,
                        }))
                      }
                      className={`rounded-xl border-2 p-4 transition-all hover:scale-105 ${
                        formData.kategori_artikel === category.value
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="mb-2 text-2xl">{category.icon}</div>
                      <div className="text-sm font-medium">
                        {category.value}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <span>Selanjutnya</span>
                  <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Location & Time */}
          {currentStep === 2 && (
            <div className="animate-in slide-in-from-right space-y-6 rounded-2xl bg-white p-8 shadow-xl">
              <div className="mb-6 flex items-center space-x-3">
                <div className="rounded-full bg-green-100 p-3">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Lokasi & Waktu
                  </h2>
                  <p className="text-gray-600">
                    Tentukan kapan dan dimana peristiwa terjadi
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Globe className="h-4 w-4" />
                    <span>Nama Lokasi</span>
                  </label>
                  <Input
                    name="location_name"
                    value={String(formData.location_name)}
                    onChange={handleInputChange}
                    placeholder="Contoh: Balai Desa, Lapangan Desa"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <RHFForm {...dateForm}>
                    <FormField
                      control={dateForm.control}
                      name="tanggal_kejadian"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Tanggal Kejadian</FormLabel>
                          <Popover
                            open={datePopoverOpen}
                            onOpenChange={setDatePopoverOpen}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                  type="button"
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: id })
                                  ) : (
                                    <span>Pilih tanggal</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <RHFCalendar
                                mode="single"
                                selected={field.value}
                                onSelect={handleDateChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                captionLayout="dropdown"
                                locale={id}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Pilih tanggal kejadian peristiwa (dalam Bahasa
                            Indonesia).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </RHFForm>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <MapPin className="h-4 w-4" />
                  <span>Pilih Lokasi di Peta</span>
                </label>
                <div className="h-[400px] w-full overflow-hidden rounded-xl">
                  <MapWithNoSSR
                    center={
                      formData.latitude && formData.longitude
                        ? [formData.latitude, formData.longitude]
                        : desaConfig?.center_map
                    }
                    zoom={15}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker onLocationSelect={handleLocationSelect} />
                  </MapWithNoSSR>
                </div>

                {selectedLocation && (
                  <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                    <div className="flex items-center space-x-2 text-green-800">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">Lokasi Terpilih:</span>
                    </div>
                    <div className="mt-2 text-sm text-green-700">
                      Latitude: {selectedLocation.lat.toFixed(6)}
                      <br />
                      Longitude: {selectedLocation.lng.toFixed(6)}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <span>Kembali</span>
                </Button>
                <Button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <span>Selanjutnya</span>
                  <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Content & Media */}
          {currentStep === 3 && (
            <div className="animate-in slide-in-from-right space-y-6 rounded-2xl bg-white p-8 shadow-xl">
              <div className="mb-6 flex items-center space-x-3">
                <div className="rounded-full bg-purple-100 p-3">
                  <Camera className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Konten & Media
                  </h2>
                  <p className="text-gray-600">
                    Tulis artikel dan tambahkan gambar pendukung
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <FileText className="h-4 w-4" />
                  <span>Isi Artikel</span>
                </label>
                <Textarea
                  name="isi_artikel"
                  value={formData.isi_artikel}
                  onChange={handleInputChange}
                  rows={12}
                  placeholder="Tulis artikel Anda di sini... Ceritakan dengan detail dan menarik agar pembaca tertarik untuk membaca hingga selesai."
                  required
                />
                <div className="text-right text-sm text-gray-500">
                  {formData.isi_artikel.length} karakter
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Camera className="h-4 w-4" />
                  <span>Gambar Artikel</span>
                </label>

                <div className="rounded-xl border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-purple-400">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    multiple
                    className="hidden"
                    id="media_artikel"
                  />
                  <label
                    htmlFor="media_artikel"
                    className="flex cursor-pointer flex-col items-center space-y-4"
                  >
                    <div className="rounded-full bg-purple-100 p-4">
                      <PlusCircle className="h-8 w-8 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        Pilih Gambar
                      </p>
                      <p className="text-gray-600">
                        atau seret dan lepas gambar di sini
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        Maksimal 2MB per file, bisa pilih lebih dari satu
                      </p>
                    </div>
                  </label>
                </div>

                {imageUploadError && (
                  <div className="mb-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    {imageUploadError}
                  </div>
                )}

                {previewImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="group relative">
                        <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <span>Kembali</span>
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${
                    isSubmitting
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-purple-600 hover:scale-105 hover:bg-purple-700"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      <span>Publikasikan Artikel</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>

      <FooterDesa />
    </div>
  );
}
