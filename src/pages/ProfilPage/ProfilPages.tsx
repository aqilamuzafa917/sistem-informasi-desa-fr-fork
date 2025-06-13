import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_CONFIG } from "../../config/api";
import { Spinner } from "@/components/ui/spinner";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";

interface DesaProfil {
  id: number;
  nama_desa: string;
  sejarah: string;
  visi: string;
  misi: string;
  alamat_kantor: string;
  struktur_organisasi: Array<{
    path: string;
    type: string;
    name: string;
    url: string;
  }>;
  batas_wilayah: {
    utara: string;
    timur: string;
    selatan: string;
    barat: string;
  };
  luas_desa: number;
  social_media: Array<{
    platform: string;
    url: string;
    username: string;
  }>;
}

export default function ProfilPages() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profil, setProfil] = useState<DesaProfil>({
    id: 1,
    nama_desa: "",
    sejarah: "",
    visi: "",
    misi: "",
    alamat_kantor: "",
    struktur_organisasi: [],
    batas_wilayah: {
      utara: "",
      timur: "",
      selatan: "",
      barat: "",
    },
    luas_desa: 0,
    social_media: [],
  });

  const fetchProfil = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_CONFIG.baseURL}/api/profil-desa/1`,
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setProfil(response.data);
    } catch (error) {
      toast.error("Gagal mengambil data profil desa", {
        duration: 3000,
      });
      console.error("Error fetching profil:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("authToken");

      await axios.patch(`${API_CONFIG.baseURL}/api/profil-desa/1`, profil, {
        headers: {
          ...API_CONFIG.headers,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Profil desa berhasil disimpan", {
        duration: 2000,
      });

      setTimeout(() => {
        fetchProfil();
      }, 1000);
    } catch (error) {
      toast.error("Gagal menyimpan profil desa", {
        duration: 3000,
      });
      console.error("Error saving profil:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (
    field: keyof DesaProfil,
    value: string | number,
  ) => {
    setProfil((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBatasWilayahChange = (
    field: keyof typeof profil.batas_wilayah,
    value: string,
  ) => {
    setProfil((prev) => ({
      ...prev,
      batas_wilayah: {
        ...prev.batas_wilayah,
        [field]: value,
      },
    }));
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${API_CONFIG.baseURL}/api/upload-struktur-organisasi`,
        formData,
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setProfil((prev) => ({
        ...prev,
        struktur_organisasi: [response.data],
      }));

      toast.success("File berhasil diunggah", {
        duration: 2000,
      });
    } catch (error) {
      toast.error("Gagal mengunggah file", {
        duration: 3000,
      });
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    fetchProfil();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          {/* Header */}
          <div className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Profil Desa
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Kelola informasi dan profil desa
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="min-h-[100vh] flex-1 rounded-xl bg-transparent p-4 md:min-h-min">
              {isLoading ? (
                <div className="flex h-40 items-center justify-center">
                  <Spinner size="xl" text="Memuat data..." />
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="grid gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Informasi Umum</CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nama_desa">Nama Desa</Label>
                          <Input
                            id="nama_desa"
                            value={profil.nama_desa}
                            onChange={(e) =>
                              handleInputChange("nama_desa", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sejarah">Sejarah Desa</Label>
                          <Textarea
                            id="sejarah"
                            value={profil.sejarah}
                            onChange={(e) =>
                              handleInputChange("sejarah", e.target.value)
                            }
                            className="min-h-[200px]"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Visi & Misi</CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="visi">Visi</Label>
                          <Textarea
                            id="visi"
                            value={profil.visi}
                            onChange={(e) =>
                              handleInputChange("visi", e.target.value)
                            }
                            className="min-h-[100px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="misi">Misi</Label>
                          <Textarea
                            id="misi"
                            value={profil.misi}
                            onChange={(e) =>
                              handleInputChange("misi", e.target.value)
                            }
                            className="min-h-[200px]"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Informasi Lokasi</CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="alamat_kantor">Alamat Kantor</Label>
                          <Input
                            id="alamat_kantor"
                            value={profil.alamat_kantor}
                            onChange={(e) =>
                              handleInputChange("alamat_kantor", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="luas_desa">Luas Desa (Hektar)</Label>
                          <Input
                            id="luas_desa"
                            type="number"
                            value={profil.luas_desa}
                            onChange={(e) =>
                              handleInputChange(
                                "luas_desa",
                                parseInt(e.target.value),
                              )
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Batas Wilayah</CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="batas_utara">Batas Utara</Label>
                          <Input
                            id="batas_utara"
                            value={profil.batas_wilayah.utara}
                            onChange={(e) =>
                              handleBatasWilayahChange("utara", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="batas_timur">Batas Timur</Label>
                          <Input
                            id="batas_timur"
                            value={profil.batas_wilayah.timur}
                            onChange={(e) =>
                              handleBatasWilayahChange("timur", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="batas_selatan">Batas Selatan</Label>
                          <Input
                            id="batas_selatan"
                            value={profil.batas_wilayah.selatan}
                            onChange={(e) =>
                              handleBatasWilayahChange(
                                "selatan",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="batas_barat">Batas Barat</Label>
                          <Input
                            id="batas_barat"
                            value={profil.batas_wilayah.barat}
                            onChange={(e) =>
                              handleBatasWilayahChange("barat", e.target.value)
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Struktur Organisasi</CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="struktur_organisasi">
                            Upload Struktur Organisasi
                          </Label>
                          <div className="flex items-center gap-4">
                            <Input
                              id="struktur_organisasi"
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              disabled={isUploading}
                              className="flex-1"
                            />
                            {isUploading && <Spinner size="sm" />}
                          </div>
                          {profil.struktur_organisasi.length > 0 && (
                            <div className="mt-4">
                              <p className="text-sm text-gray-500">
                                File saat ini:
                              </p>
                              <a
                                href={profil.struktur_organisasi[0].url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {profil.struktur_organisasi[0].name}
                              </a>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 md:w-auto"
                    >
                      {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
