import { useState } from "react";
import {
  AlertCircle,
  X,
  Upload,
  Phone,
  User,
  FileText,
  Tag,
  Camera,
  CheckCircle,
  Send,
} from "lucide-react";
import axios from "axios";
import { API_CONFIG } from "../config/api";

interface FormData {
  nama: string;
  nomor_telepon: string;
  kategori: string;
  detail_pengaduan: string;
  media: File[];
}

const kategoriOptions = [
  { value: "", label: "Pilih Kategori Pengaduan", icon: "📝" },
  { value: "Umum", label: "Umum", icon: "📢" },
  { value: "Sosial", label: "Sosial", icon: "👥" },
  { value: "Keamanan", label: "Keamanan", icon: "🔒" },
  { value: "Kesehatan", label: "Kesehatan", icon: "🏥" },
  { value: "Kebersihan", label: "Kebersihan", icon: "🧹" },
  { value: "Permintaan", label: "Permintaan", icon: "📋" },
];

interface PengaduanPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PengaduanPopup({ isOpen, onClose }: PengaduanPopupProps) {
  const [formData, setFormData] = useState<FormData>({
    nama: "",
    nomor_telepon: "",
    kategori: "",
    detail_pengaduan: "",
    media: [],
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const validFiles: File[] = [];
      for (const file of newFiles) {
        if (file.size > 2 * 1024 * 1024) {
          setFileUploadError("Ukuran file maksimal 2MB");
          return;
        }
        validFiles.push(file);
      }
      setFileUploadError(null);
      setFormData((prev) => ({
        ...prev,
        media: [...prev.media, ...validFiles],
      }));
      const newPreviewUrls = validFiles.map((file) =>
        URL.createObjectURL(file),
      );
      setPreviewImages((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => {
      const newFiles = [...prev.media];
      newFiles.splice(index, 1);
      return { ...prev, media: newFiles };
    });
    setPreviewImages((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.nomor_telepon)) {
      setSubmitError("Nomor telepon harus berupa angka dan minimal 10 digit");
      setIsSubmitting(false);
      return;
    }
    if (!formData.kategori) {
      setSubmitError("Kategori pengaduan harus dipilih");
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nama", formData.nama);
      formDataToSend.append("nomor_telepon", formData.nomor_telepon);
      formDataToSend.append("kategori", formData.kategori);
      formDataToSend.append("detail_pengaduan", formData.detail_pengaduan);
      formData.media.forEach((file) => {
        formDataToSend.append("media[]", file);
      });

      await axios.post(
        `${API_CONFIG.baseURL}/api/publik/pengaduan`,
        formDataToSend,
        {
          headers: {
            ...API_CONFIG.headers,
          },
        },
      );

      setSubmitSuccess(true);

      setTimeout(() => {
        setFormData({
          nama: "",
          nomor_telepon: "",
          kategori: "",
          detail_pengaduan: "",
          media: [],
        });
        previewImages.forEach((url) => URL.revokeObjectURL(url));
        setPreviewImages([]);
        setSubmitSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error submitting pengaduan:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        setSubmitError(errorMessage);
      } else {
        setSubmitError(
          "Terjadi kesalahan saat mengirim pengaduan. Silakan coba lagi.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative z-10 max-h-screen w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 rounded-t-2xl border-b border-gray-100 bg-white p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Pengaduan Warga
                </h2>
                <p className="text-sm text-gray-500">
                  Laporkan masalah atau keluhan Anda
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Success State */}
        {submitSuccess && (
          <div className="p-6">
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">
                Pengaduan Berhasil Dikirim!
              </h3>
              <p className="text-gray-600">
                Petugas desa akan segera menindaklanjuti laporan Anda.
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        {!submitSuccess && (
          <div className="space-y-6 p-6">
            {/* Error Alert */}
            {submitError && (
              <div className="flex items-center space-x-3 rounded-lg border border-red-200 bg-red-50 p-4">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            )}

            {/* File Upload Error */}
            {fileUploadError && (
              <div className="flex items-center space-x-3 rounded-lg border border-red-200 bg-red-50 p-4">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                <p className="text-sm text-red-700">{fileUploadError}</p>
              </div>
            )}

            {/* Name and Phone */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <User className="h-4 w-4" />
                  <span>Nama Lengkap</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  placeholder="Masukkan nama lengkap Anda"
                  value={formData.nama}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Phone className="h-4 w-4" />
                  <span>Nomor Telepon</span>
                </label>
                <input
                  type="tel"
                  name="nomor_telepon"
                  placeholder="081234567890"
                  value={formData.nomor_telepon}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Tag className="h-4 w-4" />
                <span>Kategori Pengaduan</span>
              </label>
              <select
                name="kategori"
                value={formData.kategori}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-gray-200 px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                {kategoriOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Detail */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <FileText className="h-4 w-4" />
                <span>Detail Pengaduan</span>
              </label>
              <textarea
                name="detail_pengaduan"
                placeholder="Jelaskan secara detail pengaduan atau masalah yang Anda alami..."
                value={formData.detail_pengaduan}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Camera className="h-4 w-4" />
                <span>Upload Foto (Opsional)</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
                <div className="flex w-full flex-col items-center justify-center space-y-2 rounded-lg border-2 border-dashed border-gray-200 px-4 py-6 transition-colors hover:border-blue-400">
                  <Upload className="h-6 w-6 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Klik untuk upload atau drag & drop
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG, PNG (Max 2MB per file)
                  </p>
                </div>
              </div>
              {/* Image Previews */}
              {previewImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {previewImages.map((url, index) => (
                    <div key={index} className="group relative">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="h-20 w-full rounded-lg border border-gray-200 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-colors group-hover:opacity-100 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="border-t border-gray-100 pt-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`flex w-full items-center justify-center space-x-2 rounded-lg px-4 py-3 font-medium text-white transition-all ${
                  isSubmitting
                    ? "cursor-not-allowed bg-gray-400"
                    : "transform bg-blue-600 hover:scale-105 hover:bg-blue-700 hover:shadow-lg"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Kirim Pengaduan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
