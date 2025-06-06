import { useEffect } from "react";
import { useDesa } from "@/contexts/DesaContext";

export default function DynamicManifest() {
  const { desaConfig } = useDesa();

  useEffect(() => {
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      // Use a static manifest URL instead of creating a blob
      const manifestUrl = "/manifest.json";
      manifestLink.setAttribute("href", manifestUrl);

      // Update the manifest name in the document head
      const appName = `Sistem Informasi ${desaConfig?.nama_desa || "Desa"}`;
      document.title = appName;
    }
  }, [desaConfig?.nama_desa]);

  return null;
}
