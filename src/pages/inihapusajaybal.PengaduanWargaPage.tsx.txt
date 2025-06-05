import { useState } from "react";
import { Card } from "@/components/ui/card";
import NavbarDesa from "@/components/NavbarDesa";
import FooterDesa from "@/components/FooterDesa";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
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

export default function PengaduanWargaPage() {
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

      // Create preview URLs for new images
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewImages((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => {
      const newFiles = [...prev.media];
      newFiles.splice(index, 1);
      return {
        ...prev,
        media: newFiles,
      };
    });

    setPreviewImages((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]); // Cleanup the URL
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    // Validasi nomor telepon (hanya angka dan minimal 10 digit)
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

      const response = await axios.post(
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

      // Reset form dan preview images
      setFormData({
        nama: "",
        nomor_telepon: "",
        kategori: "",
        detail_pengaduan: "",
        media: [],
      });

      // Cleanup preview URLs
      previewImages.forEach((url) => URL.revokeObjectURL(url));
      setPreviewImages([]);

      // Wait for 2 seconds to show toast before refreshing
      setTimeout(() => {
        window.location.reload();
      }, 2000);
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
    <div className="flex min-h-screen flex-col">
      <Toaster richColors position="top-center" />
      <NavbarDesa />
      <div className="container mx-auto flex-grow px-4 py-8">
        <Card className="p-6">
          <h2 className="mb-6 text-2xl font-bold">Pengaduan Warga</h2>
          <p className="mb-6 text-gray-600">
            Silakan lengkapi formulir di bawah ini untuk melaporkan kejadian
            atau masalah yang sedang Anda alami. Pengaduan Anda akan
            ditindaklanjuti oleh petugas desa dalam waktu 1-3 hari kerja.
          </p>
          {submitError && (
            <div className="mb-6 rounded-lg bg-red-100 p-4 text-sm text-red-700 dark:bg-red-200 dark:text-red-800">
              {submitError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                className="min-h-[120px] w-full rounded-md border p-2"
                placeholder="Jelaskan secara detail pengaduan atau masalah yang Anda alami..."
                value={formData.detail_pengaduan}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-4">
              <div>
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
                <p className="text-sm text-gray-500">
                  Upload foto atau dokumen pendukung (JPG, PNG, PDF, maks. 5MB)
                </p>
              </div>

              {previewImages.length > 0 && (
                <div className="flex flex-wrap justify-start gap-4">
                  {previewImages.map((preview, index) => (
                    <div
                      key={index}
                      className="group relative"
                      style={{ maxWidth: "150px" }}
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-32 w-full rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="bg-destructive text-destructive-foreground absolute top-2 right-2 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Hapus gambar"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Mengirim..." : "Kirim Pengaduan"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
      <FooterDesa />
    </div>
  );
}
