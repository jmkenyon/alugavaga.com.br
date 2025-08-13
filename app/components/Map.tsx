"use client";

import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";


// @ts-expect-error required to override default Leaflet icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

interface MapProps {
  center?: number[];
}

function ChangeView({ center }: { center: L.LatLngExpression }) {
  const map = useMap();
  map.setView(center, 15); // zoom to 15 on location change
  return null;
}

const Map: React.FC<MapProps> = ({ center }) => {
  const defaultCenter: L.LatLngExpression = [-23.55052, -46.633308];

  return (
    <MapContainer
      center={(center as L.LatLngExpression) || defaultCenter}
      zoom={center ? 15 : 3}
      scrollWheelZoom={false}
      className="h-[35vh] rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {center && (
        <>
          <Marker position={center as L.LatLngExpression} />
          <ChangeView center={center as L.LatLngExpression} />
        </>
      )}
    </MapContainer>
  );
};

export default Map;