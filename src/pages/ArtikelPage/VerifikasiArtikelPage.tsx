import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Toaster } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Helper function to format date strings
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString;
  }
};

// Interface for article media
interface MediaArtikel {
  path: string;
  type: string;
  name: string;
  url: string;
}

// Interface for article data
interface Artikel {
  id_artikel: number;
  jenis_artikel: string;
  status_artikel: string;
  judul_artikel: string;
  kategori_artikel: string;
  isi_artikel: string;
  penulis_artikel: string;
  tanggal_kejadian_artikel: string | null;
  tanggal_publikasi_artikel: string | null;
  latitude: number;
  longitude: number;
  location_name: string;
  media_artikel: MediaArtikel[];
  created_at: string;
  updated_at: string;
}

// Function to get user-friendly field labels
const getFieldLabel = (key: string): string => {
  const labels: Record<string, string> = {
    id_artikel: "ID Artikel",
    jenis_artikel: "Jenis Artikel",
    status_artikel: "Status Artikel",
    judul_artikel: "Judul Artikel",
    kategori_artikel: "Kategori Artikel",
    isi_artikel: "Isi Artikel",
    penulis_artikel: "Penulis Artikel",
    tanggal_kejadian_artikel: "Tanggal Kejadian",
    tanggal_publikasi_artikel: "Tanggal Publikasi",
    latitude: "Latitude",
    longitude: "Longitude",
    location_name: "Lokasi",
    media_artikel: "Media Artikel",
    created_at: "Dibuat Pada",
    updated_at: "Diperbarui Pada",
  };

  return (
    labels[key] ||
    key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
};

export default function VerifikasiArtikelPage() {
  const { id } = useParams();
  const [artikel, setArtikel] = useState<Artikel | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("diajukan");
  const [submitting, setSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchArtikel = async () => {
      try {
        const token =
          localStorage.getItem("token") || localStorage.getItem("authToken");
        const response = await axios.get(
          `https://thankful-urgently-silkworm.ngrok-free.app/api/artikel/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "69420",
            },
          },
        );
        console.log("API Response Data:", response.data);
        // Set artikel from response.data.data since the API wraps the article in a data field
        setArtikel(response.data.data);
        setStatus(response.data.data.status_artikel || "diajukan");
      } catch (error) {
        console.error("Gagal mengambil data artikel:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArtikel();
    }
  }, [id]);

  const handleVerifikasi = async () => {
    try {
      setSubmitting(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      await axios.patch(
        `https://thankful-urgently-silkworm.ngrok-free.app/api/artikel/${id}/status`,
        {
          status_artikel: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        },
      );
      toast.success("Artikel berhasil diverifikasi!", {
        description: "Status artikel telah diperbarui",
        duration: 2000,
      });
      // Wait for 2 seconds to show toast before redirecting
      setTimeout(() => {
        window.location.href = "/artikel";
      }, 2000);
    } catch (error) {
      console.error("Gagal memverifikasi artikel:", error);
      if (axios.isAxiosError(error) && error.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = Object.entries(error.response.data.errors)
          .map(
            ([field, messages]) =>
              `${field}: ${(messages as string[]).join(", ")}`,
          )
          .join("\n");
        toast.error("Gagal memverifikasi artikel", {
          description: errorMessages,
        });
      } else {
        toast.error("Gagal memverifikasi artikel", {
          description:
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan saat memverifikasi artikel. Silakan coba lagi.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      await axios.delete(
        `https://thankful-urgently-silkworm.ngrok-free.app/api/artikel/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        },
      );

      toast.success("Artikel berhasil dihapus!", {
        description: "Artikel telah dihapus dari sistem",
        duration: 2000,
      });

      // Wait for 2 seconds to show toast before redirecting
      setTimeout(() => {
        window.location.href = "/artikel";
      }, 2000);
    } catch (error) {
      console.error("Gagal menghapus artikel:", error);
      toast.error("Gagal menghapus artikel", {
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menghapus artikel. Silakan coba lagi.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter fields to display - exclude status, data, and message fields
  const nonNullFields = artikel
    ? Object.entries(artikel).filter(
        ([key, value]) =>
          value !== null &&
          key !== "id_artikel" &&
          key !== "created_at" &&
          key !== "updated_at" &&
          key !== "status_artikel" &&
          !["status", "data", "message"].includes(key),
      )
    : [];

  return (
    <>
      <Toaster richColors position="top-center" />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {loading ? (
            <div className="flex h-screen items-center justify-center">
              <div>Loading...</div>
            </div>
          ) : !artikel ? (
            <div className="flex h-screen items-center justify-center">
              <div>Data artikel tidak ditemukan.</div>
            </div>
          ) : (
            <>
              <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem className="hidden md:block">
                        Artikel
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Verifikasi Artikel</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </header>

              <main className="flex-1 overflow-auto p-4 md:p-6">
                <div className="mx-auto max-w-6xl space-y-8">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                      Verifikasi Artikel
                    </h1>
                  </div>

                  <Card className="p-6">
                    <div className="grid grid-cols-1 gap-6">
                      {nonNullFields.map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <Label htmlFor={key}>{getFieldLabel(key)}</Label>
                          {key === "isi_artikel" ? (
                            <div className="bg-muted min-h-[200px] rounded-md border p-4 whitespace-pre-wrap">
                              {value}
                            </div>
                          ) : key === "media_artikel" &&
                            Array.isArray(value) ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              {value.map((media, index) => (
                                <div key={index} className="space-y-2">
                                  {media.type.startsWith("image/") ? (
                                    <img
                                      src={media.url}
                                      alt={`Artikel media ${index + 1}`}
                                      className="max-h-[300px] w-full rounded-md object-cover"
                                    />
                                  ) : (
                                    <div className="bg-muted rounded-md border p-4">
                                      <a
                                        href={media.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                      >
                                        {media.name}
                                      </a>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : key === "latitude" || key === "longitude" ? (
                            <Input
                              id={key}
                              value={
                                typeof value === "number"
                                  ? value.toFixed(6)
                                  : value
                              }
                              readOnly
                              className="bg-muted"
                            />
                          ) : (
                            <Input
                              id={key}
                              value={(() => {
                                if (typeof value === "string") {
                                  if (
                                    [
                                      "tanggal_kejadian_artikel",
                                      "tanggal_publikasi_artikel",
                                      "created_at",
                                      "updated_at",
                                    ].includes(key)
                                  ) {
                                    return formatDate(value);
                                  }
                                }
                                return value?.toString() || "";
                              })()}
                              readOnly
                              className="bg-muted"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h2 className="mb-4 text-xl font-semibold">Verifikasi</h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="status">Status Artikel</Label>
                        <select
                          id="status"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="w-full rounded-md border p-2"
                        >
                          <option value="diajukan">Diajukan</option>
                          <option value="disetujui">Disetujui</option>
                          <option value="ditolak">Ditolak</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                        <div className="flex gap-4">
                          <Button
                            onClick={handleVerifikasi}
                            disabled={submitting}
                            className="w-full sm:w-auto"
                          >
                            {submitting ? "Memproses..." : "Simpan Verifikasi"}
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                disabled={isDeleting}
                                className="w-full sm:w-auto"
                              >
                                {isDeleting ? "Menghapus..." : "Hapus Artikel"}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Apakah Anda yakin?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tindakan ini tidak dapat dibatalkan. Artikel
                                  akan dihapus secara permanen dari sistem.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDelete}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </main>
            </>
          )}
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
