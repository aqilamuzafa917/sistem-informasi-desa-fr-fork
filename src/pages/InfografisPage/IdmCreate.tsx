import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { API_CONFIG } from "@/config/api";
import { toast } from "sonner";
import {
  Save,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface VariabelIdmResponse {
  IKE: string[];
  IKS: string[];
  IKL: string[];
  [key: string]: string[];
}

const kategoriOptions = [
  {
    value: "IKE",
    label: "Indeks Ketahanan Ekonomi",
    description: "Mengukur tingkat ketahanan ekonomi desa",
    color: "from-emerald-500 to-teal-600",
  },
  {
    value: "IKS",
    label: "Indeks Ketahanan Sosial",
    description: "Mengukur tingkat ketahanan sosial masyarakat desa",
    color: "from-blue-500 to-indigo-600",
  },
  {
    value: "IKL",
    label: "Indeks Ketahanan Lingkungan",
    description: "Mengukur tingkat ketahanan lingkungan desa",
    color: "from-green-500 to-emerald-600",
  },
];

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

const IdmCreate: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const [currentKategoriIndex, setCurrentKategoriIndex] = useState<number>(0);
  const [formData, setFormData] = useState<{
    [key: string]: { [key: string]: IdmFormData };
  }>({
    IKE: {},
    IKS: {},
    IKL: {},
  });
  const [allIndikators, setAllIndikators] = useState<VariabelIdmResponse>({
    IKE: [],
    IKS: [],
    IKL: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedCards, setExpandedCards] = useState<{
    [key: string]: boolean;
  }>({});
  const [completedIndicators, setCompletedIndicators] = useState<{
    [key: string]: Set<string>;
  }>({
    IKE: new Set(),
    IKS: new Set(),
    IKL: new Set(),
  });
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    const fetchVariabelIdm = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("Token tidak ditemukan. Silakan login kembali.");
          navigate("/");
          return;
        }

        const response = await axios.get<VariabelIdmResponse>(
          `${API_CONFIG.baseURL}/api/variabel-idm`,
          {
            headers: {
              ...API_CONFIG.headers,
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data) {
          setAllIndikators(response.data);
          // Initialize form data for all categories
          const newFormData: { [key: string]: { [key: string]: IdmFormData } } =
            {
              IKE: {},
              IKS: {},
              IKL: {},
            };

          Object.entries(response.data).forEach(([kategori, indicators]) => {
            indicators.forEach((indikator) => {
              newFormData[kategori][indikator] = {
                indikator_idm: indikator,
                skor: 0,
                keterangan: "",
                kegiatan: "",
                nilai_plus: 0,
                pelaksana: [],
                kategori: kategori,
                tahun: currentYear,
              };
            });
          });

          setFormData(newFormData);

          // Auto-expand first card of first category
          if (response.data.IKE.length > 0) {
            setExpandedCards({ [response.data.IKE[0]]: true });
          }
        }
      } catch (error) {
        console.error("Error fetching variabel IDM:", error);
        toast.error("Gagal mengambil data variabel IDM");
      }
    };

    fetchVariabelIdm();
  }, [navigate, currentYear]);

  // Check if indicator is completed
  const isIndicatorCompleted = (
    kategori: string,
    indikator: string,
  ): boolean => {
    const data = formData[kategori][indikator];
    if (!data) return false;

    return !!(
      data.skor !== undefined &&
      data.keterangan.trim() &&
      data.kegiatan.trim()
    );
  };

  // Update completed indicators when form data changes
  useEffect(() => {
    const newCompletedIndicators = { ...completedIndicators };

    Object.entries(formData).forEach(([kategori, indicators]) => {
      const completed = new Set<string>();
      Object.keys(indicators).forEach((indikator) => {
        if (isIndicatorCompleted(kategori, indikator)) {
          completed.add(indikator);
        }
      });
      newCompletedIndicators[kategori] = completed;
    });

    setCompletedIndicators(newCompletedIndicators);
  }, [formData]);

  const handleFieldChange = (
    kategori: string,
    indikator: string,
    field: keyof IdmFormData,
    value: IdmFormData[keyof IdmFormData],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [kategori]: {
        ...prev[kategori],
        [indikator]: {
          ...prev[kategori][indikator],
          [field]: value,
        },
      },
    }));
  };

  const handlePelaksanaChange = (
    kategori: string,
    indikator: string,
    value: string,
  ) => {
    setFormData((prev) => {
      const currentPelaksana = prev[kategori][indikator].pelaksana;
      const newPelaksana = currentPelaksana.includes(value)
        ? currentPelaksana.filter((p) => p !== value)
        : [...currentPelaksana, value];

      return {
        ...prev,
        [kategori]: {
          ...prev[kategori],
          [indikator]: {
            ...prev[kategori][indikator],
            pelaksana: newPelaksana,
          },
        },
      };
    });
  };

  const toggleCardExpansion = (indikator: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [indikator]: !prev[indikator],
    }));
  };

  const handleNextCategory = () => {
    const currentKategori = kategoriOptions[currentKategoriIndex].value;
    const nextIndex = currentKategoriIndex + 1;

    // Validate current category
    const incompleteIndicators = Object.keys(formData[currentKategori]).filter(
      (indikator: string) => !isIndicatorCompleted(currentKategori, indikator),
    );

    if (incompleteIndicators.length > 0) {
      setShowValidation(true);
      toast.error(
        `Harap lengkapi ${incompleteIndicators.length} indikator yang belum selesai`,
      );
      // Expand incomplete indicators
      const newExpanded = { ...expandedCards };
      incompleteIndicators.forEach((indikator) => {
        newExpanded[indikator] = true;
      });
      setExpandedCards(newExpanded);
      return;
    }

    if (nextIndex < kategoriOptions.length) {
      setCurrentKategoriIndex(nextIndex);
      setShowValidation(false);
      // Auto-expand first card of next category
      const nextKategori = kategoriOptions[nextIndex].value;
      if (allIndikators[nextKategori]?.length > 0) {
        setExpandedCards({ [allIndikators[nextKategori][0]]: true });
      }
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevCategory = () => {
    if (currentKategoriIndex > 0) {
      setCurrentKategoriIndex(currentKategoriIndex - 1);
      setShowValidation(false);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowValidation(true);

    // Check if all categories are completed
    const incompleteCategories = kategoriOptions.filter((kategori) => {
      const incompleteIndicators = Object.keys(formData[kategori.value]).filter(
        (indikator) => !isIndicatorCompleted(kategori.value, indikator),
      );
      return incompleteIndicators.length > 0;
    });

    if (incompleteCategories.length > 0) {
      toast.error(
        `Harap lengkapi semua indikator di kategori ${incompleteCategories.map((k) => k.value).join(", ")}`,
      );
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

      // Combine all form data and set default pelaksana value
      const allData = Object.values(formData).flatMap((categoryData) =>
        Object.values(categoryData).map((data) => ({
          ...data,
          pelaksana: data.pelaksana.length > 0 ? data.pelaksana : ["-"],
        })),
      );

      const dataToSend = {
        data: allData,
      };

      const response = await axios.post(
        `${API_CONFIG.baseURL}/api/variabel-idm`,
        dataToSend,
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data) {
        toast.success("Data IDM berhasil disimpan!");
        setTimeout(() => {
          navigate("/admin/idm");
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(`Gagal: ${error.response.data.message}`);
      } else {
        toast.error("Gagal menyimpan data IDM");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProgressPercentage = () => {
    const total = Object.values(allIndikators).reduce(
      (acc, curr) => acc + curr.length,
      0,
    );
    const completed = Object.values(completedIndicators).reduce(
      (acc, curr) => acc + curr.size,
      0,
    );
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const getCurrentCategoryProgress = () => {
    const currentKategori = kategoriOptions[currentKategoriIndex].value;
    const total = allIndikators[currentKategori].length;
    const completed = completedIndicators[currentKategori].size;
    return total > 0 ? (completed / total) * 100 : 0;
  };

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
                      Tambah IDM
                    </h1>
                    <p className="text-sm text-gray-500">
                      Infografis / Tambah IDM
                    </p>
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="flex items-center gap-6">
                  {/* Category Progress */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">
                        {
                          completedIndicators[
                            kategoriOptions[currentKategoriIndex].value
                          ].size
                        }{" "}
                        /{" "}
                        {
                          allIndikators[
                            kategoriOptions[currentKategoriIndex].value
                          ].length
                        }
                      </p>
                      <p className="text-xs text-gray-500">
                        {kategoriOptions[currentKategoriIndex].value}
                      </p>
                    </div>
                    <div className="relative h-12 w-12">
                      <svg className="h-12 w-12 -rotate-90 transform">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          className="text-gray-200"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 20}`}
                          strokeDashoffset={`${2 * Math.PI * 20 * (1 - getCurrentCategoryProgress() / 100)}`}
                          className="text-blue-600 transition-all duration-300"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-700">
                          {Math.round(getCurrentCategoryProgress())}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Overall Progress */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">
                        {Object.values(completedIndicators).reduce(
                          (acc, curr) => acc + curr.size,
                          0,
                        )}{" "}
                        /{" "}
                        {Object.values(allIndikators).reduce(
                          (acc, curr) => acc + curr.length,
                          0,
                        )}
                      </p>
                      <p className="text-xs text-gray-500">Total</p>
                    </div>
                    <div className="relative h-12 w-12">
                      <svg className="h-12 w-12 -rotate-90 transform">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          className="text-gray-200"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 20}`}
                          strokeDashoffset={`${2 * Math.PI * 20 * (1 - getProgressPercentage() / 100)}`}
                          className="text-emerald-600 transition-all duration-300"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-700">
                          {Math.round(getProgressPercentage())}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {/* Hero Section */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white shadow-2xl">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="mb-2 text-3xl font-bold">
                        Form Indeks Desa Membangun (IDM)
                      </h2>
                      <p className="text-lg text-blue-100">
                        Silakan lengkapi data IDM dengan teliti untuk evaluasi
                        pembangunan desa
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <div className="text-6xl opacity-20">📊</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Navigation */}
              <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  {kategoriOptions.map((option, index) => (
                    <div
                      key={option.value}
                      className={`flex items-center gap-2 ${
                        index === currentKategoriIndex
                          ? "text-blue-600"
                          : index < currentKategoriIndex
                            ? "text-green-600"
                            : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                          index === currentKategoriIndex
                            ? "bg-blue-100 text-blue-600"
                            : index < currentKategoriIndex
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="font-medium">{option.value}</span>
                      {index < kategoriOptions.length - 1 && (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  Kategori {currentKategoriIndex + 1} dari{" "}
                  {kategoriOptions.length}
                </div>
              </div>

              {/* Form Section */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {Object.entries(
                  formData[kategoriOptions[currentKategoriIndex].value],
                ).map(([indikator, data], index) => {
                  const isCompleted =
                    completedIndicators[
                      kategoriOptions[currentKategoriIndex].value
                    ].has(indikator);
                  const isExpanded = expandedCards[indikator];

                  return (
                    <div
                      key={indikator}
                      className={`rounded-2xl border-2 transition-all duration-300 ${
                        isCompleted
                          ? "border-green-200 bg-green-50/50"
                          : showValidation && !isCompleted
                            ? "border-red-200 bg-red-50/50"
                            : "border-gray-200 bg-white"
                      } shadow-sm hover:shadow-md`}
                    >
                      {/* Card Header */}
                      <div
                        className="cursor-pointer p-6"
                        onClick={() => toggleCardExpansion(indikator)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                                isCompleted
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                index + 1
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {indikator}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {isCompleted
                                  ? "Sudah lengkap"
                                  : "Belum lengkap"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {showValidation && !isCompleted && (
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            )}
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Content */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 px-6 pb-6">
                          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Skor */}
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                Skor
                                <span className="text-red-500">*</span>
                              </label>
                              <Select
                                value={data.skor.toString()}
                                onValueChange={(value) =>
                                  handleFieldChange(
                                    kategoriOptions[currentKategoriIndex].value,
                                    indikator,
                                    "skor",
                                    parseInt(value),
                                  )
                                }
                                required
                              >
                                <SelectTrigger className="h-12 w-full rounded-xl border-2">
                                  <SelectValue placeholder="Pilih Skor" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    {skorOptions.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
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
                                Nilai Plus
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                value={data.nilai_plus}
                                onChange={(e) =>
                                  handleFieldChange(
                                    kategoriOptions[currentKategoriIndex].value,
                                    indikator,
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
                                Keterangan
                                <span className="text-red-500">*</span>
                              </label>
                              <textarea
                                value={data.keterangan}
                                onChange={(e) =>
                                  handleFieldChange(
                                    kategoriOptions[currentKategoriIndex].value,
                                    indikator,
                                    "keterangan",
                                    e.target.value,
                                  )
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
                                Kegiatan
                                <span className="text-red-500">*</span>
                              </label>
                              <textarea
                                value={data.kegiatan}
                                onChange={(e) =>
                                  handleFieldChange(
                                    kategoriOptions[currentKategoriIndex].value,
                                    indikator,
                                    "kegiatan",
                                    e.target.value,
                                  )
                                }
                                required
                                rows={4}
                                placeholder="Deskripsikan kegiatan yang dilakukan..."
                                className="w-full resize-none rounded-xl border-2 border-gray-300 px-4 py-3 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                              />
                            </div>

                            {/* Pelaksana */}
                            <div className="col-span-2 space-y-3">
                              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                Pelaksana
                                <span className="text-xs text-gray-500">
                                  (Opsional)
                                </span>
                              </label>
                              <div className="grid grid-cols-3 gap-3">
                                {pelaksanaOptions[
                                  kategoriOptions[currentKategoriIndex].value
                                ]?.map((option) => (
                                  <label
                                    key={option.value}
                                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                                      data.pelaksana.includes(option.value)
                                        ? "border-blue-500 bg-blue-50 shadow-sm"
                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={data.pelaksana.includes(
                                        option.value,
                                      )}
                                      onChange={() =>
                                        handlePelaksanaChange(
                                          kategoriOptions[currentKategoriIndex]
                                            .value,
                                          indikator,
                                          option.value,
                                        )
                                      }
                                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-lg">
                                      {option.icon}
                                    </span>
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
                                {data.pelaksana.map((pelaksana, index) => {
                                  // Check if this is a custom pelaksana (not in standard options for current kategori)
                                  const currentKategori =
                                    kategoriOptions[currentKategoriIndex].value;
                                  const standardPelaksana =
                                    pelaksanaOptions[currentKategori]?.map(
                                      (p) => p.value,
                                    ) || [];
                                  const isCustom =
                                    !standardPelaksana.includes(pelaksana);

                                  if (isCustom) {
                                    return (
                                      <div key={index} className="flex gap-2">
                                        <input
                                          type="text"
                                          value={pelaksana}
                                          onChange={(e) => {
                                            const newPelaksana = [
                                              ...data.pelaksana,
                                            ];
                                            newPelaksana[index] =
                                              e.target.value;
                                            handleFieldChange(
                                              kategoriOptions[
                                                currentKategoriIndex
                                              ].value,
                                              indikator,
                                              "pelaksana",
                                              newPelaksana,
                                            );
                                          }}
                                          placeholder="Ketik nama pelaksana..."
                                          className="flex-1 rounded-xl border-2 border-gray-300 px-4 py-3 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const newPelaksana =
                                              data.pelaksana.filter(
                                                (_, i) => i !== index,
                                              );
                                            handleFieldChange(
                                              kategoriOptions[
                                                currentKategoriIndex
                                              ].value,
                                              indikator,
                                              "pelaksana",
                                              newPelaksana,
                                            );
                                          }}
                                          className="rounded-xl p-3 text-red-500 transition-all hover:bg-red-50 hover:text-red-600"
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
                                    const newPelaksana = [
                                      ...data.pelaksana,
                                      "",
                                    ];
                                    handleFieldChange(
                                      kategoriOptions[currentKategoriIndex]
                                        .value,
                                      indikator,
                                      "pelaksana",
                                      newPelaksana,
                                    );
                                  }}
                                  className="flex items-center gap-2 rounded-xl px-4 py-2 text-blue-600 transition-all hover:bg-blue-50 hover:text-blue-700"
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

                              {data.pelaksana.length > 0 && (
                                <p className="text-sm text-blue-600">
                                  {data.pelaksana.length} pelaksana dipilih
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Navigation and Submit Buttons */}
                <div className="sticky bottom-0 rounded-t-2xl border-t border-gray-200 bg-white/80 p-6 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">
                        {
                          completedIndicators[
                            kategoriOptions[currentKategoriIndex].value
                          ].size
                        }{" "}
                        dari{" "}
                        {
                          allIndikators[
                            kategoriOptions[currentKategoriIndex].value
                          ].length
                        }{" "}
                        indikator selesai
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      {currentKategoriIndex > 0 && (
                        <button
                          type="button"
                          onClick={handlePrevCategory}
                          className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          <span>Sebelumnya</span>
                        </button>
                      )}

                      {currentKategoriIndex < kategoriOptions.length - 1 ? (
                        <button
                          type="button"
                          onClick={handleNextCategory}
                          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700"
                        >
                          <span>Selanjutnya</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={
                            isSubmitting || getProgressPercentage() !== 100
                          }
                          className="flex transform items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                              <span>Menyimpan...</span>
                            </>
                          ) : (
                            <>
                              <Save className="h-5 w-5" />
                              <span>Simpan Data IDM</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default IdmCreate;
