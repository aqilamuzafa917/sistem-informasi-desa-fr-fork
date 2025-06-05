import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";
import { DesaData } from "@/types/desa";

interface PetaLokasiProps {
  batasWilayah: DesaData["batas_wilayah"];
  luasDesa: number;
  alamatKantor: string;
  children: ReactNode;
}

export default function PetaLokasiSection({
  batasWilayah,
  luasDesa,
  alamatKantor,
  children,
}: PetaLokasiProps) {
  return (
    <section className="w-full bg-sky-50 py-16 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Peta Lokasi
        </h2>
        <Card className="mx-auto max-w-6xl">
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex flex-col">
                <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Informasi Wilayah
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                      Batas Desa:
                    </h4>
                    <ul className="mt-1 list-inside list-disc text-gray-600 dark:text-gray-400">
                      <li>
                        <span className="font-medium">Utara:</span>{" "}
                        {batasWilayah.utara}
                      </li>
                      <li>
                        <span className="font-medium">Timur:</span>{" "}
                        {batasWilayah.timur}
                      </li>
                      <li>
                        <span className="font-medium">Selatan:</span>{" "}
                        {batasWilayah.selatan}
                      </li>
                      <li>
                        <span className="font-medium">Barat:</span>{" "}
                        {batasWilayah.barat}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                      Luas Desa:
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {luasDesa.toLocaleString("id-ID")} m²
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                      Alamat Kantor:
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {alamatKantor}
                    </p>
                  </div>
                </div>
              </div>
              <div className="h-80 min-h-[300px] w-full overflow-hidden rounded-lg md:h-full">
                {children}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
