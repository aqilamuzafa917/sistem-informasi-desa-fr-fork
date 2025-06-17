import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import axios from "axios";
import { toast } from "sonner";
import { API_CONFIG } from "../../config/api";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import dynamic from "next/dynamic";
import {
  MapPin,
  Building2,
  Target,
  Eye,
  Users,
  Upload,
  Map,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const PolygonEditor = dynamic(
  () => import("@/components/profil/PolygonEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-full animate-pulse rounded-lg bg-gray-200"></div>
    ),
  },
);

interface DesaProfil {
  id: number;
  nama_desa: string;
  sejarah: string;
  visi: string;
  misi: string;
  alamat_kantor: string;
  struktur_organisasi: Array<{
    path: string;
    type: string;
    name: string;
    url: string;
  }>;
  batas_wilayah: {
    utara: string;
    timur: string;
    selatan: string;
    barat: string;
  };
  luas_desa: number;
  social_media: Array<{
    platform: string;
    url: string;
    username: string;
  }>;
  polygon_desa: [number, number][];
}

export default function ProfilPages() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profil, setProfil] = useState<DesaProfil>({
    id: 1,
    nama_desa: "",
    sejarah: "",
    visi: "",
    misi: "",
    alamat_kantor: "",
    struktur_organisasi: [],
    batas_wilayah: {
      utara: "",
      timur: "",
      selatan: "",
      barat: "",
    },
    luas_desa: 0,
    social_media: [],
    polygon_desa: [],
  });
  const [activeSection, setActiveSection] = useState("umum");
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const sections = [
    { id: "umum", label: "Informasi Umum", icon: Building2 },
    { id: "visi-misi", label: "Visi & Misi", icon: Target },
    { id: "lokasi", label: "Lokasi & Wilayah", icon: MapPin },
    { id: "struktur", label: "Struktur Organisasi", icon: Users },
    { id: "peta", label: "Peta Desa", icon: Map },
  ];

  const fetchProfil = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_CONFIG.baseURL}/api/profil-desa/1`,
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Transform polygon coordinates from [lng, lat] to [lat, lng]
      const transformedData = {
        ...response.data,
        polygon_desa:
          response.data.polygon_desa?.map((coord: [number, number]) => [
            coord[1],
            coord[0],
          ]) || [],
      };

      setProfil(transformedData);
    } catch (error) {
      toast.error("Gagal mengambil data profil desa", {
        duration: 3000,
      });
      console.error("Error fetching profil:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("authToken");

      // Transform polygon coordinates back to [lng, lat] format for API
      const dataToSave = {
        ...profil,
        polygon_desa: profil.polygon_desa.map((coord: [number, number]) => [
          coord[1],
          coord[0],
        ]),
      };

      // Create a new object without struktur_organisasi
      const dataWithoutStruktur = Object.fromEntries(
        Object.entries(dataToSave).filter(
          ([key]) => key !== "struktur_organisasi",
        ),
      );

      await axios.patch(
        `${API_CONFIG.baseURL}/api/profil-desa/1`,
        dataWithoutStruktur,
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setHasChanges(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      toast.success("Profil desa berhasil disimpan", {
        duration: 2000,
      });

      setTimeout(() => {
        fetchProfil();
      }, 1000);
    } catch (error) {
      toast.error("Gagal menyimpan profil desa", {
        duration: 3000,
      });
      console.error("Error saving profil:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (
    field: keyof DesaProfil,
    value: string | number,
  ) => {
    setProfil((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleBatasWilayahChange = (
    field: keyof typeof profil.batas_wilayah,
    value: string,
  ) => {
    setProfil((prev) => ({
      ...prev,
      batas_wilayah: {
        ...prev.batas_wilayah,
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Add file validation
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    for (const file of Array.from(files)) {
      if (file.size > maxSize) {
        toast.error("File terlalu besar. Maksimal ukuran file adalah 2MB", {
          duration: 3000,
        });
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "Format file tidak didukung. Gunakan file JPG, JPEG, atau PNG",
          {
            duration: 3000,
          },
        );
        return;
      }
    }

    try {
      setIsUploading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Token autentikasi tidak ditemukan");
      }

      const formData = new FormData();
      formData.append("_method", "PATCH");
      Array.from(files).forEach((file) => {
        formData.append("struktur_organisasi[]", file);
      });

      const response = await axios.post(
        `${API_CONFIG.baseURL}/api/profil-desa/1`,
        formData,
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setProfil((prev) => ({
        ...prev,
        struktur_organisasi: response.data.struktur_organisasi,
      }));
      setHasChanges(true);

      toast.success("File berhasil diunggah", {
        duration: 2000,
      });
    } catch (error) {
      console.error("Error uploading file:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage =
            error.response.data?.message ||
            error.response.data?.error ||
            "Gagal mengunggah file";
          toast.error(errorMessage, {
            duration: 3000,
          });
        } else if (error.request) {
          toast.error(
            "Tidak dapat terhubung ke server. Silakan coba lagi nanti.",
            {
              duration: 3000,
            },
          );
        } else {
          toast.error(
            error.message || "Terjadi kesalahan saat mengunggah file",
            {
              duration: 3000,
            },
          );
        }
      } else if (error instanceof Error) {
        toast.error(error.message || "Terjadi kesalahan saat mengunggah file", {
          duration: 3000,
        });
      } else {
        toast.error("Terjadi kesalahan yang tidak diketahui", {
          duration: 3000,
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handlePolygonChange = (polygon: [number, number][]) => {
    setProfil((prev) => ({
      ...prev,
      polygon_desa: polygon,
    }));
    setHasChanges(true);
  };

  useEffect(() => {
    fetchProfil();
  }, []);

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="space-y-4 text-center">
              <div className="relative">
                <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                <div
                  className="absolute inset-0 mx-auto h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-indigo-400"
                  style={{ animationDelay: "0.3s" }}
                ></div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-700">
                  Memuat Data Profil Desa
                </h3>
                <p className="text-sm text-gray-500">
                  Mohon tunggu sebentar...
                </p>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          {/* Enhanced Header */}
          <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md">
            <div className="px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h1 className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-3xl font-bold text-transparent">
                    Profil Desa
                  </h1>
                  <p className="flex items-center gap-2 text-gray-600">
                    Kelola informasi dan profil desa Anda
                  </p>
                </div>

                {/* Save Button with Status */}
                <div className="flex items-center gap-3">
                  {showSuccess && (
                    <div className="animate-in slide-in-from-right flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      Data berhasil disimpan
                    </div>
                  )}

                  {hasChanges && !showSuccess && (
                    <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                      <AlertCircle className="h-4 w-4" />
                      Ada perubahan belum disimpan
                    </div>
                  )}

                  <button
                    onClick={handleSave}
                    disabled={isSaving || !hasChanges}
                    className="flex transform items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Simpan Perubahan
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Tab Navigation */}
          <div className="mt-4 -mb-4 px-8 pb-0">
            <div className="rounded-2xl border border-gray-200 bg-white/60 shadow-lg backdrop-blur-sm">
              <div className="scrollbar-hide flex justify-center overflow-x-auto">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`relative flex min-w-fit items-center gap-3 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                        activeSection === section.id
                          ? "text-blue-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{section.label}</span>

                      {/* Active indicator */}
                      {activeSection === section.id && (
                        <div className="animate-in slide-in-from-left absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 duration-300" />
                      )}

                      {/* Separator */}
                      {index < sections.length - 1 && (
                        <div className="absolute top-1/2 right-0 h-6 w-px -translate-y-1/2 bg-gray-200" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Enhanced Main Content */}
          <div className="p-8">
            <div className="mx-auto max-w-6xl">
              {/* Informasi Umum */}
              {activeSection === "umum" && (
                <div className="animate-in fade-in slide-in-from-bottom space-y-8 duration-500">
                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white/70 shadow-xl backdrop-blur-sm">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-6 w-6 text-white" />
                        <h2 className="text-xl font-bold text-white">
                          Informasi Umum Desa
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-6 p-8">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Nama Desa
                        </label>
                        <input
                          type="text"
                          value={profil.nama_desa}
                          onChange={(e) =>
                            handleInputChange("nama_desa", e.target.value)
                          }
                          className="w-full rounded-xl border border-gray-300 bg-white/80 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                          placeholder="Masukkan nama desa"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Sejarah Desa
                        </label>
                        <textarea
                          value={profil.sejarah}
                          onChange={(e) =>
                            handleInputChange("sejarah", e.target.value)
                          }
                          rows={8}
                          className="w-full resize-none rounded-xl border border-gray-300 bg-white/80 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                          placeholder="Ceritakan sejarah singkat desa..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Visi & Misi */}
              {activeSection === "visi-misi" && (
                <div className="animate-in fade-in slide-in-from-bottom space-y-8 duration-500">
                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white/70 shadow-xl backdrop-blur-sm">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
                      <div className="flex items-center gap-3">
                        <Target className="h-6 w-6 text-white" />
                        <h2 className="text-xl font-bold text-white">
                          Visi & Misi Desa
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-8 p-8">
                      <div className="space-y-2">
                        <label className="block flex items-center gap-2 text-sm font-semibold text-gray-700">
                          <Eye className="h-4 w-4" />
                          Visi Desa
                        </label>
                        <textarea
                          value={profil.visi}
                          onChange={(e) =>
                            handleInputChange("visi", e.target.value)
                          }
                          rows={4}
                          className="w-full resize-none rounded-xl border border-gray-300 bg-white/80 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-emerald-500"
                          placeholder="Tuliskan visi desa..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block flex items-center gap-2 text-sm font-semibold text-gray-700">
                          <Target className="h-4 w-4" />
                          Misi Desa
                        </label>
                        <textarea
                          value={profil.misi}
                          onChange={(e) =>
                            handleInputChange("misi", e.target.value)
                          }
                          rows={8}
                          className="w-full resize-none rounded-xl border border-gray-300 bg-white/80 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-emerald-500"
                          placeholder="Tuliskan misi desa (gunakan numbering 1. 2. 3. untuk setiap poin)..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lokasi & Wilayah */}
              {activeSection === "lokasi" && (
                <div className="animate-in fade-in slide-in-from-bottom space-y-8 duration-500">
                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white/70 shadow-xl backdrop-blur-sm">
                    <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-6 w-6 text-white" />
                        <h2 className="text-xl font-bold text-white">
                          Informasi Lokasi & Wilayah
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-8 p-8">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Alamat Kantor Desa
                          </label>
                          <input
                            type="text"
                            value={profil.alamat_kantor}
                            onChange={(e) =>
                              handleInputChange("alamat_kantor", e.target.value)
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white/80 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                            placeholder="Alamat lengkap kantor desa"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Luas Desa (Hektar)
                          </label>
                          <input
                            type="number"
                            value={profil.luas_desa}
                            onChange={(e) =>
                              handleInputChange(
                                "luas_desa",
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white/80 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="border-b pb-2 text-lg font-semibold text-gray-800">
                          Batas Wilayah Desa
                        </h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          {Object.entries(profil.batas_wilayah).map(
                            ([direction, value]) => (
                              <div key={direction} className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 capitalize">
                                  Batas {direction}
                                </label>
                                <input
                                  type="text"
                                  value={value}
                                  onChange={(e) =>
                                    handleBatasWilayahChange(
                                      direction as keyof typeof profil.batas_wilayah,
                                      e.target.value,
                                    )
                                  }
                                  className="w-full rounded-xl border border-gray-300 bg-white/80 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                                  placeholder={`Sebelah ${direction} berbatasan dengan...`}
                                />
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Struktur Organisasi */}
              {activeSection === "struktur" && (
                <div className="animate-in fade-in slide-in-from-bottom space-y-8 duration-500">
                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white/70 shadow-xl backdrop-blur-sm">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                      <div className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-white" />
                        <h2 className="text-xl font-bold text-white">
                          Struktur Organisasi
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-6 p-8">
                      <div className="space-y-4">
                        <label className="block text-sm font-semibold text-gray-700">
                          Upload Bagan Struktur Organisasi
                        </label>

                        <div className="rounded-xl border-2 border-dashed border-gray-300 p-8 text-center transition-colors duration-200 hover:border-purple-400">
                          <div className="space-y-4">
                            <div className="flex justify-center">
                              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                                <Upload className="h-8 w-8 text-purple-600" />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h3 className="text-lg font-semibold text-gray-800">
                                Upload File Gambar
                              </h3>
                              <p className="text-sm text-gray-600">
                                Pilih satu atau lebih file gambar (.jpg, .png,
                                .jpeg) maksimal 2MB
                              </p>
                            </div>

                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileUpload}
                                disabled={isUploading}
                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                              />
                              <button
                                disabled={isUploading}
                                className="transform rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:from-purple-700 hover:to-pink-700 active:scale-95 disabled:opacity-50"
                              >
                                {isUploading ? (
                                  <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Mengupload...
                                  </div>
                                ) : (
                                  "Pilih File"
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {profil.struktur_organisasi.length > 0 && (
                          <div className="space-y-4">
                            {profil.struktur_organisasi.map((file, index) => (
                              <div
                                key={index}
                                className="rounded-xl border border-green-200 bg-green-50 p-4"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <div>
                                      <p className="text-sm font-medium text-green-800">
                                        File berhasil diupload
                                      </p>
                                      <p className="text-xs text-green-600">
                                        {file.name}
                                      </p>
                                    </div>
                                  </div>
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-green-600 hover:text-green-800 hover:underline"
                                  >
                                    Lihat File
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Peta Desa */}
              {activeSection === "peta" && (
                <div className="animate-in fade-in slide-in-from-bottom space-y-8 duration-500">
                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white/70 shadow-xl backdrop-blur-sm">
                    <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6">
                      <div className="flex items-center gap-3">
                        <Map className="h-6 w-6 text-white" />
                        <h2 className="text-xl font-bold text-white">
                          Peta Batas Wilayah Desa
                        </h2>
                      </div>
                    </div>

                    <div className="p-8">
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                          Klik pada peta untuk menandai titik-titik batas
                          wilayah desa Anda. Hubungkan titik-titik tersebut
                          untuk membentuk area wilayah desa.
                        </p>

                        <div className="rounded-xl bg-gray-100 p-8">
                          <PolygonEditor
                            initialPolygon={profil.polygon_desa}
                            onPolygonChange={handlePolygonChange}
                            scrollWheelZoom={false}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
