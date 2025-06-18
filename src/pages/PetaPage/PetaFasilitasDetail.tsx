import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { API_CONFIG } from "../../config/api";
import axios from "axios";
import {
  Building,
  School,
  Church,
  Hospital,
  Stethoscope,
  ChevronLeft,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface POI {
  id: string;
  name: string;
  amenity: string;
  latitude: number;
  longitude: number;
  address: string;
  created_at: string;
  updated_at: string;
}

type POIFeature = {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    name: string;
    tags: {
      "addr:housenumber"?: string;
      "addr:street": string;
      amenity: string;
      building: string;
      name: string;
    };
  };
};

const amenityOptions = [
  {
    value: "school",
    label: "Sekolah",
    icon: School,
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "place_of_worship",
    label: "Tempat Ibadah",
    icon: Church,
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "hospital",
    label: "Rumah Sakit",
    icon: Hospital,
    color: "bg-red-100 text-red-800",
  },
  {
    value: "clinic",
    label: "Klinik",
    icon: Stethoscope,
    color: "bg-green-100 text-green-800",
  },
  {
    value: "other",
    label: "Lainnya",
    icon: Building,
    color: "bg-orange-100 text-orange-800",
  },
];

function getAmenityInfo(amenity: string) {
  return (
    amenityOptions.find((opt) => opt.value === amenity) || {
      label: amenity,
      icon: Building,
      color: "bg-gray-100 text-gray-800",
    }
  );
}

const fetchPOIDetail = async (id: string): Promise<POI | null> => {
  try {
    const res = await axios.get(`${API_CONFIG.baseURL}/api/publik/map/poi`, {
      headers: API_CONFIG.headers,
    });
    const features: POIFeature[] = res.data.features || [];
    const found = features.find((feature) => {
      const generatedId =
        `${feature.geometry.coordinates[0]}-${feature.geometry.coordinates[1]}-${feature.properties.name}`.replace(
          /[^a-zA-Z0-9-]/g,
          "-",
        );
      return generatedId === id;
    });
    if (!found) return null;
    return {
      id: id,
      name: found.properties.name,
      amenity: found.properties.tags.amenity,
      latitude: found.geometry.coordinates[1],
      longitude: found.geometry.coordinates[0],
      address: `${found.properties.tags["addr:street"] || ""}${found.properties.tags["addr:housenumber"] ? ` No. ${found.properties.tags["addr:housenumber"]}` : ""}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } catch {
    return null;
  }
};

// Fix for default marker icon in Leaflet
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

const PetaFasilitasDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [poi, setPoi] = useState<POI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetchPOIDetail(id)
      .then((data) => {
        if (!data) setError("Fasilitas tidak ditemukan.");
        setPoi(data);
      })
      .catch(() => setError("Gagal mengambil detail fasilitas."))
      .finally(() => setLoading(false));
  }, [id]);

  const amenityInfo = poi ? getAmenityInfo(poi.amenity) : undefined;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Detail Fasilitas Desa
                  </h1>
                  {poi && <p className="text-sm text-gray-500">ID: {poi.id}</p>}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center p-6">
            <div className="w-full">
              {loading ? (
                <div className="flex h-64 items-center justify-center">
                  <Spinner size="lg" text="Memuat detail..." />
                </div>
              ) : error ? (
                <div className="py-12 text-center">
                  <p className="text-lg font-semibold text-red-500">{error}</p>
                </div>
              ) : poi ? (
                <div className="w-full rounded-xl border border-gray-100 bg-white p-8 shadow-lg">
                  <div className="mb-6 flex items-center gap-3">
                    {amenityInfo && (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${amenityInfo.color}`}
                      >
                        <amenityInfo.icon className="h-4 w-4" />
                        {amenityInfo.label}
                      </span>
                    )}
                    <span className="text-gray-400">|</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {poi.name}
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="mb-1 text-sm text-gray-600">Alamat</div>
                    <div className="font-medium text-gray-900">
                      {poi.address || "-"}
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="mb-1 text-sm text-gray-600">Koordinat</div>
                    <div className="font-medium text-gray-900">
                      {poi.latitude}, {poi.longitude}
                    </div>
                  </div>
                  {/* Map Section */}
                  {poi.latitude && poi.longitude && (
                    <div className="mb-4">
                      <div className="mb-1 text-sm text-gray-600">
                        Lokasi pada Peta
                      </div>
                      <div className="mt-2 h-[300px] w-full overflow-hidden rounded-lg border border-gray-200">
                        <MapContainer
                          center={[poi.latitude, poi.longitude]}
                          zoom={16}
                          style={{ height: "100%", width: "100%" }}
                          scrollWheelZoom={false}
                        >
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <Marker position={[poi.latitude, poi.longitude]}>
                            <Popup>
                              <div className="text-center">
                                <h3 className="mb-1 text-base font-bold text-blue-600">
                                  {poi.name}
                                </h3>
                                <div className="text-xs text-gray-700">
                                  {poi.address}
                                </div>
                              </div>
                            </Popup>
                          </Marker>
                        </MapContainer>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default PetaFasilitasDetail;
