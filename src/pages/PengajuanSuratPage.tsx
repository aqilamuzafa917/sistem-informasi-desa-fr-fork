import { useState } from "react";
import axios from "axios";
import { FileText } from "lucide-react";
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const submitData = new FormData();

    // Add jenis_surat first
    submitData.append("jenis_surat", jenisSurat);
    submitData.append(
      "tanggal_pengajuan",
      new Date().toISOString().split("T")[0],
    );
    submitData.append("status_surat", "Diajukan");

    // Add all form fields to FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        submitData.append(key, String(value));
      }
    });

    // Add files to FormData
    uploadedFiles.forEach((file, index) => {
      submitData.append(`attachment_bukti_pendukung[${index}]`, file);
    });

    try {
      const response = await axios.post(
        `${API_CONFIG.baseURL}/api/publik/surat`,
        submitData,
        {
          headers: {
            ...API_CONFIG.headers,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log("Respon API:", response.data);
      alert("Pengajuan surat berhasil dikirim!");
      setJenisSurat("");
      setFormData({});
      setUploadedFiles([]);
      setCurrentStep(1);
    } catch (error) {
      console.error("Error mengirim data:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Detail error:", error.response.data);
        const errorMessages = error.response.data.errors
          ? Object.values(error.response.data.errors).flat().join("\n")
          : error.response.data.message || "Terjadi kesalahan pada server.";
        alert(`Gagal mengirim pengajuan:\n${errorMessages}`);
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
