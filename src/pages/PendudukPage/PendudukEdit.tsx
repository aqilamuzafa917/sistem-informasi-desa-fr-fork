import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { AppSidebar } from "@/components/app-sidebar";
import { API_CONFIG } from "@/config/api";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  MapPin,
  Home,
  Briefcase,
  Save,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  CalendarIcon,
  BookUser,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { toast } from "sonner";

interface PendudukFormData {
  nik: string;
  no_kk: string;
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: "Laki-laki" | "Perempuan" | "";
  alamat: string;
  rt: string;
  rw: string;
  desa_kelurahan: string;
  kecamatan: string;
  kabupaten_kota: string;
  provinsi: string;
  kode_pos: string;
  agama: string;
  status_perkawinan: string;
  pekerjaan: string;
  kewarganegaraan: "WNI" | "WNA" | "";
  pendidikan: string;
}

const initialFormData: PendudukFormData = {
  nik: "",
  no_kk: "",
  nama: "",
  tempat_lahir: "",
  tanggal_lahir: "",
  jenis_kelamin: "",
  alamat: "",
  rt: "",
  rw: "",
  desa_kelurahan: "",
  kecamatan: "",
  kabupaten_kota: "",
  provinsi: "",
  kode_pos: "",
  agama: "",
  status_perkawinan: "",
  pekerjaan: "",
  kewarganegaraan: "",
  pendidikan: "",
};

const agamaOptions = [
  "Islam",
  "Kristen",
  "Katolik",
  "Hindu",
  "Buddha",
  "Konghucu",
];
const statusPerkawinanOptions = [
  "Belum Menikah",
  "Menikah",
  "Cerai Hidup",
  "Cerai Mati",
];
const pekerjaanOptions = [
  "Belum / Tidak Bekerja",
  "Mengurus Rumah Tangga",
  "Pelajar / Mahasiswa",
  "Pensiunan",
  "Pegawai Negeri Sipil (PNS)",
  "Tentara Nasional Indonesia (TNI)",
  "Kepolisian RI",
  "Perdagangan",
  "Petani / Pekebun",
  "Peternak",
  "Nelayan / Perikanan",
  "Industri",
  "Konstruksi",
  "Transportasi",
  "Karyawan Swasta",
  "Karyawan BUMN",
  "Karyawan BUMD",
  "Karyawan Honorer",
  "Buruh Harian Lepas",
  "Buruh Tani / Perkebunan",
  "Buruh Nelayan / Perikanan",
  "Buruh Peternakan",
  "Pembantu Rumah Tangga",
  "Tukang Cukur",
  "Tukang Listrik",
  "Tukang Batu",
  "Tukang Kayu",
  "Tukang Sol Sepatu",
  "Tukang Las / Pandai Besi",
  "Tukang Jahit",
  "Tukang Gigi",
  "Penata Rias",
  "Penata Busana",
  "Penata Rambut",
  "Mekanik",
  "Seniman",
  "Artis",
  "Dokter",
  "Bidan",
  "Perawat",
  "Apoteker",
  "Psikiater / Psikolog",
  "Penyiar Televisi",
  "Penyiar Radio",
  "Pelaut",
  "Peneliti",
  "Sopir",
  "Pialang",
  "Paranormal",
  "Pedagang",
  "Perangkat Desa",
  "Kepala Desa",
  "Biarawan / Biarawati",
  "Wirausaha",
  "Wiraswasta",
  "Konsultan",
  "Notaris",
  "Arsitek",
  "Akuntan",
  "Juru Masak",
  "Wartawan",
  "Ustadz / Mubaligh",
  "Juru Sembelih",
  "Imam Masjid",
  "Pendeta",
  "Pastor",
  "Aktivis LSM",
  "Anggota DPR-RI",
  "Anggota DPD",
  "Anggota BPK",
  "Presiden",
  "Wakil Presiden",
  "Anggota Mahkamah Konstitusi",
  "Anggota Kabinet / Menteri",
  "Duta Besar",
  "Gubernur",
  "Wakil Gubernur",
  "Bupati",
  "Wakil Bupati",
  "Walikota",
  "Wakil Walikota",
  "Anggota DPRD Provinsi",
  "Anggota DPRD Kabupaten/Kota",
  "Dosen",
  "Guru",
  "Pilot",
  "Pengacara",
  "Hakim",
  "Jaksa",
  "Manajer",
  "Programmer",
  "Penata Musik",
  "Penata Tari",
  "Perancang Busana",
  "Penyelam",
  "Penyelidik",
  "Pembimbing Kemasyarakatan",
  "Pramugari / Pramugara",
  "Teknisi",
  "Tenaga Pengajar",
  "Lainnya",
];
const pendidikanOptions = [
  "Tidak/Belum Sekolah",
  "Belum Tamat SD/Sederajat",
  "Tamat SD/Sederajat",
  "SLTP/Sederajat (SMP/MTs)",
  "SLTA/Sederajat (SMA/SMK/MA)",
  "Diploma I/II",
  "Diploma III",
  "Diploma IV / S1",
  "S2",
  "S3",
];

interface ErrorResponseData {
  message?: string;
  errors?: Record<string, string[]>;
}

// DateInputPicker component for tanggal_lahir
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
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    parseInputToDate(value),
  );
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [inputValue, setInputValue] = React.useState(value);

  React.useEffect(() => {
    setInputValue(value);
    setDate(parseInputToDate(value));
    setMonth(parseInputToDate(value));
  }, [value]);

  return (
    <div className="relative flex gap-2">
      <Input
        id="tanggal_lahir"
        name="tanggal_lahir"
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
            <CalendarIcon className="size-3.5" />
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
            onSelect={(d) => {
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

export default function PendudukEdit() {
  const { nik } = useParams<{ nik: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PendudukFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchPenduduk = async () => {
      if (!nik) {
        setError("NIK tidak ditemukan di URL.");
        setFetching(false);
        return;
      }
      setFetching(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Token tidak ditemukan. Silakan login kembali.");
          setFetching(false);
          navigate("/");
          return;
        }
        const response = await axios.get(
          `${API_CONFIG.baseURL}/api/penduduk/cari?query=${nik}`,
          {
            headers: {
              ...API_CONFIG.headers,
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (Array.isArray(response.data) && response.data.length > 0) {
          const data = response.data[0];
          // --- PERUBAHAN DIMULAI ---
          // Handle format tanggal lahir DD-MM-YYYY dari API
          let formattedTgl = "";
          if (data.tanggal_lahir) {
            const [day, month, year] = data.tanggal_lahir.split("-");
            if (day && month && year) {
              formattedTgl = `${day}/${month}/${year}`;
            } else {
              formattedTgl = "";
            }
          }
          setFormData({ ...data, tanggal_lahir: formattedTgl });
          // --- PERUBAHAN SELESAI ---
        } else {
          setError("Data penduduk tidak ditemukan.");
        }
      } catch {
        setError("Gagal mengambil data penduduk.");
      } finally {
        setFetching(false);
      }
    };
    fetchPenduduk();
  }, [nik, navigate]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof PendudukFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    for (const key in formData) {
      if (formData[key as keyof PendudukFormData] === "") {
        setError(`Kolom ${key.replace("_", " ")} harus diisi.`);
        setLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Token tidak ditemukan. Silakan login kembali.");
        setLoading(false);
        navigate("/");
        return;
      }
      // Convert date format from DD/MM/YYYY to YYYY-MM-DD for submission
      const [day, month, year] = formData.tanggal_lahir.split("/");
      const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      const submitData = {
        ...formData,
        tanggal_lahir: formattedDate,
      };
      const response = await axios.put(
        `${API_CONFIG.baseURL}/api/penduduk/${nik}`,
        submitData,
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        setSuccess("Data penduduk berhasil diperbarui!");
        toast.success("Data penduduk berhasil diperbarui!", {
          description: "Anda akan diarahkan ke halaman daftar penduduk...",
          duration: 2000,
        });
        setTimeout(() => navigate("/admin/penduduk"), 2000);
      } else {
        setError(
          (response.data as ErrorResponseData)?.message ||
            "Gagal memperbarui data penduduk.",
        );
        toast.error("Gagal memperbarui data penduduk.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponseData>;
        if (axiosError.response) {
          if (axiosError.response.status === 401) {
            setError("Sesi Anda telah berakhir. Silakan login kembali.");
            navigate("/");
          } else if (
            axiosError.response.data &&
            axiosError.response.data.errors
          ) {
            const messages = Object.values(
              axiosError.response.data.errors,
            ).flat();
            setError(messages.join(" \n"));
            toast.error("Gagal memperbarui data penduduk", {
              description: messages.join(" \n"),
            });
          } else if (
            axiosError.response.data &&
            axiosError.response.data.message
          ) {
            setError(axiosError.response.data.message);
            toast.error("Gagal memperbarui data penduduk", {
              description: axiosError.response.data.message,
            });
          } else {
            setError("Terjadi kesalahan saat memperbarui data.");
            toast.error("Terjadi kesalahan saat memperbarui data.");
          }
        } else {
          setError("Terjadi kesalahan jaringan atau request tidak sampai.");
          toast.error("Terjadi kesalahan jaringan atau request tidak sampai.");
        }
      } else {
        setError("Terjadi kesalahan yang tidak diketahui.");
        toast.error("Terjadi kesalahan yang tidak diketahui.");
      }
    }
    setLoading(false);
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
                    onClick={() => navigate(-1)}
                    className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      Edit Data Penduduk
                    </h1>
                    <p className="text-sm text-gray-500">
                      Formulir Edit Data Penduduk
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4">
            {/* Alerts */}
            {error && (
              <div className="animate-in slide-in-from-top-1 mb-6 rounded-xl border border-red-200 bg-red-50/80 p-4 backdrop-blur-sm">
                <div className="flex items-center">
                  <AlertCircle className="mr-3 h-5 w-5 text-red-500" />
                  <p className="font-medium text-red-700">{error}</p>
                </div>
              </div>
            )}
            {success && (
              <div className="animate-in slide-in-from-top-1 mb-6 rounded-xl border border-green-200 bg-green-50/80 p-4 backdrop-blur-sm">
                <div className="flex items-center">
                  <CheckCircle className="mr-3 h-5 w-5 text-green-500" />
                  <p className="font-medium text-green-700">{success}</p>
                </div>
              </div>
            )}
            {/* Loading State */}
            {fetching ? (
              <div className="flex justify-center py-10">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-400 border-t-transparent" />
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200/50 bg-white/70 shadow-xl backdrop-blur-sm">
                <form onSubmit={handleSubmit} className="space-y-8 p-8">
                  {/* Informasi Personal */}
                  <div className="mb-6 flex items-center space-x-3 border-b border-gray-200 pb-4">
                    <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-3">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Informasi Personal
                      </h3>
                      <p className="text-sm text-gray-600">
                        Data dasar identitas penduduk
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="nik" className="text-gray-700">
                        NIK <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="nik"
                          name="nik"
                          value={formData.nik}
                          disabled
                          maxLength={16}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          className="cursor-not-allowed bg-gray-100 pl-10"
                          placeholder="Masukkan NIK 16 digit"
                          required
                        />
                        <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="no_kk" className="text-gray-700">
                        Nomor KK <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="no_kk"
                          name="no_kk"
                          value={formData.no_kk}
                          onChange={handleChange}
                          maxLength={16}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          className="pl-10"
                          placeholder="Masukkan Nomor KK 16 digit"
                          required
                        />
                        <BookUser className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nama" className="text-gray-700">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nama"
                        name="nama"
                        value={formData.nama}
                        onChange={handleChange}
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tempat_lahir" className="text-gray-700">
                        Tempat Lahir <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="tempat_lahir"
                          name="tempat_lahir"
                          value={formData.tempat_lahir}
                          onChange={handleChange}
                          className="pl-10"
                          placeholder="Masukkan tempat lahir"
                          required
                        />
                        <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tanggal_lahir" className="text-gray-700">
                        Tanggal Lahir <span className="text-red-500">*</span>
                      </Label>
                      <DateInputPicker
                        value={formData.tanggal_lahir}
                        onChange={(val) => {
                          setFormData((prev) => ({
                            ...prev,
                            tanggal_lahir: val,
                          }));
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jenis_kelamin" className="text-gray-700">
                        Jenis Kelamin <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        name="jenis_kelamin"
                        value={formData.jenis_kelamin}
                        onValueChange={(value) =>
                          handleSelectChange("jenis_kelamin", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Jenis Kelamin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                          <SelectItem value="Perempuan">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agama" className="text-gray-700">
                        Agama <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        name="agama"
                        value={formData.agama}
                        onValueChange={(value) =>
                          handleSelectChange("agama", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Agama" />
                        </SelectTrigger>
                        <SelectContent>
                          {agamaOptions.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Informasi Alamat */}
                  <div className="mt-10 mb-6 flex items-center space-x-3 border-b border-gray-200 pb-4">
                    <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-3">
                      <Home className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Informasi Alamat
                      </h3>
                      <p className="text-sm text-gray-600">
                        Alamat tempat tinggal lengkap
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="alamat" className="text-gray-700">
                        Alamat Lengkap <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="alamat"
                        name="alamat"
                        value={formData.alamat}
                        onChange={handleChange}
                        rows={3}
                        className="resize-none"
                        placeholder="Masukkan alamat lengkap"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rt" className="text-gray-700">
                        RT <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="rt"
                        name="rt"
                        value={formData.rt}
                        onChange={handleChange}
                        maxLength={3}
                        placeholder="001"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rw" className="text-gray-700">
                        RW <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="rw"
                        name="rw"
                        value={formData.rw}
                        onChange={handleChange}
                        maxLength={3}
                        placeholder="001"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="desa_kelurahan" className="text-gray-700">
                        Desa/Kelurahan <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="desa_kelurahan"
                        name="desa_kelurahan"
                        value={formData.desa_kelurahan}
                        onChange={handleChange}
                        placeholder="Nama desa/kelurahan"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kecamatan" className="text-gray-700">
                        Kecamatan <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="kecamatan"
                        name="kecamatan"
                        value={formData.kecamatan}
                        onChange={handleChange}
                        placeholder="Nama kecamatan"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kabupaten_kota" className="text-gray-700">
                        Kabupaten/Kota <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="kabupaten_kota"
                        name="kabupaten_kota"
                        value={formData.kabupaten_kota}
                        onChange={handleChange}
                        placeholder="Nama kabupaten/kota"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="provinsi" className="text-gray-700">
                        Provinsi <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="provinsi"
                        name="provinsi"
                        value={formData.provinsi}
                        onChange={handleChange}
                        placeholder="Nama provinsi"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kode_pos" className="text-gray-700">
                        Kode Pos <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="kode_pos"
                        name="kode_pos"
                        value={formData.kode_pos}
                        onChange={handleChange}
                        maxLength={5}
                        placeholder="12345"
                        required
                      />
                    </div>
                  </div>

                  {/* Informasi Tambahan */}
                  <div className="mt-10 mb-6 flex items-center space-x-3 border-b border-gray-200 pb-4">
                    <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-3">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Informasi Tambahan
                      </h3>
                      <p className="text-sm text-gray-600">
                        Data pelengkap identitas
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="status_perkawinan"
                        className="text-gray-700"
                      >
                        Status Perkawinan{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        name="status_perkawinan"
                        value={formData.status_perkawinan}
                        onValueChange={(value) =>
                          handleSelectChange("status_perkawinan", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Status Perkawinan" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusPerkawinanOptions.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pekerjaan" className="text-gray-700">
                        Pekerjaan <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        name="pekerjaan"
                        value={formData.pekerjaan}
                        onValueChange={(value) =>
                          handleSelectChange("pekerjaan", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Pekerjaan" />
                        </SelectTrigger>
                        <SelectContent>
                          {pekerjaanOptions.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="kewarganegaraan"
                        className="text-gray-700"
                      >
                        Kewarganegaraan <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        name="kewarganegaraan"
                        value={formData.kewarganegaraan}
                        onValueChange={(value) =>
                          handleSelectChange("kewarganegaraan", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Kewarganegaraan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WNI">WNI</SelectItem>
                          <SelectItem value="WNA">WNA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pendidikan" className="text-gray-700">
                        Pendidikan Terakhir{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        name="pendidikan"
                        value={formData.pendidikan}
                        onValueChange={(value) =>
                          handleSelectChange("pendidikan", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Pendidikan Terakhir" />
                        </SelectTrigger>
                        <SelectContent>
                          {pendidikanOptions.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-12 flex items-center justify-end border-t border-gray-200 pt-8">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 px-8 py-3 text-white transition-all hover:from-green-700 hover:to-blue-700 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Simpan Perubahan</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
