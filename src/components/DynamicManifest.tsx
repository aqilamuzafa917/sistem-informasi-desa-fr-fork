import { useEffect } from "react";
import { useDesa } from "@/contexts/DesaContext";

export default function DynamicManifest() {
  const { desaConfig } = useDesa();

  useEffect(() => {
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      const manifestUrl = new URL(
        manifestLink.getAttribute("href") || "/manifest.json",
        window.location.origin,
      );

      // Fetch the manifest
      fetch(manifestUrl)
        .then((response) => response.json())
        .then((manifest) => {
          // Update the manifest with the desa name
          manifest.name = `Sistem Informasi ${desaConfig?.nama_desa || "Desa"}`;
          manifest.short_name = desaConfig?.nama_desa || "Desa Digital";

          // Create a new manifest blob
          const manifestBlob = new Blob([JSON.stringify(manifest)], {
            type: "application/json",
          });
          const manifestUrl = URL.createObjectURL(manifestBlob);

          // Update the manifest link
          manifestLink.setAttribute("href", manifestUrl);
        })
        .catch((error) => {
          console.error("Error updating manifest:", error);
        });
    }
  }, [desaConfig?.nama_desa]);

  return null;
}
