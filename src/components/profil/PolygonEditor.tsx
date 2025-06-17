import { MapContainer, TileLayer, Polygon, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDesa } from "@/contexts/DesaContext";

interface PolygonEditorProps {
  initialPolygon: [number, number][];
  onPolygonChange: (polygon: [number, number][]) => void;
}

export default function PolygonEditor({
  initialPolygon,
  onPolygonChange,
}: PolygonEditorProps) {
  const { desaConfig } = useDesa();
  const [polygon, setPolygon] = useState<[number, number][]>(initialPolygon);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tempPoints, setTempPoints] = useState<[number, number][]>([]);

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (!isDrawing) return;

    const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
    setTempPoints((prev) => [...prev, newPoint]);
  };

  const startDrawing = () => {
    setIsDrawing(true);
    setTempPoints([]);
  };

  const finishDrawing = () => {
    if (tempPoints.length < 3) {
      toast.error("Polygon harus memiliki minimal 3 titik");
      return;
    }
    setPolygon(tempPoints);
    onPolygonChange(tempPoints);
    setIsDrawing(false);
  };

  const cancelDrawing = () => {
    setIsDrawing(false);
    setTempPoints([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {!isDrawing ? (
          <Button onClick={startDrawing} variant="outline">
            Mulai Gambar Polygon
          </Button>
        ) : (
          <>
            <Button onClick={finishDrawing} variant="default">
              Selesai
            </Button>
            <Button onClick={cancelDrawing} variant="destructive">
              Batal
            </Button>
          </>
        )}
      </div>

      <div className="h-[400px] w-full overflow-hidden rounded-lg border border-gray-200">
        <MapContainer
          center={desaConfig?.center_map}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {isDrawing ? (
            <Polygon
              positions={tempPoints}
              pathOptions={{
                color: "#3b82f6",
                fillColor: "#60a5fa",
                fillOpacity: 0.3,
                weight: 2,
              }}
            />
          ) : (
            <Polygon
              positions={polygon}
              pathOptions={{
                color: "#3b82f6",
                fillColor: "#60a5fa",
                fillOpacity: 0.3,
                weight: 2,
              }}
            />
          )}
          <MapClickHandler onMapClick={handleMapClick} />
        </MapContainer>
      </div>

      {isDrawing && (
        <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
          Klik pada peta untuk menambahkan titik polygon. Minimal 3 titik
          diperlukan.
        </div>
      )}
    </div>
  );
}

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (e: L.LeafletMouseEvent) => void;
}) {
  useMapEvents({
    click: onMapClick,
  });
  return null;
}
