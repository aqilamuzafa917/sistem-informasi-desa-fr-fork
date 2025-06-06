import { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { useDesa } from "@/contexts/DesaContext";

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const { desaConfig } = useDesa();

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Update UI to notify the user they can add to home screen
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // We no longer need the prompt. Clear it up
    setDeferredPrompt(null);

    // Hide the install button
    setShowInstallButton(false);

    // Optionally, send analytics event with outcome
    console.log(`User response to the install prompt: ${outcome}`);
  };

  if (!showInstallButton) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <Button
        onClick={handleInstallClick}
        gradientDuoTone="cyanToBlue"
        className="shadow-lg"
      >
        Install {desaConfig?.nama_desa || "Desa"} Digital
      </Button>
    </div>
  );
}
