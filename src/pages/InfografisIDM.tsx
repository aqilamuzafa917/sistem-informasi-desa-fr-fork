import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NavbarDesa from "@/components/NavbarDesa";
import FooterDesa from "@/components/FooterDesa";
import InfografisNav from "@/components/InfografisNav";
import { useDesa } from "@/contexts/DesaContext";
import React from "react";

export default function InfografisIDM() {
  const { loading } = useDesa();

  // Data IDM
  const tahun = "2024";
  const skorIDM = "0.7925";
  const statusIDM = "MAJU";
  const targetStatus = "MANDIRI";
  const skorMinimal = "0.8156";
  const penambahan = "0.0231";

  // Data komponen IDM
  const skorIKS = "0.7943"; // Indeks Ketahanan Sosial
  const skorIKE = "0.7167"; // Indeks Ketahanan Ekonomi
  const skorIKL = "0.8667"; // Indeks Ketahanan Ekologi/Lingkungan

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <NavbarDesa />
        <div className="container mx-auto px-4">
          <InfografisNav activeTab="idm" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navbar Section */}
      <NavbarDesa />

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <InfografisNav activeTab="idm" />

        {/* Judul Demografi */}
        <div className="mb-8 px-4 py-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              Indeks Desa Membangun (IDM)
            </h2>
            <p className="mt-2 text-xl text-gray-600 dark:text-gray-400">
              Indeks Desa Membangun (IDM) merupakan indeks komposit yang
              dibentuk dari tiga indeks, yaitu Indeks Ketahanan Sosial, Indeks
              Ketahanan Ekonomi, dan Indeks Ketahanan Ekologi/Lingkungan.
            </p>
          </div>
        </div>

        {/* Konten IDM */}
        <div className="mx-auto max-w-6xl px-4 py-8">
          {/* Skor dan Status IDM */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>SKOR IDM {tahun}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-right text-5xl font-bold text-gray-700 dark:text-gray-300">
                  {skorIDM}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>STATUS IDM {tahun}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-right text-5xl font-bold text-gray-700 dark:text-gray-300">
                  {statusIDM}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Target, Skor Minimal, dan Penambahan */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Target Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-right text-3xl font-bold text-gray-700 dark:text-gray-300">
                  {targetStatus}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Skor Minimal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-right text-3xl font-bold text-gray-700 dark:text-gray-300">
                  {skorMinimal}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Penambahan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-right text-3xl font-bold text-gray-700 dark:text-gray-300">
                  {penambahan}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Komponen IDM: IKS, IKE, IKL */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Skor IKS</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-right text-3xl font-bold text-gray-700 dark:text-gray-300">
                  {skorIKS}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Skor IKE</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-right text-3xl font-bold text-gray-700 dark:text-gray-300">
                  {skorIKE}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Skor IKL</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-right text-3xl font-bold text-gray-700 dark:text-gray-300">
                  {skorIKL}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <FooterDesa />
    </div>
  );
}
