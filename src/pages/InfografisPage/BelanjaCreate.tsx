"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "../../config/api";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Save, CheckCircle, CalendarIcon, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface BelanjaFormData {
  kategori: string;
  deskripsi: string;
  jumlah: string;
  keterangan: string;
  penerima_vendor: string;
  tanggal_realisasi: string;
  tahun_anggaran: number;
}

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

export default function BelanjaCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [displayJumlah, setDisplayJumlah] = useState("");
  const [formData, setFormData] = useState<BelanjaFormData>({
    kategori: "",
    deskripsi: "",
    jumlah: "",
    keterangan: "",
    penerima_vendor: "",
    tanggal_realisasi: "",
    tahun_anggaran: new Date().getFullYear(),
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  React.useEffect(() => {
    setDisplayJumlah(formatToIDR(formData.jumlah));
  }, [formData.jumlah]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Token tidak ditemukan. Silakan login kembali.");
        navigate("/");
        return;
      }

      const response = await axios.post(
        `${API_CONFIG.baseURL}/api/belanja`,
        { belanja: [formData] },
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.status === "success") {
        toast.success("Data belanja berhasil ditambahkan");
        navigate("/belanja");
      } else {
        toast.error("Gagal menambahkan data belanja");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
          navigate("/");
        } else {
          toast.error(error.response?.data?.message || "Terjadi kesalahan");
        }
      } else {
        toast.error("Terjadi kesalahan yang tidak diketahui");
      }
    } finally {
      setLoading(false);
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
                    onClick={() => navigate("/belanja")}
                    className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      Tambah Belanja
                    </h1>
                    <p className="text-sm text-gray-500">
                      Infografis / Tambah Belanja
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              {/* Form Header */}
              <div className="mb-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                <div className="flex items-center space-x-3">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Form Belanja Desa
                    </h2>
                    <p className="mt-1 text-blue-100">
                      Silakan lengkapi data belanja dengan teliti
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
                        className="h-10 w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-50 px-4 text-gray-500"
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
                        Kategori Belanja
                      </label>
                      <Select
                        value={formData.kategori}
                        onValueChange={(value) =>
                          handleSelectChange("kategori", value)
                        }
                        required
                      >
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Belanja Barang/Jasa">
                            Belanja Barang/Jasa
                          </SelectItem>
                          <SelectItem value="Belanja Modal">
                            Belanja Modal
                          </SelectItem>
                          <SelectItem value="Belanja Pegawai">
                            Belanja Pegawai
                          </SelectItem>
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
                          onChange={handleInputChange}
                          required
                          placeholder="0"
                          className="h-10 w-full rounded-lg border border-gray-300 py-2 pr-4 pl-12 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Masukkan nominal tanpa titik atau koma
                      </p>
                    </div>

                    {/* Penerima/Vendor */}
                    <div className="space-y-1">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        Penerima/Vendor
                      </label>
                      <input
                        type="text"
                        name="penerima_vendor"
                        value={formData.penerima_vendor}
                        onChange={handleInputChange}
                        required
                        placeholder="Masukkan nama penerima/vendor"
                        className="h-10 w-full rounded-lg border border-gray-300 px-4 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
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
                        onChange={handleInputChange}
                        required
                        rows={4}
                        placeholder="Masukkan deskripsi belanja"
                        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
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
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Masukkan keterangan tambahan (opsional)"
                        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Summary Card */}
                <div className="mt-8 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                  <h3 className="mb-4 flex items-center text-lg font-semibold text-blue-800">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Ringkasan Belanja
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium text-blue-600">
                        Kategori
                      </p>
                      <p className="text-blue-800">
                        {formData.kategori || "Belum dipilih"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-600">
                        Penerima/Vendor
                      </p>
                      <p className="text-blue-800">
                        {formData.penerima_vendor || "Belum diisi"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-600">
                        Jumlah
                      </p>
                      <p className="text-lg font-bold text-blue-800">
                        {displayJumlah || "Rp 0"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
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
}
