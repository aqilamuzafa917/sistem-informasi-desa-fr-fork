import { MapContainer, TileLayer, Polygon, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import { useDesa } from "@/contexts/DesaContext";

interface ProfileMapProps {
  polygon: [number, number][];
  popupData: {
    namaDesa: string;
    alamatKantor: string;
    luasDesa: number;
  };
}

function MapEffect({ polygon }: { polygon: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (polygon && polygon.length > 0) {
      const bounds = L.latLngBounds(polygon);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, polygon]);
  return null;
}

export default function ProfileMap({ polygon, popupData }: ProfileMapProps) {
  const { desaConfig } = useDesa();
  const pathOptions = {
    color: "#3b82f6",
    fillColor: "#60a5fa",
    fillOpacity: 0.3,
    weight: 2,
  };

  return (
    <MapContainer
      style={{ height: "100%", width: "100%" }}
      center={desaConfig?.center_map}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polygon positions={polygon} pathOptions={pathOptions}>
        <Popup>
          <div className="text-center">
            <h3 className="mb-1 text-lg font-bold text-blue-600">
              {popupData.namaDesa}
            </h3>
            <div className="mb-2 h-0.5 w-full bg-blue-200"></div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Alamat:</span>
              <br /> {popupData.alamatKantor}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">Luas:</span>
              <br /> {popupData.luasDesa.toLocaleString("id-ID")} m²
            </p>
          </div>
        </Popup>
      </Polygon>
      <MapEffect polygon={polygon} />
    </MapContainer>
  );
}
