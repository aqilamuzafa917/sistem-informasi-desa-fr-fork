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

  const displayedDesaName = desaConfig?.nama_desa || "Desa";
  const logoUrl =
    desaConfig?.logo_desa ||
    "https://cdn.digitaldesa.com/uploads/profil/32.17.13.2003/common/300_bandungbarat.png";

  // Get address from desaConfig first, then fallback to identitas
  const displayedAddress =
    desaConfig?.alamat_desa ||
    identitas?.alamat_lengkap ||
    identitas?.alamat_singkat ||
    "Alamat belum tersedia";

  return (
    <footer className="bg-gradient-to-r from-[var(--color-deep-blue)] via-[var(--color-cyan-blue)] to-[var(--color-deep-blue)] text-[var(--color-pure-white)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Column 1: Logo & Village Info */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <h3 className="mb-4 text-center text-lg font-bold text-[var(--color-pure-white)] sm:text-xl md:text-left">
                Pemerintah Desa {displayedDesaName}
              </h3>

              {/* Logo */}
              <div className="mb-6 flex flex-col items-center md:flex-row md:items-start">
                <div className="mb-4 h-20 w-20 flex-shrink-0 md:mr-4 md:mb-0 md:h-24 md:w-24">
                  <img
                    src={logoUrl}
                    alt={`Logo ${displayedDesaName}`}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="text-center md:text-left">
                  <div className="text-sm leading-relaxed text-[var(--color-pure-white)]">
                    {displayedAddress}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Contact Info */}
          <div className="md:col-span-1">
            <h4 className="mb-6 text-center text-lg font-semibold text-[var(--color-pure-white)] md:text-left">
              Hubungi Kami
            </h4>

            <div className="space-y-4">
              {/* Phone */}
              {identitas?.telepon && (
                <div className="flex items-start">
                  <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-pure-white)]/10">
                    <Phone className="h-5 w-5 text-[var(--color-pure-white)]" />
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-medium text-[var(--color-pale-blue)]">
                      Nomor Telepon Penting
                    </div>
                    <a
                      href={`tel:${identitas.telepon}`}
                      className="text-[var(--color-pure-white)] transition-colors duration-200 hover:text-[var(--color-pale-blue)]"
                    >
                      {identitas.telepon}
                    </a>
                  </div>
                </div>
              )}

              {/* Email */}
              {identitas?.email && (
                <div className="flex items-start">
                  <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-pure-white)]/10">
                    <Mail className="h-5 w-5 text-[var(--color-pure-white)]" />
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-medium text-[var(--color-pale-blue)]">
                      Email
                    </div>
                    <a
                      href={`mailto:${identitas.email}`}
                      className="break-all text-[var(--color-pure-white)] transition-colors duration-200 hover:text-[var(--color-pale-blue)]"
                    >
                      {identitas.email}
                    </a>
                  </div>
                </div>
              )}

              {/* Social Media Icons */}
              {identitas?.social_media && identitas.social_media.length > 0 && (
                <div className="pt-4">
                  <div className="mb-3 text-center text-sm font-medium text-[var(--color-pale-blue)] md:text-left">
                    Media Sosial
                  </div>
                  <div className="flex justify-center space-x-3 md:justify-start">
                    {identitas.social_media.map((social) => (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-pure-white)]/10 transition-all duration-200 hover:bg-[var(--color-pure-white)]/20"
                      >
                        {React.createElement(
                          getSocialMediaIcon(social.platform),
                          {
                            className:
                              "h-5 w-5 text-[var(--color-pure-white)] group-hover:scale-110 transition-transform duration-200",
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
        <div className="mt-8 border-t border-[var(--color-pure-white)]/10 pt-6 md:mt-12 md:pt-8">
          <div className="text-center text-sm text-[var(--color-pale-blue)]">
            © {new Date().getFullYear()} Pemerintah Desa {displayedDesaName}.
            <span className="mt-1 block md:mt-0 md:ml-1 md:inline">
              Seluruh hak cipta dilindungi undang-undang.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
