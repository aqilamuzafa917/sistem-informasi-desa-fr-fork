import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { AppSidebar } from "@/components/app-sidebar";
import { API_CONFIG } from "@/config/api";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
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
import { ArrowLeft, ChevronsUpDown, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Alert, Spinner } from "flowbite-react";

interface PendudukFormData {
  nik: string;
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
}

const initialFormData: PendudukFormData = {
  nik: "",
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

interface ErrorResponseData {
  message?: string;
  errors?: Record<string, string[]>;
}

export default function TambahKtpPages() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PendudukFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openPekerjaan, setOpenPekerjaan] = useState(false);

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

      const response = await axios.post(
        `${API_CONFIG.baseURL}/api/penduduk`,
        formData,
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

  const formGridClass =
    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 items-start";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={() => navigate("/dataktp")}>
                    Data KTP
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Tambah Data Penduduk</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <Button
            variant="outline"
            onClick={() => navigate("/dataktp")}
            className="mb-6 w-fit"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <Alert color="failure" onDismiss={() => setError(null)}>
                <span className="font-medium">Error!</span> {error}
              </Alert>
            )}
            {success && (
              <Alert color="success" onDismiss={() => setSuccess(null)}>
                <span className="font-medium">Sukses!</span> {success}
              </Alert>
            )}

            <div className={formGridClass}>
              <div>
                <Label htmlFor="nik" className="mb-2 block">
                  NIK
                </Label>
                <Input
                  id="nik"
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  maxLength={16}
                  required
                />
              </div>
              <div>
                <Label htmlFor="nama" className="mb-2 block">
                  Nama Lengkap
                </Label>
                <Input
                  id="nama"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="tempat_lahir" className="mb-2 block">
                  Tempat Lahir
                </Label>
                <Input
                  id="tempat_lahir"
                  name="tempat_lahir"
                  value={formData.tempat_lahir}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={formGridClass}>
              <div>
                <Label htmlFor="tanggal_lahir" className="mb-2 block">
                  Tanggal Lahir
                </Label>
                <Input
                  id="tanggal_lahir"
                  name="tanggal_lahir"
                  type="date"
                  value={formData.tanggal_lahir}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="jenis_kelamin" className="mb-2 block">
                  Jenis Kelamin
                </Label>
                <Select
                  name="jenis_kelamin"
                  value={formData.jenis_kelamin}
                  onValueChange={(value) =>
                    handleSelectChange("jenis_kelamin", value)
                  }
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Jenis Kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="agama" className="mb-2 block">
                  Agama
                </Label>
                <Select
                  name="agama"
                  value={formData.agama}
                  onValueChange={(value) => handleSelectChange("agama", value)}
                  required
                >
                  <SelectTrigger className="w-full">
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

            <div className="space-y-2">
              <Label htmlFor="alamat" className="mb-2 block">
                Alamat Lengkap
              </Label>
              <Textarea
                id="alamat"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                required
              />
            </div>

            <div className={formGridClass}>
              <div>
                <Label htmlFor="rt" className="mb-2 block">
                  RT
                </Label>
                <Input
                  id="rt"
                  name="rt"
                  value={formData.rt}
                  onChange={handleChange}
                  maxLength={3}
                  required
                />
              </div>
              <div>
                <Label htmlFor="rw" className="mb-2 block">
                  RW
                </Label>
                <Input
                  id="rw"
                  name="rw"
                  value={formData.rw}
                  onChange={handleChange}
                  maxLength={3}
                  required
                />
              </div>
              <div>
                <Label htmlFor="desa_kelurahan" className="mb-2 block">
                  Desa/Kelurahan
                </Label>
                <Input
                  id="desa_kelurahan"
                  name="desa_kelurahan"
                  value={formData.desa_kelurahan}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={formGridClass}>
              <div>
                <Label htmlFor="kecamatan" className="mb-2 block">
                  Kecamatan
                </Label>
                <Input
                  id="kecamatan"
                  name="kecamatan"
                  value={formData.kecamatan}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="kabupaten_kota" className="mb-2 block">
                  Kabupaten/Kota
                </Label>
                <Input
                  id="kabupaten_kota"
                  name="kabupaten_kota"
                  value={formData.kabupaten_kota}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="provinsi" className="mb-2 block">
                  Provinsi
                </Label>
                <Input
                  id="provinsi"
                  name="provinsi"
                  value={formData.provinsi}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={formGridClass}>
              <div>
                <Label htmlFor="kode_pos" className="mb-2 block">
                  Kode Pos
                </Label>
                <Input
                  id="kode_pos"
                  name="kode_pos"
                  value={formData.kode_pos}
                  onChange={handleChange}
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status_perkawinan" className="mb-2 block">
                  Status Perkawinan
                </Label>
                <Select
                  name="status_perkawinan"
                  value={formData.status_perkawinan}
                  onValueChange={(value) =>
                    handleSelectChange("status_perkawinan", value)
                  }
                  required
                >
                  <SelectTrigger className="w-full">
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
              <div>
                <Label htmlFor="pekerjaan" className="mb-2 block">
                  Pekerjaan
                </Label>
                <Popover open={openPekerjaan} onOpenChange={setOpenPekerjaan}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openPekerjaan}
                      className="w-full justify-between"
                    >
                      <span className="truncate font-normal">
                        {formData.pekerjaan
                          ? pekerjaanOptions.find(
                              (opt) => opt === formData.pekerjaan,
                            )
                          : "Pilih Pekerjaan"}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="PopoverContent w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Cari Pekerjaan..." />
                      <CommandList>
                        <CommandEmpty>Pekerjaan tidak ditemukan.</CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-y-auto">
                          {pekerjaanOptions.map((opt) => (
                            <CommandItem
                              key={opt}
                              value={opt}
                              onSelect={(currentValue) => {
                                handleSelectChange(
                                  "pekerjaan",
                                  currentValue === formData.pekerjaan
                                    ? ""
                                    : currentValue,
                                );
                                setOpenPekerjaan(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.pekerjaan === opt
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {opt}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className={formGridClass}>
              <div>
                <Label htmlFor="kewarganegaraan" className="mb-2 block">
                  Kewarganegaraan
                </Label>
                <Select
                  name="kewarganegaraan"
                  value={formData.kewarganegaraan}
                  onValueChange={(value) =>
                    handleSelectChange("kewarganegaraan", value)
                  }
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Kewarganegaraan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WNI">WNI</SelectItem>
                    <SelectItem value="WNA">WNA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dataktp")}
              >
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Menyimpan...</span>
                  </>
                ) : (
                  "Simpan Data Penduduk"
                )}
              </Button>
            </div>
          </form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
