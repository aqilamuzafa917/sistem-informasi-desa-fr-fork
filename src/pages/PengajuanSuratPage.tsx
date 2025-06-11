import { useState } from "react";
import axios from "axios";
import { FileText, ArrowLeft } from "lucide-react";
import NavbarDesa from "@/components/NavbarDesa";
import FooterDesa from "@/components/FooterDesa";
import { API_CONFIG } from "../config/api";
import { SuratPayload } from "@/types/surat";
import PengajuanFormSteps from "@/components/pengajuan-surat/PengajuanFormSteps";
import InfoCardsSection from "@/components/pengajuan-surat/InfoCardsSection";
import { Button } from "@/components/ui/button";

export default function PengajuanSuratPage() {
  const [jenisSurat, setJenisSurat] = useState("");
  const [formData, setFormData] = useState<Partial<SuratPayload>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleBack = () => {
    setJenisSurat("");
    setFormData({});
    setUploadedFiles([]);
    setCurrentStep(1);
    setUploadError(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    let processedValue: string | number | null = value;

    if (type === "number") {
      processedValue = value === "" ? null : parseFloat(value);
    } else if (type === "date" || name.includes("tanggal")) {
      processedValue = value === "" ? null : value;
    } else if (value === "") {
      processedValue = null;
    }

    setFormData({
      ...formData,
      [name]: processedValue,
    });
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
      if (value !== null && value !== undefined && key !== "data_pengikut_pindah") {
        formDataToSend.append(key, String(value));
      }
    });

    // Handle data_pengikut_pindah with Laravel/PHP style array format
    if (formData.data_pengikut_pindah && Array.isArray(formData.data_pengikut_pindah)) {
      // Remove duplicate NIKs
      const uniquePengikut = (formData.data_pengikut_pindah as Array<{ nik: string }>)
        .filter((pengikut, index, self) => 
          index === self.findIndex(p => p.nik === pengikut.nik)
        );

      // Validate all NIKs
      const invalidNIK = uniquePengikut.find(pengikut => !validateNIK(pengikut.nik));
      if (invalidNIK) {
        alert(`NIK pengikut tidak valid: ${invalidNIK.nik}. NIK harus 16 digit angka.`);
        setIsLoading(false);
        return;
      }

      // Format pengikut data in Laravel/PHP style array format
      uniquePengikut.forEach((pengikut, index) => {
        formDataToSend.append(`data_pengikut_pindah[${index}][nik]`, pengikut.nik);
      });
    }

    // Add files to FormData
    uploadedFiles.forEach((file, index) => {
      formDataToSend.append(`attachment_bukti_pendukung[${index}]`, file);
    });

    try {
      const response = await axios.post(
        `${API_CONFIG.baseURL}/api/publik/surat`,
        formDataToSend,
        {
          headers: {
            ...API_CONFIG.headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Pengajuan surat berhasil dikirim!");
      setJenisSurat("");
      setFormData({});
      setUploadedFiles([]);
      setCurrentStep(1);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Check for specific data_pengikut_pindah errors
        if (error.response.data.errors?.data_pengikut_pindah) {
          alert(`Error pada data pengikut: ${error.response.data.errors.data_pengikut_pindah.join("\n")}`);
        } else {
          const errorMessages = error.response.data.errors
            ? Object.values(error.response.data.errors).flat().join("\n")
            : error.response.data.message || "Terjadi kesalahan pada server.";
          alert(`Gagal mengirim pengajuan:\n${errorMessages}`);
        }
      } else {
        alert("Gagal mengirim pengajuan. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <NavbarDesa />

      <main className="container mx-auto flex-grow px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Pengajuan Surat Online
          </h1>
          <p className="mx-auto max-w-2xl text-gray-600">
            Ajukan berbagai jenis surat keterangan dengan mudah dan cepat.
            Proses pengajuan akan diselesaikan dalam 1-3 hari kerja.
          </p>
        </div>

        {/* Back Button - Only show when jenis surat is selected */}
        {jenisSurat && (
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Pilihan Surat
            </Button>
          </div>
        )}

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
      </main>

      <FooterDesa />
    </div>
  );
}
