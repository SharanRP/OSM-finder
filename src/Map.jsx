import { MapContainer, TileLayer, Marker, Popup, useMap ,Polyline , LayersControl } from "react-leaflet";
import React from "react";
import "leaflet/dist/leaflet.css";
import icon from "./assets/react.svg";
import L from "leaflet";

export default function Map({ coords, coords2 , display_name }) {
  const { latitude, longitude } = coords;

  const lat1 = parseFloat(coords2[0]);
  const lat2 = parseFloat(coords2[1]);
  const lon1 = parseFloat(coords2[2]);
  const lon2 = parseFloat(coords2[3]);
  
  const polygonCoords = [
    [lat1, lon1],
    [lat1, lon2],
    [lat2, lon2],
    [lat2, lon1],
    [lat1, lon1],
  ];

  console.log(polygonCoords);

  const customIcon = new L.Icon({
    iconUrl: icon,
    iconSize: [25, 35],
    iconAnchor: [5, 30]
  });

  function MapView() {
    let map = useMap();
    map.setView([latitude, longitude], map.getZoom());
    return null;
  }

  return (
    <div className="w-full mx-2 border-2 border-gray-100 h-full flex justify-center  items-center">
    <MapContainer
      className="map w-full h-full"
      center={[latitude, longitude]}
      zoom={10}
      scrollWheelZoom={true}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OpenStreetMap">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name = "OpenStreetHot">
          <TileLayer 
            url = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
            attribution = '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
        />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name = "Opentopomap">
          <TileLayer 
            url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
            attribution = 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)'
        />
        </LayersControl.BaseLayer>
      </LayersControl>

      <Polyline pathOptions={{ color: 'black' }} positions={polygonCoords} />

      <Marker icon={customIcon} position={[latitude, longitude]}>
        <Popup>{display_name}</Popup>
      </Marker>
      <MapView />
    </MapContainer>
  </div>
  );
}
