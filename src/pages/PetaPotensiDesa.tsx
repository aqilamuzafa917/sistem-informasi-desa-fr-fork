import * as React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import NavbarDesa from "@/components/NavbarDesa";
import FooterDesa from "@/components/FooterDesa";
import PetaNav from "@/components/PetaNav";
import { useDesa } from "@/contexts/DesaContext";
import axios from "axios";
import { API_CONFIG } from "@/config/api";
import { DesaData } from "@/types/desa";
import {
  MapPin,
  Calendar,
  Building2,
  Maximize2,
  Minimize2,
  Search,
} from "lucide-react";
// Memperbaiki masalah icon Leaflet di React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

interface PotensiFeature {
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

// Dummy data for potensi
const dummyPotensiData: PotensiFeature[] = [
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [107.5105222441776, -6.912986707035502],
    },
    properties: {
      name: "Sawah Padi Desa",
      tags: {
        "addr:street": "Jalan Sawah",
        amenity: "farm",
        building: "farm",
        name: "Sawah Padi Desa",
      },
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [107.5115222441776, -6.913986707035502],
    },
    properties: {
      name: "Peternakan Ayam",
      tags: {
        "addr:street": "Jalan Peternakan",
        amenity: "farmyard",
        building: "farmyard",
        name: "Peternakan Ayam",
      },
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [107.5125222441776, -6.914986707035502],
    },
    properties: {
      name: "Industri Kecil",
      tags: {
        "addr:street": "Jalan Industri",
        amenity: "industrial",
        building: "industrial",
        name: "Industri Kecil",
      },
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [107.5135222441776, -6.915986707035502],
    },
    properties: {
      name: "Wisata Alam",
      tags: {
        "addr:street": "Jalan Wisata",
        amenity: "tourism",
        building: "tourism",
        name: "Wisata Alam",
      },
    },
  },
];

export default function PetaPotensiDesa() {
  const { desaConfig, loading } = useDesa();
  const [allPotensiData] = React.useState<PotensiFeature[]>(dummyPotensiData);
  const [isLoadingPotensi] = React.useState(false);
  const [polygonData, setPolygonData] = React.useState<[number, number][]>([]);
  const [isLoadingPolygon, setIsLoadingPolygon] = React.useState(true);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const mapRef = React.useRef<L.Map | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedPotensi, setSelectedPotensi] =
    React.useState<PotensiFeature | null>(null);

  // State untuk kategori yang aktif
  const [activeCategories, setActiveCategories] = React.useState<{
    pertanian: boolean;
    peternakan: boolean;
    industri: boolean;
    wisata: boolean;
  }>({
    pertanian: true,
    peternakan: true,
    industri: true,
    wisata: true,
  });

  // Simplified loading state
  const isPageLoading = loading || isLoadingPotensi || isLoadingPolygon;

  // Toggle kategori
  const toggleCategory = (kategori: keyof typeof activeCategories) => {
    setActiveCategories((prev) => ({
      ...prev,
      [kategori]: !prev[kategori],
    }));
  };

  // Function to categorize Potensi based on amenity
  const categorizePotensi = (amenity: string): string => {
    switch (amenity) {
      case "farm":
        return "pertanian";
      case "farmyard":
        return "peternakan";
      case "industrial":
        return "industri";
      case "tourism":
        return "wisata";
      default:
        return "lainnya";
    }
  };

  // Filter Potensi data based on active categories and search query
  const filteredPotensiData = React.useMemo(() => {
    return allPotensiData.filter((feature) => {
      const category = categorizePotensi(feature.properties.tags.amenity);
      const matchesCategory =
        activeCategories[category as keyof typeof activeCategories];

      // Add null checks for search
      const searchLower = searchQuery.toLowerCase();
      const name = feature.properties.name?.toLowerCase() || "";
      const street =
        feature.properties.tags["addr:street"]?.toLowerCase() || "";

      const matchesSearch =
        searchQuery === "" ||
        name.includes(searchLower) ||
        street.includes(searchLower);

      return matchesCategory && matchesSearch;
    });
  }, [allPotensiData, activeCategories, searchQuery]);

  // Get marker icon based on amenity type
  const getMarkerIcon = (amenity: string) => {
    let iconColor = "";

    switch (amenity) {
      case "farm":
        iconColor = "green";
        break;
      case "farmyard":
        iconColor = "blue";
        break;
      case "industrial":
        iconColor = "red";
        break;
      case "tourism":
        iconColor = "orange";
        break;
      default:
        iconColor = "gray";
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

  // Fetch polygon data
  React.useEffect(() => {
    const fetchPolygonData = async () => {
      try {
        setIsLoadingPolygon(true);
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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // Add a small delay to ensure the map container has resized
    setTimeout(() => {
      if (mapRef.current) {
        if (!isFullscreen) {
          // When entering fullscreen, zoom in
          mapRef.current.setZoom(16);
        } else {
          // When exiting fullscreen, zoom out
          mapRef.current.setZoom(15);
        }
        // Trigger a resize event to ensure the map updates properly
        mapRef.current.invalidateSize();
      }
    }, 100);
  };

  // Function to handle potensi selection
  const handlePotensiSelect = (potensi: PotensiFeature) => {
    setSelectedPotensi(potensi);
    if (mapRef.current) {
      const [longitude, latitude] = potensi.geometry.coordinates;
      mapRef.current.setView([latitude, longitude], 17, {
        animate: true,
        duration: 0.4,
        easeLinearity: 0.25,
        noMoveStart: false,
      });
    }
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <NavbarDesa />
        <div className="container mx-auto space-y-8 px-4 py-8">
          <PetaNav activeTab="potensi" />

          {/* Header Section Skeleton */}
          <div className="mb-16">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600/50 via-blue-700/50 to-indigo-700/50 p-8 text-white shadow-2xl">
              <div className="absolute top-0 right-0 h-64 w-64 opacity-10">
                <Building2 size={200} className="rotate-12 transform" />
              </div>
              <div className="relative z-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 animate-pulse rounded-lg bg-white/20"></div>
                      <div className="h-8 w-64 animate-pulse rounded-xl bg-white/20"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 animate-pulse rounded-full bg-white/20"></div>
                      <div className="h-5 w-96 animate-pulse rounded-lg bg-white/20"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 animate-pulse rounded-full bg-white/20"></div>
                      <div className="h-5 w-64 animate-pulse rounded-lg bg-white/20"></div>
                    </div>
                  </div>
                </div>

                {/* Info Skeleton */}
                <div className="mt-4 text-center">
                  <div className="mx-auto h-4 w-48 animate-pulse rounded-lg bg-white/20"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl">
            <div className="mb-8 text-center">
              <div className="mx-auto h-8 w-64 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"></div>
              <div className="mx-auto mt-2 h-4 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Map Skeleton */}
              <div className="relative z-0 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <div className="absolute top-4 right-4 z-[1000] h-8 w-8 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-[700] w-full animate-pulse bg-gray-200 dark:bg-gray-700"></div>
              </div>

              {/* Potensi List Skeleton */}
              <div className="space-y-6">
                {/* Filter Kategori Skeleton */}
                <div className="flex w-full flex-wrap gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-10 flex-1 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"
                    ></div>
                  ))}
                </div>

                {/* Search Bar Skeleton */}
                <div className="h-12 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"></div>

                {/* Potensi List Items Skeleton */}
                <div className="grid h-[600px] grid-cols-1 gap-4 overflow-y-auto pr-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-4"
                    >
                      <div className="h-11 w-11 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 w-3/4 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                        <div className="h-4 w-1/2 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                        <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterDesa />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <NavbarDesa />
      <div className="container mx-auto space-y-8 px-4 py-8">
        <PetaNav activeTab="potensi" />

        {/* Header Section */}
        <div className="mb-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 text-white shadow-2xl">
            <div className="absolute top-0 right-0 h-64 w-64 opacity-10">
              <Building2 size={200} className="rotate-12 transform" />
            </div>
            <div className="relative z-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                      <Building2 size={24} />
                    </div>
                    <h1 className="text-4xl font-bold">
                      Peta Potensi Desa {desaConfig?.nama_desa}
                    </h1>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100">
                    <MapPin size={16} />
                    <span className="text-lg">
                      Desa {desaConfig?.nama_desa}, Kec.{" "}
                      {desaConfig?.nama_kecamatan}, Kab.{" "}
                      {desaConfig?.nama_kabupaten}, {desaConfig?.nama_provinsi}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100">
                    <Calendar size={16} />
                    <span>
                      Data Terakhir Diperbarui:{" "}
                      {new Date().toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info jumlah Potensi yang ditampilkan */}
              <div className="mt-4 text-center">
                <p className="text-sm text-blue-100">
                  Menampilkan {filteredPotensiData.length} dari{" "}
                  {allPotensiData.length} potensi
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Combined Card */}
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl">
              <div className="mb-8 text-center">
                <h2 className="mb-2 text-2xl font-bold text-gray-800">
                  Peta & Daftar Potensi
                </h2>
                <p className="text-gray-600">
                  Potensi yang tersedia di Desa {desaConfig?.nama_desa}
                </p>
              </div>

              <div
                className={`grid ${isFullscreen ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"} gap-8`}
              >
                {/* Map Section */}
                <div className="relative z-0 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  <button
                    onClick={toggleFullscreen}
                    className="absolute top-4 right-4 z-[1000] rounded-lg bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-xl dark:bg-gray-800/90 dark:hover:bg-gray-800"
                    title={
                      isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"
                    }
                  >
                    {isFullscreen ? (
                      <Minimize2
                        size={20}
                        className="text-gray-700 dark:text-gray-300"
                      />
                    ) : (
                      <Maximize2
                        size={20}
                        className="text-gray-700 dark:text-gray-300"
                      />
                    )}
                  </button>
                  <div className={`z-0 h-[700px] w-full`}>
                    <MapContainer
                      center={desaConfig?.center_map}
                      zoom={15}
                      style={{ height: "100%", width: "100%" }}
                      scrollWheelZoom={true}
                      dragging={true}
                      touchZoom={true}
                      doubleClickZoom={true}
                      zoomControl={true}
                      ref={mapRef}
                    >
                      <TileLayer
                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
                      {filteredPotensiData.map((feature, index) => {
                        const [longitude, latitude] =
                          feature.geometry.coordinates;
                        const { name, tags } = feature.properties;
                        const amenity = tags.amenity;

                        return (
                          <Marker
                            key={`${longitude}-${latitude}-${name}-${index}`}
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
                                <p className="mt-1 text-xs text-blue-600 capitalize dark:text-blue-400">
                                  {amenity.replace(/_/g, " ")}
                                </p>
                              </div>
                            </Popup>
                          </Marker>
                        );
                      })}
                    </MapContainer>
                  </div>
                </div>

                {/* Potensi List Section */}
                {!isFullscreen && (
                  <div className="space-y-6">
                    {/* Filter Kategori */}
                    <div className="flex w-full flex-wrap gap-2">
                      <button
                        onClick={() => toggleCategory("pertanian")}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm transition-all duration-200 ${
                          activeCategories.pertanian
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <div className="h-2 w-2 rounded-full bg-green-400"></div>
                        Pertanian
                      </button>
                      <button
                        onClick={() => toggleCategory("peternakan")}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm transition-all duration-200 ${
                          activeCategories.peternakan
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                        Peternakan
                      </button>
                      <button
                        onClick={() => toggleCategory("industri")}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm transition-all duration-200 ${
                          activeCategories.industri
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <div className="h-2 w-2 rounded-full bg-red-400"></div>
                        Industri
                      </button>
                      <button
                        onClick={() => toggleCategory("wisata")}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm transition-all duration-200 ${
                          activeCategories.wisata
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                        Wisata
                      </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Cari potensi..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-12 text-sm shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                        <Search
                          size={20}
                          className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                        />
                      </div>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          ×
                        </button>
                      )}
                    </div>

                    <div className="grid h-[600px] grid-cols-1 gap-4 overflow-y-auto pr-2">
                      {filteredPotensiData.map((feature, index) => {
                        const { name, tags } = feature.properties;
                        const amenity = tags.amenity;
                        const category = categorizePotensi(amenity);

                        return (
                          <div
                            key={index}
                            onClick={() => handlePotensiSelect(feature)}
                            className={`group transform cursor-pointer rounded-2xl border bg-white p-4 transition-all duration-300 hover:shadow-lg ${
                              selectedPotensi?.properties.name === name
                                ? "border-blue-500"
                                : "border-gray-200 hover:border-blue-400"
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:scale-105 ${
                                  category === "pertanian"
                                    ? "bg-green-500"
                                    : category === "peternakan"
                                      ? "bg-blue-500"
                                      : category === "industri"
                                        ? "bg-red-500"
                                        : "bg-orange-500"
                                }`}
                              >
                                <Building2 size={22} />
                              </div>

                              <div className="min-w-0 flex-1">
                                <h3 className="mb-1 truncate text-base font-bold text-blue-700">
                                  {name}
                                </h3>
                                <p className="mb-2 truncate text-sm text-gray-500">
                                  {tags["addr:street"]}
                                  {tags["addr:housenumber"] &&
                                    ` No. ${tags["addr:housenumber"]}`}
                                </p>
                                <div>
                                  <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                      category === "pertanian"
                                        ? "bg-green-100 text-green-700"
                                        : category === "peternakan"
                                          ? "bg-blue-100 text-blue-700"
                                          : category === "industri"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-orange-100 text-orange-700"
                                    }`}
                                  >
                                    {category === "pertanian"
                                      ? "Pertanian"
                                      : category === "peternakan"
                                        ? "Peternakan"
                                        : category === "industri"
                                          ? "Industri"
                                          : "Wisata"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {filteredPotensiData.length === 0 && (
                      <div className="py-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                          <Building2 size={24} className="text-gray-400" />
                        </div>
                        <h3 className="mb-2 text-base font-semibold text-gray-700">
                          Tidak Ada Potensi
                        </h3>
                        <p className="text-sm text-gray-500">
                          {searchQuery
                            ? "Tidak ada potensi yang sesuai dengan pencarian."
                            : "Tidak ada potensi yang sesuai dengan filter yang dipilih."}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16">
        <FooterDesa />
      </div>
    </div>
  );
}
