import { useState } from "react";
import axios from "axios";
import { FileText, ArrowLeft, User, FileCheck } from "lucide-react";
import { toast } from "sonner";
import NavbarDesa from "@/components/NavbarDesa";
import FooterDesa from "@/components/FooterDesa";
import { API_CONFIG } from "../config/api";
import { SuratPayload } from "@/types/surat";
import PengajuanFormSteps from "@/components/pengajuan-surat/PengajuanFormSteps";
import InfoCardsSection from "@/components/pengajuan-surat/InfoCardsSection";

export default function PengajuanSuratPage() {
  const [jenisSurat, setJenisSurat] = useState("");
  const [formData, setFormData] = useState<Partial<SuratPayload>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const steps = [
    { number: 1, title: "Pilih Surat", icon: FileText },
    { number: 2, title: "Isi Data", icon: User },
    { number: 3, title: "Review Data", icon: FileCheck },
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
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

      if (!isValidType) {
        setUploadError("Format file harus PDF, JPG, atau PNG");
        return false;
      }
      if (!isValidSize) {
        setUploadError("Ukuran file maksimal 5MB");
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
        formDataToSend.append(key, String(value));
      }
    });

    // Handle data_pengikut_pindah with Laravel/PHP style array format
    if (
      formData.data_pengikut_pindah &&
      Array.isArray(formData.data_pengikut_pindah)
    ) {
      // Remove duplicate NIKs
      const uniquePengikut = (
        formData.data_pengikut_pindah as Array<{ nik: string }>
      ).filter(
        (pengikut, index, self) =>
          index === self.findIndex((p) => p.nik === pengikut.nik),
      );

      // Validate all NIKs
      const invalidNIK = uniquePengikut.find(
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
      uniquePengikut.forEach((pengikut, index) => {
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
      await axios.post(
        `${API_CONFIG.baseURL}/api/publik/surat`,
        formDataToSend,
        {
          headers: {
            ...API_CONFIG.headers,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      toast.success("Pengajuan surat berhasil dikirim!", {
        description: "Silakan tunggu proses verifikasi dari petugas desa.",
        duration: 5000,
      });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <NavbarDesa />

      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => (window.location.href = "/")}
                className="rounded-lg p-2.5 transition-colors hover:bg-gray-100"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Pengajuan Surat Online
                </h1>
                <p className="text-base text-gray-600">
                  Ajukan berbagai jenis surat keterangan dengan mudah dan cepat
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`flex items-center space-x-2 rounded-lg px-3 py-2 transition-all ${
                    currentStep === step.number
                      ? "bg-blue-100 text-blue-700"
                      : currentStep > step.number
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                  <span className="hidden text-sm font-medium sm:block">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Main Form Steps */}
        <PengajuanFormSteps
          jenisSurat={jenisSurat}
          setJenisSurat={setJenisSurat}
          formData={formData}
          handleInputChange={handleInputChange}
          uploadedFiles={uploadedFiles}
          uploadError={uploadError}
          handleFileChange={handleFileChange}
          removeFile={removeFile}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />

        {/* Info Cards Section */}
        <InfoCardsSection />
      </div>

      <FooterDesa />
    </div>
  );
}