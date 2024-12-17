// Import necessary modules
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon issue with webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapComponent = ({ address }) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (!address) return;

    const fetchLocation = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );
        const data = await response.json();

        if (data.length > 0) {
          const { lat, lon, display_name } = data[0];
          setLocation({ lat: parseFloat(lat), lon: parseFloat(lon), name: display_name });
        } else {
          alert('Location not found.');
        }
      } catch (error) {
        console.error('Error fetching location:', error);
        alert('Failed to fetch location.');
      }
    };

    fetchLocation();
  }, [address]);

  return (
    <div style={{ height: '500px', width: '100%' }} className='rounded-lg overflow-hidden'>
      {location ? (
        <MapContainer center={[location.lat, location.lon]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          />
          <Marker position={[location.lat, location.lon]}>
            <Popup>{location.name}</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
};

export default MapComponent;
