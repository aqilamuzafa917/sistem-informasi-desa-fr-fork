import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { API_CONFIG } from "@/config/api";
import { toast } from "sonner";
import { Save, CheckCircle, CalendarIcon, ChevronLeft } from "lucide-react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PendapatanForm {
  tahun_anggaran: number;
  tanggal_realisasi: string;
  kategori: string;
  sub_kategori: string;
  deskripsi: string;
  jumlah: string;
  sumber_dana: string;
  keterangan: string;
}

const kategoriOptions = [
  "Pendapatan Asli Desa",
  "Pendapatan Transfer",
  "Pendapatan Lain-lain",
];

const subKategoriMap = {
  "Pendapatan Asli Desa": [
    "Hasil Usaha",
    "Swadaya, Partisipasi dan Gotong Royong",
    "Lain-lain Pendapatan Asli Desa yang sah",
  ],
  "Pendapatan Transfer": [
    "Dana desa",
    "Bagian dari hasil pajak & retribusi daerah kabupaten/kota",
    "Alokasi Dana Desa",
    "Bantuan Keuangan",
    "Bantuan Provinsi",
    "Bantuan Kabupaten/Kota",
  ],
  "Pendapatan Lain-lain": [
    "Hibah dan Sumbangan dari pihak ke 3 yang tidak mengikat",
    "Lain-lain Pendapatan Desa yang sah",
  ],
};

const formatToIDR = (value: string) => {
  const number = value.replace(/\D/g, "");
  if (!number) return "";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(number));
};

const PendapatanCreate: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState<PendapatanForm>({
    tahun_anggaran: currentYear,
    tanggal_realisasi: "",
    kategori: "",
    sub_kategori: "",
    deskripsi: "",
    jumlah: "",
    sumber_dana: "",
    keterangan: "",
  });

  const [subKategoriOptions, setSubKategoriOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayJumlah, setDisplayJumlah] = useState("");
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    if (formData.kategori) {
      setSubKategoriOptions(
        subKategoriMap[formData.kategori as keyof typeof subKategoriMap] || [],
      );
    } else {
      setSubKategoriOptions([]);
    }
  }, [formData.kategori]);

  useEffect(() => {
    setDisplayJumlah(formatToIDR(formData.jumlah));
  }, [formData.jumlah]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === "jumlah") {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        tanggal_realisasi: format(selectedDate, "yyyy-MM-dd"),
      }));
    }
  };

  const handleKategoriChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      kategori: value,
      sub_kategori: "", // Reset sub kategori when kategori changes
    }));
  };

  const handleSubKategoriChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      sub_kategori: value,
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
        pendapatan: [formData],
      };

      const response = await axios.post(
        `${API_CONFIG.baseURL}/api/pendapatan`,
        dataToSend,
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data) {
        toast.success("Data pendapatan berhasil disimpan!", {
          description: (
            <div className="mt-2 flex flex-col gap-1">
              <p className="font-medium">Detail Pendapatan:</p>
              <p>• Kategori: {formData.kategori}</p>
              <p>• Sub Kategori: {formData.sub_kategori}</p>
              <p>• Jumlah: {displayJumlah}</p>
              <p>
                • Tanggal:{" "}
                {date ? format(date, "dd/MM/yyyy") : formData.tanggal_realisasi}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Halaman akan dimuat ulang dalam beberapa detik...
              </p>
            </div>
          ),
          duration: 5000,
        });
        setTimeout(() => {
          navigate("/pendapatan");
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
        toast.error("Gagal menyimpan data pendapatan", {
          description: errorMessages,
        });
      } else {
        toast.error("Gagal menyimpan data pendapatan", {
          description:
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan saat menyimpan data. Silakan coba lagi.",
        });
      }
    } finally {
      setIsSubmitting(false);
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
                    onClick={() => navigate("/admin/pendapatan")}
                    className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      Tambah Pendapatan
                    </h1>
                    <p className="text-sm text-gray-500">
                      Infografis / Tambah Pendapatan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              {/* Form Header */}
              <div className="mb-8 rounded-lg bg-gradient-to-r from-green-600 to-indigo-600 px-8 py-6">
                <div className="flex items-center space-x-3">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Form Pendapatan Desa
                    </h2>
                    <p className="mt-1 text-blue-100">
                      Silakan lengkapi data pendapatan dengan teliti
                    </p>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                  {/* Left Column */}
                  <div className="space-y-3">
                    {/* Tahun Anggaran */}
                    <div className="space-y-1">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        Tahun Anggaran
                      </label>
                      <input
                        type="text"
                        value={formData.tahun_anggaran}
                        disabled
                        className="h-10 w-full cursor-not-allowed rounded-xl border border-gray-300 bg-gray-50 px-4 text-gray-500"
                      />
                    </div>
                    {/* Tanggal Realisasi */}
                    <div className="space-y-1">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        Tanggal Realisasi
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "h-10 w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? (
                              format(date, "dd/MM/yyyy")
                            ) : (
                              <span>Pilih tanggal</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                            initialFocus
                            disabled={(date) => date > new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    {/* Kategori */}
                    <div className="space-y-1">
                      <label className="flex items-center text-sm font-medium text-gray-700">
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
                            {kategoriOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Sub Kategori */}
                    <div className="space-y-1">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        Sub Kategori
                      </label>
                      <Select
                        value={formData.sub_kategori}
                        onValueChange={handleSubKategoriChange}
                        required
                        disabled={!formData.kategori}
                      >
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder="Pilih Sub Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {subKategoriOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Jumlah */}
                    <div className="space-y-1">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        Jumlah
                      </label>
                      <div className="relative">
                        <span className="absolute top-1/2 left-4 -translate-y-1/2 transform font-medium text-gray-500">
                          Rp
                        </span>
                        <input
                          type="text"
                          name="jumlah"
                          value={displayJumlah.replace("Rp", "").trim()}
                          onChange={handleChange}
                          required
                          placeholder="0"
                          className="h-10 w-full rounded-xl border border-gray-300 py-2 pr-4 pl-12 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Masukkan nominal tanpa titik atau koma
                      </p>
                    </div>
                    {/* Sumber Dana */}
                    <div className="space-y-1">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        Sumber Dana
                      </label>
                      <input
                        type="text"
                        name="sumber_dana"
                        value={formData.sumber_dana}
                        onChange={handleChange}
                        required
                        placeholder="Masukkan sumber dana"
                        className="h-10 w-full rounded-xl border border-gray-300 px-4 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {/* Deskripsi */}
                    <div className="space-y-1">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        Deskripsi
                      </label>
                      <textarea
                        name="deskripsi"
                        value={formData.deskripsi}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Masukkan deskripsi pendapatan"
                        className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {/* Keterangan */}
                    <div className="space-y-1">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        Keterangan
                      </label>
                      <textarea
                        name="keterangan"
                        value={formData.keterangan}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Masukkan keterangan tambahan (opsional)"
                        className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                {/* Summary Card */}
                <div className="mt-8 rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
                  <h3 className="mb-4 flex items-center text-lg font-semibold text-green-800">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Ringkasan Pendapatan
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium text-green-600">
                        Kategori
                      </p>
                      <p className="text-green-800">
                        {formData.kategori || "Belum dipilih"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-600">
                        Sub Kategori
                      </p>
                      <p className="text-green-800">
                        {formData.sub_kategori || "Belum dipilih"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-600">
                        Jumlah
                      </p>
                      <p className="text-lg font-bold text-green-800">
                        {displayJumlah || "Rp 0"}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Submit Button */}
                <div className="mt-8 flex justify-end">
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
                </div>
              </form>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default PendapatanCreate;
