import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { AppSidebar } from "@/components/app-sidebar";
import { API_CONFIG } from "@/config/api";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
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
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PendudukFormData {
  nik: string;
  no_kk: string;
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: string; // YYYY-MM-DD
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

interface StepIndicatorProps {
  step: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
}

export default function TambahKtpPages() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PendudukFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [dateInput, setDateInput] = useState("");

  useEffect(() => {
    if (formData.tanggal_lahir) {
      const [day, month, year] = formData.tanggal_lahir.split("/");
      if (day && month && year) {
        setDateInput(
          `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
        );
      }
    }
  }, [formData.tanggal_lahir]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "tanggal_lahir") {
      setDateInput(value);
      if (value) {
        const [year, month, day] = value.split("-");
        if (year && month && day) {
          const formatted = `${day}/${month}/${year}`;
          setFormData((prev) => ({ ...prev, [name]: formatted }));
        }
      } else {
        setFormData((prev) => ({ ...prev, [name]: "" }));
      }
    } else if (name === "nik") {
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue.length <= 16) {
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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

      // Convert date format from DD/MM/YYYY to YYYY-MM-DD
      const [day, month, year] = formData.tanggal_lahir.split("/");
      const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

      const submitData = {
        ...formData,
        tanggal_lahir: formattedDate,
      };

      const response = await axios.post(
        `${API_CONFIG.baseURL}/api/penduduk`,
        submitData,
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 201 || response.status === 200) {
        setSuccess("Data penduduk berhasil ditambahkan!");
        setFormData(initialFormData);
        setTimeout(() => navigate("/dataktp"), 2000);
      } else {
        setError(
          (response.data as ErrorResponseData)?.message ||
            "Gagal menambahkan data penduduk.",
        );
      }
    } catch (err) {
      console.error("Error submitting form:", err);
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
          } else if (
            axiosError.response.data &&
            axiosError.response.data.message
          ) {
            setError(axiosError.response.data.message);
          } else {
            setError("Terjadi kesalahan saat menambahkan data.");
          }
        } else {
          setError("Terjadi kesalahan jaringan atau request tidak sampai.");
        }
      } else {
        setError("Terjadi kesalahan yang tidak diketahui.");
      }
    }
    setLoading(false);
  };

  const getCompletionPercentage = () => {
    const filledFields = Object.values(formData).filter(
      (value) => value !== "",
    ).length;
    return Math.round((filledFields / Object.keys(formData).length) * 100);
  };

  const getStepCompletion = (step: number) => {
    const stepFields = {
      1: [
        "nik",
        "nama",
        "tempat_lahir",
        "tanggal_lahir",
        "jenis_kelamin",
        "agama",
      ],
      2: [
        "alamat",
        "rt",
        "rw",
        "desa_kelurahan",
        "kecamatan",
        "kabupaten_kota",
        "provinsi",
        "kode_pos",
      ],
      3: ["status_perkawinan", "pekerjaan", "kewarganegaraan", "pendidikan"],
    };

    const fields = stepFields[step as keyof typeof stepFields] || [];
    const completed = fields.filter(
      (field) => formData[field as keyof PendudukFormData] !== "",
    ).length;
    return Math.round((completed / fields.length) * 100);
  };

  const StepIndicator = ({
    step,
    title,
    isActive,
    isCompleted,
  }: StepIndicatorProps) => (
    <div className={`flex items-center ${step < 3 ? "flex-1" : ""}`}>
      <div className="flex flex-col items-center">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
            isCompleted
              ? "border-green-500 bg-green-500 text-white"
              : isActive
                ? "border-blue-500 bg-blue-500 text-white"
                : "border-gray-300 bg-white text-gray-400"
          }`}
        >
          {isCompleted ? (
            <CheckCircle className="h-6 w-6" />
          ) : (
            <span className="font-semibold">{step}</span>
          )}
        </div>
        <div className="mt-2 text-center">
          <p
            className={`text-sm font-medium ${isActive ? "text-blue-600" : "text-gray-500"}`}
          >
            {title}
          </p>
          <p className="text-xs text-gray-400">
            {getStepCompletion(step)}% selesai
          </p>
        </div>
      </div>
      {step < 3 && (
        <div
          className={`mx-4 h-0.5 flex-1 ${getStepCompletion(step) === 100 ? "bg-green-500" : "bg-gray-200"}`}
        />
      )}
    </div>
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/90 backdrop-blur-lg">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Tambah Data Penduduk
                </h1>
                <p className="text-sm text-gray-500">
                  Formulir Pendaftaran KTP
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4">
          {/* Progress Overview */}
          <div className="mb-8 rounded-2xl border border-gray-200/50 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Progress Pengisian
                </h2>
                <p className="text-sm text-gray-600">
                  Lengkapi semua informasi yang diperlukan
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {getCompletionPercentage()}%
                  </p>
                  <p className="text-xs text-gray-500">Selesai</p>
                </div>
                <div className="h-16 w-16">
                  <svg className="h-16 w-16 -rotate-90 transform">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - getCompletionPercentage() / 100)}`}
                      className="text-blue-500 transition-all duration-500"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center">
              <StepIndicator
                step={1}
                title="Informasi Personal"
                isActive={currentStep === 1}
                isCompleted={getStepCompletion(1) === 100}
              />
              <StepIndicator
                step={2}
                title="Alamat"
                isActive={currentStep === 2}
                isCompleted={getStepCompletion(2) === 100}
              />
              <StepIndicator
                step={3}
                title="Data Tambahan"
                isActive={currentStep === 3}
                isCompleted={getStepCompletion(3) === 100}
              />
            </div>
          </div>

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

          {/* Form */}
          <div className="rounded-2xl border border-gray-200/50 bg-white/70 shadow-xl backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="p-8">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="animate-in fade-in-0 slide-in-from-right-2 space-y-8">
                  <div className="flex items-center space-x-3 border-b border-gray-200 pb-4">
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
                          onChange={handleChange}
                          maxLength={16}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          className="pl-10"
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
                        <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
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
                      <div className="relative">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start pl-10 text-left font-normal",
                                !formData.tanggal_lahir &&
                                  "text-muted-foreground",
                              )}
                            >
                              {formData.tanggal_lahir ? (
                                format(new Date(dateInput), "dd/MM/yyyy")
                              ) : (
                                <span>Pilih tanggal lahir</span>
                              )}
                              <CalendarIcon className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                dateInput ? new Date(dateInput) : undefined
                              }
                              onSelect={(date) => {
                                if (date) {
                                  const formattedDate = format(
                                    date,
                                    "yyyy-MM-dd",
                                  );
                                  setDateInput(formattedDate);
                                  const [year, month, day] =
                                    formattedDate.split("-");
                                  setFormData((prev) => ({
                                    ...prev,
                                    tanggal_lahir: `${day}/${month}/${year}`,
                                  }));
                                }
                              }}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              captionLayout="dropdown"
                              fromYear={1900}
                              toYear={new Date().getFullYear()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="jenis_kelamin"
                          className="text-gray-700"
                        >
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
                  </div>
                </div>
              )}

              {/* Step 2: Address Information */}
              {currentStep === 2 && (
                <div className="animate-in fade-in-0 slide-in-from-right-2 space-y-8">
                  <div className="flex items-center space-x-3 border-b border-gray-200 pb-4">
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
                </div>
              )}

              {/* Step 3: Additional Information */}
              {currentStep === 3 && (
                <div className="animate-in fade-in-0 slide-in-from-right-2 space-y-8">
                  <div className="flex items-center space-x-3 border-b border-gray-200 pb-4">
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
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-8">
                <button
                  type="button"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Sebelumnya</span>
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                    className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white transition-all hover:from-blue-700 hover:to-purple-700"
                  >
                    <span>Selanjutnya</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
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
                        <span>Simpan Data</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
