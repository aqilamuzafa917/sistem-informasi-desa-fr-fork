import * as React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import NavbarDesa from "@/components/NavbarDesa";
import FooterDesa from "@/components/FooterDesa";
// Memperbaiki masalah icon Leaflet di React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { useDesa } from "@/contexts/DesaContext";
import LoadingSkeleton from "@/components/profil/LoadingSkeleton";
import axios from "axios";
import { API_CONFIG } from "@/config/api";
import { DesaData } from "@/types/desa";

interface POIFeature {
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
}

interface POIResponse {
  type: "FeatureCollection";
  features: POIFeature[];
}

export default function PetaFasilitasDesa() {
  const { desaConfig, loading } = useDesa();
  const [poiData, setPoiData] = React.useState<POIFeature[]>([]);
  const [isLoadingPoi, setIsLoadingPoi] = React.useState(true);
  const [polygonData, setPolygonData] = React.useState<[number, number][]>([]);
  const [isLoadingPolygon, setIsLoadingPolygon] = React.useState(true);

  // Fetch POI data
  React.useEffect(() => {
    const fetchPoiData = async () => {
      try {
        const response = await axios.get<POIResponse>(
          `${API_CONFIG.baseURL}/api/publik/map/poi`,
          { headers: API_CONFIG.headers },
        );
        setPoiData(response.data.features);
      } catch (error) {
        console.error("Error fetching POI data:", error);
      } finally {
        setIsLoadingPoi(false);
      }
    };

    fetchPoiData();
  }, []);

  // Fetch polygon data
  React.useEffect(() => {
    const fetchPolygonData = async () => {
      try {
        const response = await axios.get<DesaData>(
          `${API_CONFIG.baseURL}/api/publik/profil-desa/1`,
          { headers: API_CONFIG.headers },
        );
        if (response.data.polygon_desa) {
          const coordinates = response.data.polygon_desa.map(
            (coord) => [coord[1], coord[0]] as [number, number],
          );
          setPolygonData(coordinates);
        }
      } catch (error) {
        console.error("Error fetching polygon data:", error);
      } finally {
        setIsLoadingPolygon(false);
      }
    };

    fetchPolygonData();
  }, []);

  // Fix untuk icon Leaflet di React
  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  }, []);

  // State untuk kategori yang aktif
  const [activeCategories, setActiveCategories] = React.useState<{
    sekolah: boolean;
    ibadah: boolean;
    kesehatan: boolean;
    lainnya: boolean;
  }>({
    sekolah: true,
    ibadah: true,
    kesehatan: true,
    lainnya: true,
  });

  // Toggle kategori
  const toggleCategory = (kategori: keyof typeof activeCategories) => {
    setActiveCategories((prev) => ({
      ...prev,
      [kategori]: !prev[kategori],
    }));
  };

  // Get marker icon based on amenity type
  const getMarkerIcon = (amenity: string) => {
    let iconColor = "";

    switch (amenity) {
      case "school":
        iconColor = "green";
        break;
      case "place_of_worship":
        iconColor = "blue";
        break;
      case "hospital":
      case "clinic":
        iconColor = "red";
        break;
      default:
        iconColor = "orange";
    }

    return new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${iconColor}.png`,
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <NavbarDesa />

      {/* Enhanced Header Section */}
      <div className="relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20"></div>

        {/* Header Content */}
        <div className="relative px-8 py-12 text-center">
          {/* Decorative Elements */}
          <div className="absolute top-2 left-8 h-16 w-16 rounded-full bg-blue-100 opacity-60 blur-xl dark:bg-blue-900/30"></div>
          <div className="absolute top-4 right-12 h-12 w-12 rounded-full bg-indigo-100 opacity-40 blur-lg dark:bg-indigo-900/30"></div>

          {/* Main Title */}
          <div className="relative">
            <div className="mb-2 inline-flex items-center justify-center">
              <div className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500"></div>
              <span className="text-sm font-semibold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                Peta Fasilitas
              </span>
              <div className="ml-2 h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500"></div>
            </div>

            <h1 className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-4xl leading-tight font-bold text-transparent md:text-5xl dark:from-blue-400 dark:via-blue-300 dark:to-indigo-400">
              DESA{" "}
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm dark:from-blue-400 dark:via-blue-300 dark:to-indigo-400">
                {desaConfig?.nama_desa?.toUpperCase()}
              </span>
            </h1>

            <div className="mx-auto mt-3 max-w-2xl">
              <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                Informasi lokasi fasilitas desa dalam bentuk peta interaktif
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Filter Kategori */}
        <div className="mb-6 flex flex-wrap justify-center gap-2 sm:mb-8 sm:gap-4">
          <button
            onClick={() => toggleCategory("sekolah")}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base ${activeCategories.sekolah ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}
          >
            <div className="h-2 w-2 rounded-full bg-green-600 sm:h-3 sm:w-3"></div>
            Sekolah
          </button>
          <button
            onClick={() => toggleCategory("ibadah")}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base ${activeCategories.ibadah ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}
          >
            <div className="h-2 w-2 rounded-full bg-blue-600 sm:h-3 sm:w-3"></div>
            Tempat Ibadah
          </button>
          <button
            onClick={() => toggleCategory("kesehatan")}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base ${activeCategories.kesehatan ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}
          >
            <div className="h-2 w-2 rounded-full bg-red-600 sm:h-3 sm:w-3"></div>
            Kesehatan
          </button>
          <button
            onClick={() => toggleCategory("lainnya")}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base ${activeCategories.lainnya ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}
          >
            <div className="h-2 w-2 rounded-full bg-orange-600 sm:h-3 sm:w-3"></div>
            Fasilitas Lainnya
          </button>
        </div>

        {/* Peta */}
        <div className="z-0 mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm sm:mb-8 dark:border-gray-700 dark:bg-gray-800">
          <div className="z-0 h-[400px] w-full sm:h-[500px] md:h-[600px]">
            {isLoadingPoi || isLoadingPolygon ? (
              <div className="h-full w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            ) : (
              <MapContainer
                center={[-6.9175, 107.5019]}
                zoom={14}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {polygonData.length > 0 && (
                  <Polygon
                    positions={polygonData}
                    pathOptions={{
                      color: "#3b82f6",
                      fillColor: "#60a5fa",
                      fillOpacity: 0.3,
                      weight: 2,
                    }}
                  >
                    <Popup>
                      <div className="text-center">
                        <h3 className="mb-1 text-lg font-bold text-blue-600">
                          {desaConfig?.nama_desa}
                        </h3>
                        <div className="mb-2 h-0.5 w-full bg-blue-200"></div>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Alamat:</span>
                          <br /> {desaConfig?.alamat_desa}
                        </p>
                      </div>
                    </Popup>
                  </Polygon>
                )}
                {poiData.map((feature, index) => {
                  const [longitude, latitude] = feature.geometry.coordinates;
                  const { name, tags } = feature.properties;
                  const amenity = tags.amenity;

                  // Skip if category is not active
                  if (
                    (amenity === "school" && !activeCategories.sekolah) ||
                    (amenity === "place_of_worship" &&
                      !activeCategories.ibadah) ||
                    ((amenity === "hospital" || amenity === "clinic") &&
                      !activeCategories.kesehatan) ||
                    (![
                      "school",
                      "place_of_worship",
                      "hospital",
                      "clinic",
                    ].includes(amenity) &&
                      !activeCategories.lainnya)
                  ) {
                    return null;
                  }

                  return (
                    <Marker
                      key={index}
                      position={[latitude, longitude]}
                      icon={getMarkerIcon(amenity)}
                    >
                      <Popup>
                        <div className="p-1">
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            {name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {tags["addr:street"]}
                            {tags["addr:housenumber"] &&
                              ` No. ${tags["addr:housenumber"]}`}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            )}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <FooterDesa />
    </main>
  );
}
