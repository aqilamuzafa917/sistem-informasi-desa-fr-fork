import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  });

  const fetchConfig = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.get<DesaConfig>(
        "https://thankful-urgently-silkworm.ngrok-free.app/api/desa-config",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
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

      await axios.put(
        "https://thankful-urgently-silkworm.ngrok-free.app/api/desa-config",
        config,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            "Content-Type": "application/json",
          },
        },
      );

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
      <Toaster position="top-right" richColors />
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Config Desa</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-transparent p-4 md:min-h-min">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <p>Loading...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="grid gap-6">
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
                            handleInputChange("nama_kecamatan", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nama_kabupaten">Nama Kabupaten</Label>
                        <Input
                          id="nama_kabupaten"
                          value={config.nama_kabupaten}
                          onChange={(e) =>
                            handleInputChange("nama_kabupaten", e.target.value)
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
                            handleInputChange("jabatan_kepala", e.target.value)
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
                        <Label htmlFor="nip_pejabat_ttd">NIP Pejabat TTD</Label>
                        <Input
                          id="nip_pejabat_ttd"
                          value={config.nip_pejabat_ttd}
                          onChange={(e) =>
                            handleInputChange("nip_pejabat_ttd", e.target.value)
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
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full md:w-auto"
                  >
                    {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
