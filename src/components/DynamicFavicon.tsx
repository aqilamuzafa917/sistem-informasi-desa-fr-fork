import { useEffect } from "react";
import { useDesa } from "@/contexts/DesaContext";

export default function DynamicFavicon() {
  const { desaConfig } = useDesa();

  useEffect(() => {
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
      if (desaConfig?.logo_desa) {
        favicon.setAttribute("href", desaConfig.logo_desa);
      } else {
        // Fallback to generic village logo
        favicon.setAttribute(
          "href",
          "https://cdn.digitaldesa.com/uploads/profil/32.17.13.2003/common/300_bandungbarat.png",
        );
      }
    }
  }, [desaConfig?.logo_desa]);

  return null;
}
