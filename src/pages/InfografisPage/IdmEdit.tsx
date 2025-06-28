import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { API_CONFIG } from "@/config/api";
import { toast } from "sonner";
import { Save, ChevronLeft, AlertCircle } from "lucide-react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";

interface IDMVariable {
  id: number;
  indikator_idm: string;
  skor: number;
  keterangan: string;
  kegiatan: string;
  nilai_plus: number;
  pelaksana: string[];
  kategori: string;
  tahun: number;
  created_at: string;
  updated_at: string;
}

interface IdmFormData {
  indikator_idm: string;
  skor: number;
  keterangan: string;
  kegiatan: string;
  nilai_plus: number;
  pelaksana: string[];
  kategori: string;
  tahun: number;
}

const pelaksanaOptions: Record<
  string,
  Array<{ value: string; icon: string }>
> = {
  IKS: [
    { value: "Kepala Desa", icon: "👨‍💼" },
    { value: "Sekretaris Desa", icon: "📋" },
    { value: "Kepala Dusun", icon: "🏘️" },
    { value: "Kader PKK", icon: "👩‍👩‍👧‍👦" },
    { value: "Karang Taruna", icon: "🎯" },
    { value: "Tokoh Masyarakat", icon: "👥" },
  ],
  IKE: [
    { value: "Kepala Desa", icon: "👨‍💼" },
    { value: "Kasi Kesejahteraan", icon: "💰" },
    { value: "BUMDes", icon: "🏢" },
    { value: "Kelompok Tani", icon: "🌾" },
    { value: "UMKM", icon: "🏪" },
    { value: "Koperasi Desa", icon: "🤝" },
  ],
  IKL: [
    { value: "Kepala Desa", icon: "👨‍💼" },
    { value: "Kasi Pemerintahan", icon: "🏛️" },
    { value: "Kader Lingkungan", icon: "🌱" },
    { value: "LPM", icon: "🏛️" },
    { value: "Satgas Lingkungan", icon: "🛡️" },
    { value: "Pokdarwis", icon: "🏞️" },
  ],
};

const skorOptions = [
  {
    value: "0",
    label: "0",
    description: "Tidak ada",
    color: "bg-red-100 text-red-800",
  },
  {
    value: "1",
    label: "1",
    description: "Sangat rendah",
    color: "bg-orange-100 text-orange-800",
  },
  {
    value: "2",
    label: "2",
    description: "Rendah",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "3",
    label: "3",
    description: "Sedang",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "4",
    label: "4",
    description: "Tinggi",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "5",
    label: "5",
    description: "Sangat tinggi",
    color: "bg-emerald-100 text-emerald-800",
  },
];

const IdmEdit: React.FC = () => {
  const navigate = useNavigate();
  const { variabelIDM } = useParams<{ variabelIDM: string }>();

  const [formData, setFormData] = useState<IdmFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mapping warna kategori
  const kategoriColor: Record<
    string,
    { card: string; icon: string; title: string }
  > = {
    IKS: {
      card: "border-green-100 bg-gradient-to-r from-green-50 to-emerald-50",
      icon: "bg-green-100 text-green-600",
      title: "text-green-900",
    },
    IKE: {
      card: "border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50",
      icon: "bg-purple-100 text-purple-600",
      title: "text-purple-900",
    },
    IKL: {
      card: "border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50",
      icon: "bg-orange-100 text-orange-600",
      title: "text-orange-900",
    },
  };
  const kategori = formData?.kategori || "IKS";
  const color = kategoriColor[kategori] || kategoriColor.IKS;
  const currentPelaksanaOptions =
    pelaksanaOptions[kategori] || pelaksanaOptions.IKS;

  // Step 1: Get data IDM
  useEffect(() => {
    const fetchIdmData = async () => {
      if (!variabelIDM) {
        setError("ID variabel IDM tidak ditemukan");
        setIsLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("Token tidak ditemukan. Silakan login kembali.");
          navigate("/");
          return;
        }

        const response = await axios.get<{ variabel_idm: IDMVariable }>(
          `${API_CONFIG.baseURL}/api/variabel-idm/edit/${variabelIDM}`,
          {
            headers: {
              ...API_CONFIG.headers,
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // Ambil data dari response.data.variabel_idm
        const data = response.data.variabel_idm;
        console.log("API Response Data:", data);

        // Convert to form data format
        const formDataConverted: IdmFormData = {
          indikator_idm: data.indikator_idm || "",
          skor: data.skor || 0,
          keterangan: data.keterangan || "",
          kegiatan: data.kegiatan || "",
          nilai_plus: data.nilai_plus || 0,
          pelaksana: data.pelaksana || [],
          kategori: data.kategori || "",
          tahun: data.tahun || new Date().getFullYear(),
        };

        setFormData(formDataConverted);
        console.log("Converted Form Data:", formDataConverted);
        setError(null);
      } catch (error) {
        console.error("Error fetching IDM data:", error);
        if (error instanceof AxiosError && error.response?.data?.message) {
          setError(`Gagal mengambil data: ${error.response.data.message}`);
        } else {
          setError("Gagal mengambil data IDM");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdmData();
  }, [variabelIDM, navigate]);

  const handleFieldChange = (
    field: keyof IdmFormData,
    value: string | number,
  ) => {
    if (!formData) return;

    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handlePelaksanaChange = (value: string) => {
    if (!formData) return;

    const currentPelaksana = formData.pelaksana || [];
    let newPelaksana: string[];

    if (currentPelaksana.includes(value)) {
      // Remove if already selected
      newPelaksana = currentPelaksana.filter((p) => p !== value);
    } else {
      // Add if not selected
      newPelaksana = [...currentPelaksana, value];
    }

    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        pelaksana: newPelaksana,
      };
    });
  };

  // Step 2: Update data IDM
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData || !variabelIDM) {
      toast.error("Data tidak lengkap");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Token tidak ditemukan. Silakan login kembali.");
        navigate("/");
        return;
      }

      // Prepare data for update
      const dataToSend = {
        indikator_idm: formData.indikator_idm,
        skor: formData.skor,
        keterangan: formData.keterangan,
        kegiatan: formData.kegiatan,
        nilai_plus: formData.nilai_plus,
        pelaksana: formData.pelaksana.length > 0 ? formData.pelaksana : ["-"],
        kategori: formData.kategori,
        tahun: formData.tahun,
      };

      const response = await axios.put(
        `${API_CONFIG.baseURL}/api/variabel-idm/edit/${variabelIDM}`,
        dataToSend,
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data) {
        toast.success("Data IDM berhasil diperbarui!");
        setIsRecalculating(true);

        // Step 3: Recalculate IDM
        await handleRecalculate();
      }
    } catch (error) {
      console.error("Error updating IDM data:", error);
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(`Gagal memperbarui data: ${error.response.data.message}`);
      } else {
        toast.error("Gagal memperbarui data IDM");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: Recalculate IDM
  const handleRecalculate = async () => {
    if (!formData) return;

    setIsRecalculating(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Token tidak ditemukan. Silakan login kembali.");
        navigate("/");
        return;
      }

      const response = await axios.post(
        `${API_CONFIG.baseURL}/api/idm/${formData.tahun}/recalculate`,
        {},
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data) {
        toast.success("Perhitungan ulang IDM berhasil!");
        setIsRecalculating(false);

        // Navigate back to IDM pages after a short delay
        setTimeout(() => {
          navigate("/admin/idm");
        }, 2000);
      }
    } catch (error) {
      console.error("Error recalculating IDM:", error);
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(
          `Gagal menghitung ulang IDM: ${error.response.data.message}`,
        );
      } else {
        toast.error("Gagal menghitung ulang IDM");
      }
    } finally {
      setIsRecalculating(false);
    }
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 items-center justify-center p-4">
            <Spinner size="xl" text="Memuat data IDM..." />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 items-center justify-center p-4">
            <div className="text-center">
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                Error
              </h2>
              <p className="mb-4 text-gray-600">{error}</p>
              <Button onClick={() => navigate("/admin/idm")}>
                Kembali ke IDM
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!formData) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 items-center justify-center p-4">
            <div className="text-center">
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                Data Tidak Ditemukan
              </h2>
              <p className="mb-4 text-gray-600">
                Data IDM yang dicari tidak ditemukan
              </p>
              <Button onClick={() => navigate("/admin/idm")}>
                Kembali ke IDM
              </Button>
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          {/* Header */}
          <div className="sticky top-0 z-10 border-b border-white/20 bg-white/80 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate("/admin/idm")}
                    className="rounded-lg p-2 transition-all hover:scale-105 hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      Edit IDM
                    </h1>
                    <p className="text-sm text-gray-500">
                      Infografis / Edit IDM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div
                className={`w-full rounded-2xl border-2 p-8 shadow-2xl transition-all duration-300 ${color.card}`}
              >
                {/* Card Header */}
                <div className="mb-6 border-b border-gray-100 pb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${color.icon}`}
                    ></div>
                    <div>
                      <h3 className={`text-lg font-semibold ${color.title}`}>
                        {formData?.indikator_idm || "Indikator IDM"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formData?.kategori || "Kategori"} | Tahun:{" "}
                        {formData?.tahun || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="space-y-6">
                  {/* Skor */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      Skor <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData?.skor?.toString() || "0"}
                      onValueChange={(value) =>
                        handleFieldChange("skor", parseInt(value))
                      }
                      required
                    >
                      <SelectTrigger className="h-12 w-full rounded-xl border-2">
                        <SelectValue placeholder="Pilih Skor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {skorOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-3">
                                <span
                                  className={`rounded px-2 py-1 text-xs font-medium ${option.color}`}
                                >
                                  {option.label}
                                </span>
                                <span className="text-sm">
                                  {option.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Nilai Plus */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      Nilai Plus <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      value={formData?.nilai_plus || 0}
                      onChange={(e) =>
                        handleFieldChange(
                          "nilai_plus",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      required
                      min="0"
                      max="1"
                      step="0.0001"
                      placeholder="0.0000"
                      className="h-12 w-full rounded-xl border-2 border-gray-300 px-4 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                    <p className="text-xs text-gray-500">
                      Format: 0.0000 (maksimal 1.0000)
                    </p>
                  </div>

                  {/* Keterangan */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      Keterangan <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={formData?.keterangan || ""}
                      onChange={(e) =>
                        handleFieldChange("keterangan", e.target.value)
                      }
                      required
                      rows={4}
                      placeholder="Jelaskan keterangan untuk indikator ini..."
                      className="w-full resize-none rounded-xl border-2 border-gray-300 px-4 py-3 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  {/* Kegiatan */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      Kegiatan <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={formData?.kegiatan || ""}
                      onChange={(e) =>
                        handleFieldChange("kegiatan", e.target.value)
                      }
                      required
                      rows={4}
                      placeholder="Deskripsikan kegiatan yang dilakukan..."
                      className="w-full resize-none rounded-xl border-2 border-gray-300 px-4 py-3 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  {/* Pelaksana */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      Pelaksana{" "}
                      <span className="text-xs text-gray-500">(Opsional)</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {currentPelaksanaOptions.map((option) => (
                        <label
                          key={option.value}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                            formData?.pelaksana?.includes(option.value)
                              ? "border-blue-500 bg-blue-50 shadow-sm"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={
                              formData?.pelaksana?.includes(option.value) ||
                              false
                            }
                            onChange={() => handlePelaksanaChange(option.value)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-lg">{option.icon}</span>
                          <span className="text-sm font-medium text-gray-700">
                            {option.value}
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* Custom Pelaksana Input */}
                    <div className="mt-4 space-y-3">
                      <label className="text-sm font-medium text-gray-700">
                        Tambah Pelaksana Lainnya:
                      </label>
                      {formData?.pelaksana?.map((pelaksana, index) => {
                        // Check if this is a custom pelaksana (not in standard options for current kategori)
                        const standardPelaksana =
                          currentPelaksanaOptions.map((p) => p.value) || [];
                        const isCustom = !standardPelaksana.includes(pelaksana);

                        if (isCustom) {
                          return (
                            <div key={index} className="flex gap-2">
                              <Input
                                type="text"
                                value={pelaksana}
                                onChange={(e) => {
                                  const newPelaksana = [
                                    ...(formData.pelaksana || []),
                                  ];
                                  newPelaksana[index] = e.target.value;
                                  setFormData((prev) =>
                                    prev
                                      ? { ...prev, pelaksana: newPelaksana }
                                      : prev,
                                  );
                                }}
                                placeholder="Ketik nama pelaksana..."
                                className="flex-1 rounded-xl border-2 border-gray-300 px-4 py-3 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newPelaksana =
                                    formData.pelaksana.filter(
                                      (_, i) => i !== index,
                                    );
                                  setFormData((prev) =>
                                    prev
                                      ? { ...prev, pelaksana: newPelaksana }
                                      : prev,
                                  );
                                }}
                                className="rounded-xl p-2 text-red-500 transition-all hover:bg-red-50 hover:text-red-600"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          );
                        }
                        return null;
                      })}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  pelaksana: [...(prev.pelaksana || []), ""],
                                }
                              : prev,
                          );
                        }}
                        className="flex items-center -mt-4 gap-2 rounded-xl px-4 py-2 text-blue-600 transition-all hover:bg-blue-50 hover:text-blue-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Tambah Pelaksana Lainnya</span>
                      </button>
                    </div>

                    {formData?.pelaksana?.length > 0 && (
                      <p className="text-sm text-blue-600">
                        {formData.pelaksana.length} pelaksana dipilih
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/idm")}
                  disabled={isSubmitting || isRecalculating}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || isRecalculating}
                  className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Menyimpan...</span>
                    </>
                  ) : isRecalculating ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Menghitung Ulang...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>Simpan Data</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default IdmEdit;
