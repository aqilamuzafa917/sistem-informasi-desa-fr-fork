import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar as CalendarIcon,
  User,
  FileText,
  Camera,
  Tag,
  X,
  ChevronLeft,
  Check,
  Save,
} from "lucide-react";
import { Label, Select, Textarea } from "flowbite-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Polygon,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import dynamic from "next/dynamic";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import axios from "axios";
import { toast } from "sonner";
import { API_CONFIG } from "../../config/api";
import { useDesa } from "@/contexts/DesaContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

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

interface MapComponentProps {
  onLocationSelect: (lat: number, lng: number) => void;
  lat?: number | null;
  lng?: number | null;
  villagePolygon?: [number, number][];
}

function MapComponent({
  onLocationSelect,
  lat,
  lng,
  villagePolygon,
}: MapComponentProps) {
  const [position, setPosition] = useState<L.LatLng | null>(
    lat && lng ? L.latLng(lat, lng) : null,
  );

  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      // Check if point is within village polygon if polygon exists
      if (villagePolygon && villagePolygon.length > 0) {
        const point = e.latlng;
        const polygon = L.polygon(villagePolygon);
        if (polygon.getBounds().contains(point)) {
          setPosition(point);
          onLocationSelect(point.lat, point.lng);
        } else {
          toast.error("Lokasi harus berada dalam batas desa");
        }
      } else {
        setPosition(e.latlng);
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return (
    <>
      {villagePolygon && villagePolygon.length > 0 && (
        <Polygon
          positions={villagePolygon}
          pathOptions={{
            color: "#3b82f6",
            fillColor: "#60a5fa",
            fillOpacity: 0.3,
            weight: 2,
          }}
        />
      )}
      {position && <Marker position={position} />}
    </>
  );
}

// Dynamic import for MapContainer to avoid SSR issues
const MapWithNoSSR = dynamic(() => Promise.resolve(MapContainer), {
  ssr: false,
});

// DateInputPicker component for tanggal_kejadian_artikel
function formatDateToInput(date: Date | undefined) {
  if (!date) return "";
  // Format: DD/MM/YYYY
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function parseInputToDate(value: string): Date | undefined {
  // Accepts DD/MM/YYYY
  if (!value) return undefined;
  const [day, month, year] = value.split("/");
  if (!day || !month || !year) return undefined;
  const date = new Date(`${year}-${month}-${day}`);
  return isNaN(date.getTime()) ? undefined : date;
}

function isValidDate(date: Date | undefined) {
  return !!date && !isNaN(date.getTime());
}

function DateInputPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(parseInputToDate(value));
  const [month, setMonth] = useState<Date | undefined>(date);
  const [inputValue, setInputValue] = useState(value);

  React.useEffect(() => {
    setInputValue(value);
    setDate(parseInputToDate(value));
    setMonth(parseInputToDate(value));
  }, [value]);

  return (
    <div className="relative flex gap-2">
      <Input
        id="tanggal_kejadian_artikel"
        name="tanggal_kejadian_artikel"
        value={inputValue}
        placeholder="DD/MM/YYYY"
        className="bg-background pr-10"
        onChange={(e) => {
          let val = e.target.value.replace(/-/g, "/"); // Ganti - jadi /
          // Jika user mengetik YYYY/MM/DD, ubah ke DD/MM/YYYY
          if (/^\d{4}\/\d{2}\/\d{2}$/.test(val)) {
            const [y, m, d] = val.split("/");
            val = `${d}/${m}/${y}`;
          }
          setInputValue(val);
          const d = parseInputToDate(val);
          if (isValidDate(d)) {
            setDate(d);
            setMonth(d);
            onChange(formatDateToInput(d));
          } else {
            onChange("");
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date-picker"
            variant="ghost"
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            tabIndex={-1}
            type="button"
          >
            <CalendarIcon size={16} />
            <span className="sr-only">Select date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            onSelect={(d: Date | undefined) => {
              setDate(d);
              setInputValue(formatDateToInput(d));
              if (isValidDate(d)) {
                onChange(formatDateToInput(d));
              } else {
                onChange("");
              }
              setOpen(false);
            }}
            disabled={(d) => d > new Date() || d < new Date("1900-01-01")}
            fromYear={1900}
            toYear={new Date().getFullYear()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default function ArtikelCreate() {
  const navigate = useNavigate();
  const { desaConfig } = useDesa();
  const [formData, setFormData] = useState<FormData>({
    penulis_artikel: "",
    judul_artikel: "",
    kategori_artikel: "Berita",
    tanggal_kejadian_artikel: "",
    location_name: "",
    latitude: null,
    longitude: null,
    status_artikel: "Resmi",
    isi_artikel: "",
    jenis_artikel: "resmi",
    media_artikel: null,
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [villagePolygon] = useState<[number, number][]>([]);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  const categories = [
    "Berita",
    "Acara",
    "Budaya",
    "Pemerintahan",
    "Pendidikan",
    "Kesehatan",
    "Lainnya",
  ];

  const steps = [
    { id: 1, title: "Informasi Dasar", icon: FileText },
    { id: 2, title: "Lokasi & Konten", icon: MapPin },
    { id: 3, title: "Media & Review", icon: Camera },
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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Token tidak ditemukan");
      const formDataToSend = new FormData();
      if (formData.media_artikel) {
        formData.media_artikel.forEach((file) => {
          formDataToSend.append("media_artikel[]", file);
        });
      }
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "media_artikel" && value !== null) {
          if (key === "tanggal_kejadian_artikel" && value) {
            // Convert DD/MM/YYYY to ISO 8601 (YYYY-MM-DDT00:00:00.000000Z)
            const [day, month, year] = value.split("/");
            if (day && month && year) {
              const isoDate =
                `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}` +
                "T00:00:00.000000Z";
              formDataToSend.append(key, isoDate);
            } else {
              formDataToSend.append(key, value.toString());
            }
          } else {
            formDataToSend.append(key, value.toString());
          }
        }
      });
      const response = await axios.post(
        `${API_CONFIG.baseURL}/api/artikel`,
        formDataToSend,
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data) {
        toast.success("Artikel berhasil dibuat!", {
          description: "Halaman akan dialihkan dalam beberapa detik",
          duration: 2000,
        });
        setTimeout(() => {
          navigate("/admin/artikel");
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

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="penulis_artikel"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <User size={16} /> Nama Penulis
                </Label>
                <Input
                  id="penulis_artikel"
                  name="penulis_artikel"
                  value={formData.penulis_artikel}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama penulis"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="judul_artikel"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <FileText size={16} /> Judul Artikel
                </Label>
                <Input
                  id="judul_artikel"
                  name="judul_artikel"
                  value={formData.judul_artikel}
                  onChange={handleInputChange}
                  placeholder="Masukkan judul artikel"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="kategori_artikel"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <Tag size={16} /> Kategori
                </Label>
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
              <div className="space-y-2">
                <Label
                  htmlFor="tanggal_kejadian"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <CalendarIcon size={16} /> Tanggal Kejadian
                </Label>
                <DateInputPicker
                  value={formData.tanggal_kejadian_artikel}
                  onChange={(val) => {
                    setFormData((prev) => ({
                      ...prev,
                      tanggal_kejadian_artikel: val,
                    }));
                  }}
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="location_name"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <MapPin size={16} /> Nama Lokasi
              </Label>
              <Input
                id="location_name"
                name="location_name"
                value={formData.location_name}
                onChange={handleInputChange}
                placeholder="Masukkan nama lokasi"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude" className="text-sm font-medium">
                  Latitude
                </Label>
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
              <div className="space-y-2">
                <Label htmlFor="longitude" className="text-sm font-medium">
                  Longitude
                </Label>
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
            <div className="h-[300px] w-full">
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
                <MapComponent
                  onLocationSelect={handleLocationSelect}
                  lat={formData.latitude}
                  lng={formData.longitude}
                  villagePolygon={villagePolygon}
                />
              </MapWithNoSSR>
            </div>
            <div className="space-y-2">
              <Label htmlFor="isi_artikel" className="text-sm font-medium">
                Isi Artikel
              </Label>
              <Textarea
                id="isi_artikel"
                name="isi_artikel"
                value={formData.isi_artikel}
                onChange={handleInputChange}
                placeholder="Tulis isi artikel di sini..."
                rows={8}
                required
                className="w-full"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label
                htmlFor="media_artikel"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Camera size={16} /> Gambar Artikel
              </Label>
              {!formData.media_artikel && (
                <Input
                  id="media_artikel"
                  name="media_artikel"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  multiple
                  required
                />
              )}
              {previewImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="group relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-32 w-full rounded-lg border-2 border-gray-200 object-cover transition-colors group-hover:border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {imageUploadError && (
                <div className="mb-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {imageUploadError}
                </div>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Maksimal 2MB per file, bisa pilih lebih dari satu
              </p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h3 className="mb-2 font-medium text-blue-900">Review Data</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Penulis:</span>{" "}
                  {formData.penulis_artikel || "Belum diisi"}
                </p>
                <p>
                  <span className="font-medium">Judul:</span>{" "}
                  {formData.judul_artikel || "Belum diisi"}
                </p>
                <p>
                  <span className="font-medium">Kategori:</span>{" "}
                  {formData.kategori_artikel}
                </p>
                <p>
                  <span className="font-medium">Lokasi:</span>{" "}
                  {formData.location_name || "Belum diisi"}
                </p>
                <p>
                  <span className="font-medium">Gambar:</span>{" "}
                  {previewImages.length} gambar
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

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
                    onClick={() => navigate("/admin/artikel")}
                    className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      Buat Artikel Baru
                    </h1>
                    <p className="text-sm text-gray-500">
                      Lengkapi informasi artikel
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-8">
              <div className="mb-8">
                {/* Progress Steps - New Compact Pills Design */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute top-6 right-0 left-0 -z-10 h-0.5 bg-gray-200">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
                        style={{
                          width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                        }}
                      />
                    </div>

                    <div className="flex justify-between">
                      {steps.map((step) => {
                        const Icon = step.icon;
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;

                        return (
                          <button
                            key={step.id}
                            onClick={() => setCurrentStep(step.id)}
                            className={`group relative flex flex-col items-center transition-all duration-300 ${
                              isActive ? "scale-105" : "hover:scale-102"
                            }`}
                          >
                            {/* Icon Circle */}
                            <div
                              className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
                                isActive
                                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
                                  : isCompleted
                                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25"
                                    : "border-2 border-gray-200 bg-white text-gray-400 group-hover:border-gray-300 group-hover:text-gray-600"
                              }`}
                            >
                              {isCompleted ? (
                                <Check size={20} className="animate-pulse" />
                              ) : (
                                <Icon size={20} />
                              )}

                              {/* Pulse animation for active step */}
                              {isActive && (
                                <div className="absolute inset-0 animate-ping rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20" />
                              )}
                            </div>

                            {/* Step Title */}
                            <span
                              className={`mt-2 text-sm font-medium transition-colors duration-300 ${
                                isActive
                                  ? "text-blue-600"
                                  : isCompleted
                                    ? "text-green-600"
                                    : "text-gray-500 group-hover:text-gray-700"
                              }`}
                            >
                              {step.title}
                            </span>

                            {/* Step Number Badge */}
                            <div
                              className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                                isActive
                                  ? "bg-blue-100 text-blue-600"
                                  : isCompleted
                                    ? "bg-green-100 text-green-600"
                                    : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {step.id}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-8">
                {/* Form Section */}
                <form
                  onSubmit={handleSubmit}
                  className="rounded-lg bg-white p-6 shadow-sm"
                >
                  <div className="space-y-6">{renderFormStep()}</div>
                  {/* Navigation Buttons */}
                  <div className="mt-6 flex justify-between border-t pt-6">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentStep(Math.max(1, currentStep - 1))
                      }
                      disabled={currentStep === 1}
                      className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Sebelumnya
                    </button>
                    <div className="flex gap-3">
                      {currentStep < 3 ? (
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentStep(Math.min(3, currentStep + 1))
                          }
                          className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
                        >
                          Selanjutnya
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                              <span>Menyimpan...</span>
                            </>
                          ) : (
                            <>
                              <Save className="h-5 w-5" />
                              <span>Simpan Data</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
