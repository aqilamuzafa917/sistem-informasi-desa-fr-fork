import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import axios from "axios";
import { API_CONFIG } from "../../config/api";
import {
  Plus,
  X,
  ChevronLeft,
  Wheat,
  Factory,
  Mountain,
  Save,
  AlertCircle,
  Tag,
  Navigation,
} from "lucide-react";
import { PiFarm } from "react-icons/pi";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useDesa } from "@/contexts/DesaContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Fix for default marker icon in Leaflet
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

const potensiCategoryOptions = [
  {
    value: "pertanian",
    label: "Pertanian",
    icon: Wheat,
    color: "bg-green-100 text-green-800 border-green-200",
  },
  {
    value: "peternakan",
    label: "Peternakan",
    icon: PiFarm,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    value: "industri",
    label: "Industri",
    icon: Factory,
    color: "bg-red-100 text-red-800 border-red-200",
  },
  {
    value: "wisata",
    label: "Wisata",
    icon: Mountain,
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
];

const MapWithNoSSR = dynamic(() => Promise.resolve(MapContainer), {
  ssr: false,
});

function MapComponent({
  onLocationSelect,
  lat,
  lng,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
  lat?: number | null;
  lng?: number | null;
}) {
  const [position, setPosition] = useState<L.LatLng | null>(
    lat && lng ? L.latLng(lat, lng) : null,
  );
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return position ? <Marker position={position} /> : null;
}

export default function PetaPotensiCreate() {
  const navigate = useNavigate();
  const { desaConfig } = useDesa();
  const [form, setForm] = useState({
    nama: "",
    kategori: "pertanian",
    alamat: "",
    tags: [] as string[],
    lat: null as number | null,
    lon: null as number | null,
    tagInput: "",
    artikel_id: null as number | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [artikelOptions, setArtikelOptions] = useState<
    { id: number; judul: string }[]
  >([]);
  const [isLoadingArtikel, setIsLoadingArtikel] = useState(true);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    const tag = form.tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag], tagInput: "" }));
    }
  };

  const handleRemoveTag = (tag: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setForm((prev) => ({ ...prev, lat, lon: lng }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.nama ||
      !form.kategori ||
      !form.lat ||
      !form.lon ||
      !form.alamat
    ) {
      toast.error("Nama, kategori, alamat, dan koordinat wajib diisi");
      return;
    }
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Token tidak ditemukan. Silakan login kembali.");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        nama: form.nama,
        kategori: form.kategori,
        lat: form.lat,
        lon: form.lon,
        alamat: form.alamat,
        tags: form.tags,
        ...(form.artikel_id ? { artikel_id: form.artikel_id } : {}),
      };
      await axios.post(`${API_CONFIG.baseURL}/api/map/poi`, payload, {
        headers: {
          ...API_CONFIG.headers,
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Potensi berhasil ditambahkan");
      setTimeout(() => {
        window.location.href = "/admin/potensi";
      }, 1200);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error("Gagal menambah potensi", {
          description: err.response?.data?.message || err.message,
        });
      } else {
        toast.error("Gagal menambah potensi", {
          description: err instanceof Error ? err.message : String(err),
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = potensiCategoryOptions.find(
    (opt) => opt.value === form.kategori,
  );
  const isFormValid = form.nama && form.kategori && form.lat && form.lon;

  useEffect(() => {
    type ArtikelResponse = {
      id_artikel: number;
      judul_artikel: string;
      status_artikel: string;
    };
    setIsLoadingArtikel(true);
    const token = localStorage.getItem("authToken");
    axios
      .get(`${API_CONFIG.baseURL}/api/artikel`, {
        headers: {
          ...API_CONFIG.headers,
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      })
      .then((res) => {
        const responseData = res.data?.data;
        const data: ArtikelResponse[] = Array.isArray(responseData)
          ? responseData
          : responseData?.data || [];
        const artikelDisetujui = data.filter(
          (a) => a.status_artikel?.toLowerCase() === "disetujui",
        );
        setArtikelOptions(
          artikelDisetujui.map((a) => ({
            id: a.id_artikel,
            judul: a.judul_artikel,
          })),
        );
      })
      .catch(() => {
        toast.error("Gagal mengambil data artikel. Cek koneksi ke backend.");
        setArtikelOptions([]);
      })
      .finally(() => {
        setIsLoadingArtikel(false);
      });
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50/20">
          <div className="sticky top-0 z-10 border-b border-white/60 bg-white/80 backdrop-blur-lg">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/admin/potensi")}
                  className="h-10 w-10 rounded-xl p-0 hover:bg-gray-100/80"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-3">
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      Tambah Potensi Desa
                    </h1>
                    <p className="text-sm text-gray-500">
                      Lengkapi informasi potensi untuk pemetaan desa
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="border-0 shadow-sm ring-1 ring-gray-200/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Wheat className="h-5 w-5 text-green-600" />
                    Informasi Dasar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="nama"
                        className="text-sm font-medium text-gray-700"
                      >
                        Nama Potensi *
                      </Label>
                      <Input
                        id="nama"
                        name="nama"
                        value={form.nama}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("nama")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Masukkan nama potensi"
                        className={`transition-all duration-200 ${
                          focusedField === "nama"
                            ? "border-green-300 ring-2 ring-green-500/20"
                            : ""
                        }`}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="kategori"
                        className="text-sm font-medium text-gray-700"
                      >
                        Kategori *
                      </Label>
                      <div className="relative">
                        <select
                          id="kategori"
                          name="kategori"
                          value={form.kategori}
                          onChange={handleInputChange}
                          className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm transition-all duration-200 hover:border-gray-400 focus:border-green-300 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                        >
                          {potensiCategoryOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          {selectedCategory && (
                            <selectedCategory.icon className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="alamat"
                      className="text-sm font-medium text-gray-700"
                    >
                      Alamat (Opsional)
                    </Label>
                    <Textarea
                      id="alamat"
                      name="alamat"
                      value={form.alamat}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("alamat")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Masukkan alamat lengkap potensi"
                      rows={3}
                      className={`resize-none transition-all duration-200 ${
                        focusedField === "alamat"
                          ? "border-green-300 ring-2 ring-green-500/20"
                          : ""
                      }`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="artikel_id"
                      className="text-sm font-medium text-gray-700"
                    >
                      Artikel Terkait (Opsional)
                    </Label>
                    {isLoadingArtikel ? (
                      <div className="h-10 w-full animate-pulse rounded-md bg-gray-100" />
                    ) : (
                      <Select
                        value={form.artikel_id ? String(form.artikel_id) : ""}
                        onValueChange={(val) =>
                          setForm((prev) => ({
                            ...prev,
                            artikel_id: val ? Number(val) : null,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih artikel (opsional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {artikelOptions.map((a) => (
                            <SelectItem key={a.id} value={String(a.id)}>
                              {a.judul}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm ring-1 ring-gray-200/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Tag className="h-5 w-5 text-green-600" />
                    Tags & Label
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {form.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {form.tags.map((tag) => (
                        <Badge
                          key={tag}
                          className="flex items-center gap-1.5 border border-green-200 bg-green-50 text-green-700 transition-colors hover:bg-green-100"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 rounded-full p-0.5 transition-colors hover:bg-green-200"
                          >
                            <X size={12} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={form.tagInput}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          tagInput: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Tambahkan tag (tekan Enter atau klik Tambah)"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      variant="outline"
                      className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                    >
                      <Plus size={16} className="mr-1" />
                      Tambah
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm ring-1 ring-gray-200/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Navigation className="h-5 w-5 text-orange-600" />
                    Lokasi & Koordinat
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="lat"
                        className="text-sm font-medium text-gray-700"
                      >
                        Latitude *
                      </Label>
                      <div className="relative">
                        <Navigation className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="lat"
                          name="lat"
                          type="number"
                          step="any"
                          value={form.lat ?? ""}
                          onChange={handleInputChange}
                          placeholder="Klik pada peta"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="lon"
                        className="text-sm font-medium text-gray-700"
                      >
                        Longitude *
                      </Label>
                      <div className="relative">
                        <Navigation className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="lon"
                          name="lon"
                          type="number"
                          step="any"
                          value={form.lon ?? ""}
                          onChange={handleInputChange}
                          placeholder="Klik pada peta"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-gray-700">
                        Pilih Lokasi pada Peta
                      </Label>
                      {!form.lat || !form.lon ? (
                        <div className="flex items-center gap-1 text-xs text-amber-600">
                          <AlertCircle className="h-3 w-3" />
                          Klik pada peta untuk menentukan lokasi
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <Navigation className="h-3 w-3" />
                          Lokasi telah dipilih
                        </div>
                      )}
                    </div>

                    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                      <div className="h-100 w-full bg-gray-100">
                        <MapWithNoSSR
                          center={
                            form.lat && form.lon
                              ? [form.lat, form.lon]
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
                            lat={form.lat}
                            lng={form.lon}
                          />
                        </MapWithNoSSR>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/potensi")}
                  disabled={isSubmitting}
                  className="min-w-24"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
                  className="min-w-32 bg-gradient-to-r from-green-600 to-green-700 shadow-sm hover:from-green-700 hover:to-green-800"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Menyimpan...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Simpan Potensi
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
