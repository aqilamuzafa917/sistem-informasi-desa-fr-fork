import React, { useState } from "react";
import axios from "axios";
import {
  FileText,
  User,
  ChevronLeft,
  Check,
  Save,
  Calendar as CalendarIcon,
} from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TimePicker } from "@/components/ui/datetime-picker";
import { API_CONFIG } from "../../config/api";
import { toast } from "sonner";
import { SuratPayload } from "@/types/surat";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// Interface for Pengikut data
interface Pengikut {
  nik: string;
}

// Interface for the form data
interface FormData
  extends Omit<Partial<SuratPayload>, "attachment_bukti_pendukung"> {
  attachment_bukti_pendukung?: File | null;
  data_pengikut_pindah?: Pengikut[]; // Update type for data_pengikut_pindah
}

const jenisSuratOptions = [
  { value: "", label: "Pilih Jenis Surat" },
  { value: "SK_DOMISILI", label: "SK Domisili" },
  { value: "SK_PINDAH", label: "SK Pindah" },
  { value: "SK_KEMATIAN", label: "SK Kematian" },
  { value: "SK_KELAHIRAN", label: "SK Kelahiran" },
  { value: "SK_USAHA", label: "SK Usaha" },
  { value: "SKTM", label: "SK Tidak Mampu (SKTM)" },
  {
    value: "KARTU_INDONESIA_PINTAR",
    label: "SKTM untuk Kartu Indonesia Pintar (KIP)",
  },
  { value: "SK_KEHILANGAN_KTP", label: "SK Kehilangan KTP" },
];

// DateInputPicker component for date fields
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
  id,
  name,
  placeholder = "DD/MM/YYYY",
}: {
  value: string;
  onChange: (val: string) => void;
  id: string;
  name: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(parseInputToDate(value));
  const [month, setMonth] = useState<Date | undefined>(date);
  const [inputValue, setInputValue] = useState(value);

  React.useEffect(() => {
    setInputValue(value);
    setDate(parseInputToDate(value));
    setMonth(parseInputToDate(value));
  }, [value]);

  return (
    <div className="relative flex gap-2">
      <Input
        id={id}
        name={name}
        value={inputValue}
        placeholder={placeholder}
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
            <CalendarIcon size={16} />
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
            onSelect={(d: Date | undefined) => {
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

export default function SuratCreate() {
  const navigate = useNavigate();
  const [jenisSurat, setJenisSurat] = useState("");
  const [formData, setFormData] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pengikutList, setPengikutList] = useState<Pengikut[]>([]); // Initialize as empty array to make it optional

  const steps = [
    { id: 1, title: "Pilih Surat", icon: FileText },
    { id: 2, title: "Isi Data", icon: User },
  ];

  const handleInputChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | { target: { name: string; value: unknown } },
  ) => {
    const { name, value } = e.target;
    let processedValue: string | number | null = value as string;

    // Handle number inputs
    if (e.target instanceof HTMLInputElement && e.target.type === "number") {
      processedValue = value === "" ? "" : Number(value);
    }
    // Handle empty values - keep as empty string instead of null
    else if (value === "") {
      processedValue = "";
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: processedValue,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalFiles = uploadedFiles.length + newFiles.length;

    // Validate file count
    if (totalFiles > 2) {
      setUploadError("Maksimal 2 file yang dapat diupload");
      return;
    }

    // Validate file types and sizes
    const validFiles = newFiles.filter((file) => {
      const isValidType = [
        "application/pdf",
        "image/jpeg",
        "image/png",
      ].includes(file.type);
      const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB

      if (!isValidType) {
        setUploadError("Format file harus PDF, JPG, atau PNG");
        return false;
      }
      if (!isValidSize) {
        setUploadError("Ukuran file maksimal 2MB");
        return false;
      }
      return true;
    });

    if (validFiles.length !== newFiles.length) {
      return;
    }

    setUploadedFiles((prev) => [...prev, ...validFiles]);
    setUploadError(null);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddPengikut = () => {
    setPengikutList((prev) => [...prev, { nik: "" }]);
  };

  const handleRemovePengikut = (index: number) => {
    setPengikutList((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePengikutNikChange = (index: number, value: string) => {
    setPengikutList((prev) =>
      prev.map((pengikut, i) =>
        i === index ? { ...pengikut, nik: value } : pengikut,
      ),
    );
  };

  const validateNIK = (nik: string) => {
    return nik && nik.length === 16 && /^\d+$/.test(nik);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formDataToSend = new FormData();

    // Add basic fields
    formDataToSend.append("jenis_surat", jenisSurat);
    formDataToSend.append(
      "tanggal_pengajuan",
      new Date().toISOString().split("T")[0],
    );
    formDataToSend.append("status_surat", "Diajukan");

    // Add all form fields except data_pengikut_pindah
    Object.entries(formData).forEach(([key, value]) => {
      if (
        value !== null &&
        value !== undefined &&
        key !== "data_pengikut_pindah"
      ) {
        // Convert DD/MM/YYYY format to YYYY-MM-DD for date fields
        if (typeof value === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
          const [day, month, year] = value.split("/");
          const isoDate = `${year}-${month}-${day}`;
          formDataToSend.append(key, isoDate);
        } else {
          formDataToSend.append(key, String(value));
        }
      }
    });

    // Handle data_pengikut_pindah with Laravel/PHP style array format
    if (jenisSurat === "SK_PINDAH") {
      const filteredPengikut = pengikutList.filter((p) => p.nik.trim() !== "");

      // Validate all NIKs
      const invalidNIK = filteredPengikut.find(
        (pengikut) => !validateNIK(pengikut.nik),
      );
      if (invalidNIK) {
        toast.error("NIK pengikut tidak valid", {
          description: `NIK ${invalidNIK.nik} harus 16 digit angka.`,
        });
        setIsLoading(false);
        return;
      }

      // Format pengikut data in Laravel/PHP style array format
      filteredPengikut.forEach((pengikut, index) => {
        formDataToSend.append(
          `data_pengikut_pindah[${index}][nik]`,
          pengikut.nik,
        );
      });
    }

    // Add files to FormData
    uploadedFiles.forEach((file, index) => {
      formDataToSend.append(`attachment_bukti_pendukung[${index}]`, file);
    });

    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      await axios.post(`${API_CONFIG.baseURL}/api/surat`, formDataToSend, {
        headers: {
          ...API_CONFIG.headers,
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Pengajuan surat berhasil dikirim!");
      setJenisSurat("");
      setFormData({});
      setUploadedFiles([]);
      setCurrentStep(1);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Check for specific data_pengikut_pindah errors
        if (error.response.data.errors?.data_pengikut_pindah) {
          toast.error("Error pada data pengikut", {
            description:
              error.response.data.errors.data_pengikut_pindah.join("\n"),
          });
        } else {
          const errorMessages = error.response.data.errors
            ? Object.values(error.response.data.errors).flat().join("\n")
            : error.response.data.message || "Terjadi kesalahan pada server.";
          toast.error("Gagal mengirim pengajuan", {
            description: errorMessages,
          });
        }
      } else {
        toast.error("Gagal mengirim pengajuan", {
          description: "Silakan coba lagi.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormField = (
    name: keyof FormData,
    label: string,
    type: string = "text",
    required: boolean = true,
    options?: { value: string; label: string }[],
    component?: "input" | "textarea" | "select",
  ) => (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {component === "textarea" ? (
        <Textarea
          id={name}
          name={name}
          value={(formData[name] as string) || ""}
          onChange={handleInputChange}
          required={required}
          className="bg-background"
          placeholder={`Masukkan ${label.toLowerCase()}`}
        />
      ) : component === "select" && options ? (
        <select
          id={name}
          name={name}
          value={(formData[name] as string) || ""}
          onChange={handleInputChange}
          required={required}
          className="bg-background w-full rounded-md border p-2"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "file" ? (
        <Input
          id={name}
          name={name}
          type={type}
          onChange={handleFileChange}
          required={required}
          className="bg-background"
        />
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          value={(formData[name] as string) || ""}
          onChange={handleInputChange}
          required={required}
          className="bg-background"
          placeholder={`Masukkan ${label.toLowerCase()}`}
        />
      )}
    </div>
  );

  const renderForm = () => {
    switch (jenisSurat) {
      case "SK_DOMISILI":
        return (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {renderFormField("nik_pemohon", "NIK Pemohon", "text", true)}
            {renderFormField(
              "keperluan",
              "Keperluan",
              "text",
              true,
              undefined,
              "textarea",
            )}
          </div>
        );
      case "SK_PINDAH":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField("nik_pemohon", "NIK Pemohon")}
              {renderFormField(
                "keperluan",
                "Keperluan",
                "text",
                true,
                undefined,
                "textarea",
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField("alamat_tujuan", "Alamat Tujuan")}
              <div className="grid grid-cols-2 gap-6">
                {renderFormField("rt_tujuan", "RT Tujuan")}
                {renderFormField("rw_tujuan", "RW Tujuan")}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField(
                "kelurahan_desa_tujuan",
                "Kelurahan/Desa Tujuan",
              )}
              {renderFormField("kecamatan_tujuan", "Kecamatan Tujuan")}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField(
                "kabupaten_kota_tujuan",
                "Kabupaten/Kota Tujuan",
              )}
              {renderFormField("provinsi_tujuan", "Provinsi Tujuan")}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField(
                "alasan_pindah",
                "Alasan Pindah",
                "text",
                true,
                [
                  { value: "", label: "Pilih Alasan" },
                  { value: "Pekerjaan", label: "Pekerjaan" },
                  { value: "Pendidikan", label: "Pendidikan" },
                  { value: "Keamanan", label: "Keamanan" },
                  { value: "Kesehatan", label: "Kesehatan" },
                  { value: "Perumahan", label: "Perumahan" },
                  { value: "Keluarga", label: "Keluarga" },
                  { value: "Lainnya", label: "Lainnya" },
                ],
                "select",
              )}
              {renderFormField(
                "klasifikasi_pindah",
                "Klasifikasi Pindah",
                "text",
                true,
                [
                  { value: "", label: "Pilih Klasifikasi" },
                  {
                    value: "Dalam Satu Kelurahan/Desa",
                    label: "Dalam Satu Kelurahan/Desa",
                  },
                  {
                    value: "Antar Kelurahan/Desa",
                    label: "Antar Kelurahan/Desa",
                  },
                  { value: "Antar Kecamatan", label: "Antar Kecamatan" },
                  {
                    value: "Antar Kabupaten/Kota dalam satu Provinsi",
                    label: "Antar Kabupaten/Kota dalam satu Provinsi",
                  },
                  { value: "Antar Provinsi", label: "Antar Provinsi" },
                ],
                "select",
              )}
            </div>
            <div>
              <Label>Data Pengikut Pindah</Label>
              <p className="text-muted-foreground mb-2 text-sm">
                Tambahkan NIK pengikut yang ikut pindah.
              </p>
              {pengikutList.map((pengikut, index) => (
                <div key={index} className="mb-3 flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`nik_pengikut_${index}`} className="mb-2">
                      NIK Pengikut {index + 1}
                    </Label>
                    <Input
                      id={`nik_pengikut_${index}`}
                      name={`nik_pengikut_${index}`}
                      type="text"
                      value={pengikut.nik}
                      onChange={(e) =>
                        handlePengikutNikChange(index, e.target.value)
                      }
                      className="bg-background"
                      placeholder="Masukkan NIK Pengikut"
                    />
                  </div>
                  {pengikutList.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleRemovePengikut(index)}
                    >
                      Hapus
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                onClick={handleAddPengikut}
                className="bg-gray-800 text-white hover:bg-gray-900"
              >
                + Tambah Pengikut
              </Button>
            </div>
          </div>
        );
      case "SK_KEMATIAN":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField("nik_pemohon", "NIK Pemohon (Pelapor)")}
              {renderFormField(
                "keperluan",
                "Keperluan Surat Kematian",
                "text",
                true,
                undefined,
                "textarea",
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField(
                "nik_penduduk_meninggal",
                "NIK Penduduk Meninggal",
              )}
              <div className="space-y-2">
                <Label htmlFor="tanggal_kematian">
                  Tanggal Kematian <span className="text-destructive">*</span>
                </Label>
                <DateInputPicker
                  value={formData.tanggal_kematian || ""}
                  onChange={(val) => {
                    handleInputChange({
                      target: {
                        name: "tanggal_kematian",
                        value: val,
                      },
                    });
                  }}
                  id="tanggal_kematian"
                  name="tanggal_kematian"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="waktu_kematian">
                  Waktu Kematian <span className="text-destructive">*</span>
                </Label>
                <TimePicker
                  date={undefined}
                  onChange={(time: Date | undefined) => {
                    handleInputChange({
                      target: {
                        name: "waktu_kematian",
                        value: time ? time.toTimeString().slice(0, 5) : "",
                      },
                    });
                  }}
                  placeholder="Pilih waktu kematian"
                />
              </div>
              {renderFormField("tempat_kematian", "Tempat Kematian")}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField("penyebab_kematian", "Penyebab Kematian")}
              {renderFormField(
                "hubungan_pelapor_kematian",
                "Hubungan Pelapor dengan yang Meninggal",
              )}
            </div>
          </div>
        );
      case "SK_KELAHIRAN":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField("nik_pemohon", "NIK Pemohon (Pelapor)")}
              {renderFormField(
                "hubungan_pelapor_lahir",
                "Hubungan Pelapor dengan Bayi",
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField("nik_penduduk_ibu", "NIK Ibu")}
              {renderFormField("nik_penduduk_ayah", "NIK Ayah")}
            </div>
            {renderFormField(
              "keperluan",
              "Keperluan Surat Kelahiran",
              "text",
              true,
              undefined,
              "textarea",
            )}
            <hr />
            <h3 className="text-lg font-medium">Data Bayi</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField("nama_bayi", "Nama Bayi")}
              {renderFormField(
                "jenis_kelamin_bayi",
                "Jenis Kelamin Bayi",
                "text",
                true,
                [
                  { value: "", label: "Pilih Jenis Kelamin" },
                  { value: "Laki-laki", label: "Laki-laki" },
                  { value: "Perempuan", label: "Perempuan" },
                ],
                "select",
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField(
                "tempat_dilahirkan",
                "Tempat Dilahirkan (RS, Rumah, dll)",
              )}
              {renderFormField(
                "tempat_kelahiran",
                "Tempat Kelahiran (Kota/Kab)",
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tanggal_lahir_bayi">
                  Tanggal Lahir Bayi <span className="text-destructive">*</span>
                </Label>
                <DateInputPicker
                  value={formData.tanggal_lahir_bayi || ""}
                  onChange={(val) => {
                    handleInputChange({
                      target: {
                        name: "tanggal_lahir_bayi",
                        value: val,
                      },
                    });
                  }}
                  id="tanggal_lahir_bayi"
                  name="tanggal_lahir_bayi"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="waktu_lahir_bayi">
                  Waktu Lahir Bayi <span className="text-destructive">*</span>
                </Label>
                <TimePicker
                  date={undefined}
                  onChange={(time: Date | undefined) => {
                    handleInputChange({
                      target: {
                        name: "waktu_lahir_bayi",
                        value: time ? time.toTimeString().slice(0, 5) : "",
                      },
                    });
                  }}
                  placeholder="Pilih waktu lahir"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField(
                "jenis_kelahiran",
                "Jenis Kelahiran",
                "text",
                true,
                [
                  { value: "", label: "Pilih Jenis Kelahiran" },
                  { value: "Tunggal", label: "Tunggal" },
                  { value: "Kembar 2", label: "Kembar 2" },
                  { value: "Kembar 3", label: "Kembar 3" },
                  { value: "Kembar 4", label: "Kembar 4" },
                  { value: "Lainnya", label: "Lainnya" },
                ],
                "select",
              )}
              {renderFormField("anak_ke", "Anak Ke-", "number")}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField(
                "penolong_kelahiran",
                "Penolong Kelahiran",
                "text",
                true,
                [
                  { value: "", label: "Pilih Penolong" },
                  { value: "Dokter", label: "Dokter" },
                  { value: "Bidan/Perawat", label: "Bidan/Perawat" },
                  { value: "Dukun", label: "Dukun" },
                  { value: "Lainnya", label: "Lainnya" },
                ],
                "select",
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField("berat_bayi_kg", "Berat Bayi (kg)", "number")}
              {renderFormField(
                "panjang_bayi_cm",
                "Panjang Bayi (cm)",
                "number",
              )}
            </div>
          </div>
        );
      case "SK_USAHA":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField("nik_pemohon", "NIK Pemohon")}
              {renderFormField(
                "keperluan",
                "Keperluan Surat Usaha",
                "text",
                true,
                undefined,
                "textarea",
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField("nama_usaha", "Nama Usaha")}
              {renderFormField("jenis_usaha", "Jenis Usaha")}
            </div>
            {renderFormField(
              "alamat_usaha",
              "Alamat Usaha",
              "text",
              true,
              undefined,
              "textarea",
            )}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField(
                "status_bangunan_usaha",
                "Status Bangunan Usaha",
                "text",
                true,
                [
                  { value: "", label: "Pilih Status" },
                  { value: "Milik Sendiri", label: "Milik Sendiri" },
                  { value: "Sewa", label: "Sewa" },
                  { value: "Kontrak", label: "Kontrak" },
                  { value: "Lainnya", label: "Lainnya" },
                ],
                "select",
              )}
              <div className="space-y-2">
                <Label htmlFor="sejak_tanggal_usaha">
                  Sejak Tanggal Usaha{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <DateInputPicker
                  value={formData.sejak_tanggal_usaha || ""}
                  onChange={(val) => {
                    handleInputChange({
                      target: {
                        name: "sejak_tanggal_usaha",
                        value: val,
                      },
                    });
                  }}
                  id="sejak_tanggal_usaha"
                  name="sejak_tanggal_usaha"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {renderFormField(
                "perkiraan_modal_usaha",
                "Perkiraan Modal Usaha (Rp)",
                "number",
              )}
              {renderFormField(
                "perkiraan_pendapatan_usaha",
                "Perkiraan Pendapatan Usaha /bulan (Rp)",
                "number",
              )}
              {renderFormField(
                "jumlah_tenaga_kerja",
                "Jumlah Tenaga Kerja",
                "number",
              )}
            </div>
          </div>
        );
      case "SKTM":
      case "KARTU_INDONESIA_PINTAR":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField(
                "nik_pemohon",
                "NIK Pemohon (Kepala Keluarga atau yang bertanggung jawab)",
              )}
              {renderFormField(
                "keperluan",
                "Keperluan Surat",
                "text",
                true,
                undefined,
                "textarea",
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField(
                "penghasilan_perbulan_kepala_keluarga",
                "Penghasilan Perbulan Kepala Keluarga (Rp)",
                "number",
              )}
              {renderFormField(
                "pekerjaan_kepala_keluarga",
                "Pekerjaan Kepala Keluarga",
              )}
            </div>
            {jenisSurat === "KARTU_INDONESIA_PINTAR" && (
              <>
                <hr />
                <h3 className="text-lg font-medium">Data Siswa Penerima KIP</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {renderFormField("nik_penduduk_siswa", "NIK Siswa")}
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {renderFormField("nama_sekolah", "Nama Sekolah")}
                  {renderFormField("nisn_siswa", "NISN Siswa")}
                </div>
                {renderFormField("kelas_siswa", "Kelas Siswa")}
              </>
            )}
          </div>
        );
      case "SK_KEHILANGAN_KTP":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField("nik_pemohon", "NIK Pemohon")}
              {renderFormField(
                "keperluan",
                "Keperluan Surat Kehilangan KTP",
                "text",
                false,
                undefined,
                "textarea",
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField("nomor_ktp_hilang", "Nomor KTP yang Hilang")}
              <div className="space-y-2">
                <Label htmlFor="tanggal_perkiraan_hilang">
                  Tanggal Perkiraan Hilang{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <DateInputPicker
                  value={formData.tanggal_perkiraan_hilang || ""}
                  onChange={(val) => {
                    handleInputChange({
                      target: {
                        name: "tanggal_perkiraan_hilang",
                        value: val,
                      },
                    });
                  }}
                  id="tanggal_perkiraan_hilang"
                  name="tanggal_perkiraan_hilang"
                />
              </div>
            </div>
            {renderFormField(
              "lokasi_perkiraan_hilang",
              "Lokasi Perkiraan Hilang",
            )}
            {renderFormField(
              "kronologi_singkat",
              "Kronologi Singkat Kehilangan",
              "text",
              true,
              undefined,
              "textarea",
            )}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderFormField(
                "nomor_laporan_polisi",
                "Nomor Laporan Polisi (Jika Ada)",
                "text",
                false,
              )}
              <div className="space-y-2">
                <Label htmlFor="tanggal_laporan_polisi">
                  Tanggal Laporan Polisi (Jika Ada)
                </Label>
                <DateInputPicker
                  value={formData.tanggal_laporan_polisi || ""}
                  onChange={(val) => {
                    handleInputChange({
                      target: {
                        name: "tanggal_laporan_polisi",
                        value: val,
                      },
                    });
                  }}
                  id="tanggal_laporan_polisi"
                  name="tanggal_laporan_polisi"
                />
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-muted-foreground py-8 text-center">
            Silakan pilih jenis surat untuk menampilkan formulir pengajuan.
          </div>
        );
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
                    onClick={() => navigate("/admin/surat")}
                    className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      Buat Pengajuan Surat
                    </h1>
                    <p className="text-sm text-gray-500">
                      Lengkapi informasi pengajuan surat
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <main className="flex-1 overflow-auto p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-8">
              <div className="mb-8">
                {/* Progress Steps - New Compact Pills Design */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute top-6 right-0 left-0 -z-10 h-0.5 bg-gray-200">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
                        style={{
                          width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                        }}
                      />
                    </div>

                    <div className="flex justify-between">
                      {steps.map((step) => {
                        const Icon = step.icon;
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;

                        return (
                          <button
                            key={step.id}
                            onClick={() => setCurrentStep(step.id)}
                            className={`group relative flex flex-col items-center transition-all duration-300 ${
                              isActive ? "scale-105" : "hover:scale-102"
                            }`}
                          >
                            {/* Icon Circle */}
                            <div
                              className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
                                isActive
                                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
                                  : isCompleted
                                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25"
                                    : "border-2 border-gray-200 bg-white text-gray-400 group-hover:border-gray-300 group-hover:text-gray-600"
                              }`}
                            >
                              {isCompleted ? (
                                <Check size={20} className="animate-pulse" />
                              ) : (
                                <Icon size={20} />
                              )}

                              {/* Pulse animation for active step */}
                              {isActive && (
                                <div className="absolute inset-0 animate-ping rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20" />
                              )}
                            </div>

                            {/* Step Title */}
                            <span
                              className={`mt-2 text-sm font-medium transition-colors duration-300 ${
                                isActive
                                  ? "text-blue-600"
                                  : isCompleted
                                    ? "text-green-600"
                                    : "text-gray-500 group-hover:text-gray-700"
                              }`}
                            >
                              {step.title}
                            </span>

                            {/* Step Number Badge */}
                            <div
                              className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                                isActive
                                  ? "bg-blue-100 text-blue-600"
                                  : isCompleted
                                    ? "bg-green-100 text-green-600"
                                    : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {step.id}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <Card className="p-6">
                  <div className="space-y-6">
                    {currentStep === 1 && (
                      <div className="space-y-2">
                        <Label htmlFor="jenis_surat">
                          Jenis Surat{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <select
                          id="jenis_surat"
                          name="jenis_surat"
                          value={jenisSurat}
                          onChange={(e) => {
                            setJenisSurat(e.target.value);
                          }}
                          required
                          className="bg-background w-full rounded-md border p-2"
                        >
                          {jenisSuratOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {currentStep === 2 && jenisSurat && (
                      <Card className="border p-6 shadow-sm">
                        <h2 className="mb-4 text-xl font-semibold">
                          Detail untuk{" "}
                          {jenisSuratOptions.find(
                            (opt) => opt.value === jenisSurat,
                          )?.label || jenisSurat}
                        </h2>
                        {renderForm()}
                      </Card>
                    )}

                    {/* Common field for all letters */}
                    {currentStep === 2 && (
                      <div className="space-y-2">
                        <Label htmlFor="attachment_bukti_pendukung">
                          Lampiran Bukti Pendukung (Opsional)
                        </Label>
                        <Input
                          id="attachment_bukti_pendukung"
                          name="attachment_bukti_pendukung"
                          type="file"
                          onChange={handleFileChange}
                          className="bg-background"
                        />
                        <p className="text-muted-foreground text-sm">
                          Unggah file jika ada bukti pendukung yang diperlukan
                          (misalnya: surat pengantar RT/RW, foto, dll).
                        </p>
                        {uploadError && (
                          <p className="text-destructive text-sm">
                            {uploadError}
                          </p>
                        )}
                        {uploadedFiles.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {uploadedFiles.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between rounded-lg border p-2"
                              >
                                <span className="text-sm">{file.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                >
                                  Hapus
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-6 flex justify-between border-t pt-6">
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentStep(Math.max(1, currentStep - 1))
                        }
                        disabled={currentStep === 1}
                        className="flex h-12 w-32 items-center justify-center space-x-2 rounded-xl border border-gray-300 px-8 py-3 font-semibold text-gray-700 shadow-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Sebelumnya
                      </button>
                      <div className="flex gap-3">
                        {currentStep < 2 ? (
                          <button
                            type="button"
                            onClick={() =>
                              setCurrentStep(Math.min(2, currentStep + 1))
                            }
                            disabled={!jenisSurat}
                            className="flex h-12 w-32 items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Selanjutnya
                          </button>
                        ) : (
                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex h-12 w-32 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isLoading ? (
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
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </form>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
