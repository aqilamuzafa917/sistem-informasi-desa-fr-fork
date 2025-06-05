import React from "react";
import { BsInstagram, BsYoutube, BsFacebook } from "react-icons/bs";
import { Phone, Mail } from "lucide-react";
import { useDesa } from "@/contexts/DesaContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_CONFIG } from "@/config/api";

interface SocialMedia {
  platform: string;
  url: string;
  username: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface DesaIdentitas {
  nama_desa: string;
  social_media: SocialMedia[];
  telepon?: string;
  email?: string;
  alamat_lengkap?: string;
  alamat_singkat?: string;
}

interface DesaConfig {
  nama_desa: string;
  logo_desa?: string;
  alamat_desa?: string;
}

const LOCALSTORAGE_IDENTITAS_KEY = "desaIdentitas";

export default function FooterDesa() {
  const { desaConfig } = useDesa() as { desaConfig: DesaConfig | null };
  const [identitas, setIdentitas] = useState<DesaIdentitas | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedIdentitas = localStorage.getItem(LOCALSTORAGE_IDENTITAS_KEY);
    if (savedIdentitas) {
      try {
        setIdentitas(JSON.parse(savedIdentitas));
        setLoading(false);
      } catch (e) {
        console.error("Error parsing saved identitas:", e);
        fetchIdentitas();
      }
    } else {
      fetchIdentitas();
    }

    async function fetchIdentitas() {
      setLoading(true);
      try {
        const response = await axios.get<DesaIdentitas>(
          `${API_CONFIG.baseURL}/api/publik/profil-desa/1/identitas`,
          {
            headers: API_CONFIG.headers,
          },
        );
        setIdentitas(response.data);
        localStorage.setItem(
          LOCALSTORAGE_IDENTITAS_KEY,
          JSON.stringify(response.data),
        );
        console.log("Fetched Identitas:", response.data);
      } catch (error) {
        console.error("Error fetching identitas:", error);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const getSocialMediaIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return BsInstagram;
      case "youtube":
        return BsYoutube;
      case "facebook":
        return BsFacebook;
      default:
        return BsInstagram;
    }
  };

  if (loading && !identitas) {
    return null;
  }

  const displayedDesaName =
    identitas?.nama_desa || desaConfig?.nama_desa || "Desa";
  const logoUrl =
    desaConfig?.logo_desa ||
    "https://cdn.digitaldesa.com/uploads/profil/32.17.13.2003/common/300_bandungbarat.png";

  return (
    <footer className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Column 1: Logo & Village Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="mb-4 text-xl font-bold text-white">
                Pemerintah Desa {displayedDesaName}
              </h3>

              {/* Logo */}
              <div className="mb-6 flex items-center">
                <div className="mr-4 h-24 w-24 flex-shrink-0">
                  <img
                    src={logoUrl}
                    alt={`Logo ${displayedDesaName}`}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <div className="text-sm leading-relaxed text-indigo-100">
                    {desaConfig?.alamat_desa}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Contact Info */}
          <div className="lg:col-span-1">
            <h4 className="mb-6 text-lg font-semibold text-white">
              Hubungi Kami
            </h4>

            <div className="space-y-4">
              {/* Phone */}
              {identitas?.telepon && (
                <div className="flex items-start">
                  <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-medium text-indigo-100">
                      Nomor Telepon Penting
                    </div>
                    <a
                      href={`tel:${identitas.telepon}`}
                      className="text-white transition-colors duration-200 hover:text-indigo-200"
                    >
                      {identitas.telepon}
                    </a>
                  </div>
                </div>
              )}

              {/* Email */}
              {identitas?.email && (
                <div className="flex items-start">
                  <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-medium text-indigo-100">
                      Email
                    </div>
                    <a
                      href={`mailto:${identitas.email}`}
                      className="break-all text-white transition-colors duration-200 hover:text-indigo-200"
                    >
                      {identitas.email}
                    </a>
                  </div>
                </div>
              )}

              {/* Social Media Icons */}
              {identitas?.social_media && identitas.social_media.length > 0 && (
                <div className="pt-4">
                  <div className="mb-3 text-sm font-medium text-indigo-100">
                    Media Sosial
                  </div>
                  <div className="flex space-x-3">
                    {identitas.social_media.map((social) => (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition-all duration-200 hover:bg-white/20"
                      >
                        {React.createElement(
                          getSocialMediaIcon(social.platform),
                          {
                            className:
                              "h-5 w-5 text-white group-hover:scale-110 transition-transform duration-200",
                          },
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="text-center text-sm text-indigo-200">
            © {new Date().getFullYear()} Pemerintah Desa {displayedDesaName}.
            <span className="block md:ml-1 md:inline">
              Seluruh hak cipta dilindungi undang-undang.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
