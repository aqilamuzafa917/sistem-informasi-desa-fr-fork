import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { AlertCircle, X } from "lucide-react";
import { toast } from "sonner";
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
  { value: "", label: "Pilih Kategori Pengaduan" },
  { value: "Umum", label: "Umum" },
  { value: "Sosial", label: "Sosial" },
  { value: "Keamanan", label: "Keamanan" },
  { value: "Kesehatan", label: "Kesehatan" },
  { value: "Kebersihan", label: "Kebersihan" },
  { value: "Permintaan", label: "Permintaan" },
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
      setFormData((prev) => ({
        ...prev,
        media: [...prev.media, ...newFiles],
      }));
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
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

  const handleSubmit = async (e: React.FormEvent) => {
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

      toast.success("Pengaduan berhasil dikirim!", {
        description: "Petugas desa akan segera menindaklanjuti laporan Anda.",
        duration: 2000,
      });

      setFormData({
        nama: "",
        nomor_telepon: "",
        kategori: "",
        detail_pengaduan: "",
        media: [],
      });

      previewImages.forEach((url) => URL.revokeObjectURL(url));
      setPreviewImages([]);
      onClose();
    } catch (error) {
      console.error("Error submitting pengaduan:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error("Gagal mengirim pengaduan", {
          description: errorMessage,
        });
      } else {
        toast.error("Gagal mengirim pengaduan", {
          description:
            "Terjadi kesalahan saat mengirim pengaduan. Silakan coba lagi.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      style={{
        backdropFilter: isOpen ? "blur(9px)" : "blur(0px)",
      }}
    >
      <div
        className={`relative mx-4 w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-95 opacity-0"
        }`}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 transition-all duration-200 hover:scale-110 hover:bg-gray-100"
        >
          <X className="h-4 w-4" />
        </Button>

        <h2 className="mb-4 text-2xl font-bold">Pengaduan Warga</h2>
        <p className="mb-6 text-sm text-gray-600">
          Silakan lengkapi formulir di bawah ini untuk melaporkan kejadian atau
          masalah yang sedang Anda alami.
        </p>

        {submitError && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input
                id="nama"
                name="nama"
                placeholder="Masukkan nama lengkap Anda"
                value={formData.nama}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nomor_telepon">Nomor Telepon</Label>
              <Input
                type="tel"
                id="nomor_telepon"
                name="nomor_telepon"
                placeholder="Contoh: 081234567890"
                value={formData.nomor_telepon}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="kategori">Kategori Pengaduan</Label>
            <select
              id="kategori"
              name="kategori"
              className="w-full rounded-md border p-2"
              value={formData.kategori}
              onChange={handleInputChange}
              required
            >
              {kategoriOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="detail_pengaduan">Detail Pengaduan</Label>
            <textarea
              id="detail_pengaduan"
              name="detail_pengaduan"
              className="min-h-[100px] w-full rounded-md border p-2"
              placeholder="Jelaskan secara detail pengaduan atau masalah yang Anda alami..."
              value={formData.detail_pengaduan}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="media">Lampiran (Opsional)</Label>
            <Input
              type="file"
              id="media"
              name="media"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
              multiple
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500">
              Upload foto atau dokumen pendukung (JPG, PNG, PDF, maks. 5MB)
            </p>
          </div>

          {previewImages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {previewImages.map((preview, index) => (
                <div key={index} className="group relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Pengaduan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
