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

interface DesaConfig {
  kode: string;
  nama_kabupaten: string;
  nama_kecamatan: string;
  nama_desa: string;
  alamat_desa: string;
  kode_pos: string;
  nama_provinsi: string;
  jabatan_kepala: string;
  nama_kepala_desa: string;
  jabatan_ttd: string;
  nama_pejabat_ttd: string;
  nip_pejabat_ttd: string;
  sosial_media: string;
  website_desa: string;
  email_desa: string;
  telepon_desa: string;
  center_map: [number, number];
}

export default function ConfigPages() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState<DesaConfig>({
    kode: "",
    nama_kabupaten: "",
    nama_kecamatan: "",
    nama_desa: "",
    alamat_desa: "",
    kode_pos: "",
    nama_provinsi: "",
    jabatan_kepala: "",
    nama_kepala_desa: "",
    jabatan_ttd: "",
    nama_pejabat_ttd: "",
    nip_pejabat_ttd: "",
    sosial_media: "",
    website_desa: "",
    email_desa: "",
    telepon_desa: "",
    center_map: [-6.912986707035502, 107.5105222441776],
  });

  const fetchConfig = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_CONFIG.baseURL}/api/desa-config`,
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setConfig(response.data);
    } catch (error) {
      toast.error("Gagal mengambil data konfigurasi", {
        duration: 3000,
      });
      console.error("Error fetching config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("authToken");

      await axios.put(`${API_CONFIG.baseURL}/api/desa-config`, config, {
        headers: {
          ...API_CONFIG.headers,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Konfigurasi berhasil disimpan", {
        duration: 2000,
      });

      setTimeout(() => {
        fetchConfig();
      }, 1000);
    } catch (error) {
      toast.error("Gagal menyimpan konfigurasi", {
        duration: 3000,
      });
      console.error("Error saving config:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof DesaConfig, value: string) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    fetchConfig();
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
                  Konfigurasi Website Desa
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Kelola informasi dan pengaturan desa
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
                  <div className="-mt-4 grid gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Informasi Umum Desa</CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="kode">Kode Desa</Label>
                          <Input
                            id="kode"
                            value={config.kode}
                            onChange={(e) =>
                              handleInputChange("kode", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nama_desa">Nama Desa</Label>
                          <Input
                            id="nama_desa"
                            value={config.nama_desa}
                            onChange={(e) =>
                              handleInputChange("nama_desa", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nama_kecamatan">Nama Kecamatan</Label>
                          <Input
                            id="nama_kecamatan"
                            value={config.nama_kecamatan}
                            onChange={(e) =>
                              handleInputChange(
                                "nama_kecamatan",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nama_kabupaten">Nama Kabupaten</Label>
                          <Input
                            id="nama_kabupaten"
                            value={config.nama_kabupaten}
                            onChange={(e) =>
                              handleInputChange(
                                "nama_kabupaten",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nama_provinsi">Nama Provinsi</Label>
                          <Input
                            id="nama_provinsi"
                            value={config.nama_provinsi}
                            onChange={(e) =>
                              handleInputChange("nama_provinsi", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="kode_pos">Kode Pos</Label>
                          <Input
                            id="kode_pos"
                            value={config.kode_pos}
                            onChange={(e) =>
                              handleInputChange("kode_pos", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="alamat_desa">Alamat Desa</Label>
                          <Input
                            id="alamat_desa"
                            value={config.alamat_desa}
                            onChange={(e) =>
                              handleInputChange("alamat_desa", e.target.value)
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Informasi Kepala Desa</CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="jabatan_kepala">Jabatan Kepala</Label>
                          <Input
                            id="jabatan_kepala"
                            value={config.jabatan_kepala}
                            onChange={(e) =>
                              handleInputChange(
                                "jabatan_kepala",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nama_kepala_desa">
                            Nama Kepala Desa
                          </Label>
                          <Input
                            id="nama_kepala_desa"
                            value={config.nama_kepala_desa}
                            onChange={(e) =>
                              handleInputChange(
                                "nama_kepala_desa",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="jabatan_ttd">Jabatan TTD</Label>
                          <Input
                            id="jabatan_ttd"
                            value={config.jabatan_ttd}
                            onChange={(e) =>
                              handleInputChange("jabatan_ttd", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nama_pejabat_ttd">
                            Nama Pejabat TTD
                          </Label>
                          <Input
                            id="nama_pejabat_ttd"
                            value={config.nama_pejabat_ttd}
                            onChange={(e) =>
                              handleInputChange(
                                "nama_pejabat_ttd",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nip_pejabat_ttd">
                            NIP Pejabat TTD
                          </Label>
                          <Input
                            id="nip_pejabat_ttd"
                            value={config.nip_pejabat_ttd}
                            onChange={(e) =>
                              handleInputChange(
                                "nip_pejabat_ttd",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Kontak & Media</CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="sosial_media">Sosial Media</Label>
                          <Input
                            id="sosial_media"
                            value={config.sosial_media}
                            onChange={(e) =>
                              handleInputChange("sosial_media", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website_desa">Website Desa</Label>
                          <Input
                            id="website_desa"
                            value={config.website_desa}
                            onChange={(e) =>
                              handleInputChange("website_desa", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email_desa">Email Desa</Label>
                          <Input
                            id="email_desa"
                            value={config.email_desa}
                            onChange={(e) =>
                              handleInputChange("email_desa", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telepon_desa">Telepon Desa</Label>
                          <Input
                            id="telepon_desa"
                            value={config.telepon_desa}
                            onChange={(e) =>
                              handleInputChange("telepon_desa", e.target.value)
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Konfigurasi Peta</CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="latitude">Latitude</Label>
                          <Input
                            id="latitude"
                            type="number"
                            step="any"
                            value={config.center_map[0]}
                            onChange={(e) =>
                              setConfig((prev) => ({
                                ...prev,
                                center_map: [
                                  parseFloat(e.target.value),
                                  prev.center_map[1],
                                ],
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="longitude">Longitude</Label>
                          <Input
                            id="longitude"
                            type="number"
                            step="any"
                            value={config.center_map[1]}
                            onChange={(e) =>
                              setConfig((prev) => ({
                                ...prev,
                                center_map: [
                                  prev.center_map[0],
                                  parseFloat(e.target.value),
                                ],
                              }))
                            }
                          />
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
