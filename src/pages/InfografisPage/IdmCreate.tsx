import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { API_CONFIG } from "@/config/api";
import { toast } from "sonner";
import { Save, ChevronLeft } from "lucide-react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IdmForm {
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
  indikator_idm: string[];
  kategori: Array<{
    value: string;
    label: string;
  }>;
}

const pelaksanaOptions = [
  "Desa",
  "Masyarakat",
  "PKBM",
  "Karang Taruna",
  "PKK",
  "BUMDes",
  "LPM",
  "Lainnya",
];

const IdmCreate: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState<IdmForm>({
    indikator_idm: "",
    skor: 0,
    keterangan: "",
    kegiatan: "",
    nilai_plus: 0,
    pelaksana: [],
    kategori: "",
    tahun: currentYear,
  });

  const [indikatorOptions, setIndikatorOptions] = useState<string[]>([]);
  const [kategoriOptions, setKategoriOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPelaksana, setSelectedPelaksana] = useState<string[]>([]);

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
          setIndikatorOptions(response.data.indikator_idm || []);
          setKategoriOptions(response.data.kategori || []);
        }
      } catch (error) {
        console.error("Error fetching variabel IDM:", error);
        toast.error("Gagal mengambil data variabel IDM");
        setIndikatorOptions([]);
        setKategoriOptions([]);
      }
    };

    fetchVariabelIdm();
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleKategoriChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      kategori: value,
    }));
  };

  const handleIndikatorChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      indikator_idm: value,
    }));
  };

  const handlePelaksanaChange = (value: string) => {
    const newPelaksana = selectedPelaksana.includes(value)
      ? selectedPelaksana.filter((p) => p !== value)
      : [...selectedPelaksana, value];

    setSelectedPelaksana(newPelaksana);
    setFormData((prev) => ({
      ...prev,
      pelaksana: newPelaksana,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Token tidak ditemukan. Silakan login kembali.");
        navigate("/");
        return;
      }

      const dataToSend = {
        idm: [formData],
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
      toast.error("Gagal menyimpan data IDM");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-gray-50">
          <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate("/admin/idm")}
                    className="rounded-lg p-2 transition-colors hover:bg-gray-100"
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
              </div>
            </div>
          </div>
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                <div className="flex items-center space-x-3">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Form Indeks Desa Membangun (IDM)
                    </h2>
                    <p className="mt-1 text-blue-100">
                      Silakan lengkapi data IDM dengan teliti
                    </p>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Tahun
                    </label>
                    <input
                      type="text"
                      value={formData.tahun}
                      disabled
                      className="h-10 w-full cursor-not-allowed rounded-xl border border-gray-300 bg-gray-50 px-4 text-gray-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Kategori
                    </label>
                    <Select
                      value={formData.kategori}
                      onValueChange={handleKategoriChange}
                      required
                    >
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="Pilih Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Array.isArray(kategoriOptions) &&
                            kategoriOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Indikator IDM
                    </label>
                    <Select
                      value={formData.indikator_idm}
                      onValueChange={handleIndikatorChange}
                      required
                    >
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="Pilih Indikator IDM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {indikatorOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Skor
                    </label>
                    <input
                      type="number"
                      name="skor"
                      value={formData.skor}
                      onChange={handleNumberChange}
                      required
                      min="0"
                      max="5"
                      step="0.1"
                      className="h-10 w-full rounded-xl border border-gray-300 px-4"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Nilai Plus
                    </label>
                    <input
                      type="number"
                      name="nilai_plus"
                      value={formData.nilai_plus}
                      onChange={handleNumberChange}
                      required
                      min="0"
                      max="1"
                      step="0.1"
                      className="h-10 w-full rounded-xl border border-gray-300 px-4"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Keterangan
                    </label>
                    <textarea
                      name="keterangan"
                      value={formData.keterangan}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Kegiatan
                    </label>
                    <textarea
                      name="kegiatan"
                      value={formData.kegiatan}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Pelaksana
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {pelaksanaOptions.map((option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-2 rounded-lg border border-gray-300 p-3"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPelaksana.includes(option)}
                            onChange={() => handlePelaksanaChange(option)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <span className="text-sm text-gray-700">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white"
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
