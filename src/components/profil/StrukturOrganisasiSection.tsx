import { Card, CardContent } from "@/components/ui/card";
import { Image } from "lucide-react";

interface StrukturProps {
  namaDesa: string;
  strukturOrganisasiUrl?: string;
}

export default function StrukturOrganisasiSection({
  namaDesa,
  strukturOrganisasiUrl,
}: StrukturProps) {
  return (
    <section className="w-full bg-white py-16 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Struktur Organisasi
        </h2>
        <Card className="mx-auto max-w-4xl">
          <CardContent className="p-6 md:p-8">
            <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Struktur Organisasi {namaDesa}
            </h3>
            <div className="overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
              {strukturOrganisasiUrl ? (
                <img
                  src={strukturOrganisasiUrl}
                  alt={`Struktur Organisasi ${namaDesa}`}
                  className="h-auto w-full object-contain"
                />
              ) : (
                <div className="flex h-64 flex-col items-center justify-center text-gray-500">
                  <Image className="h-16 w-16" />
                  <p className="mt-2">Struktur organisasi tidak tersedia.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
