import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ParcelMap = ({ statusHistory, center = [0, 0], zoom = 2 }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView(center, zoom);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [center, zoom]);

  useEffect(() => {
    console.log('ParcelMap received statusHistory:', statusHistory);
    if (!mapInstanceRef.current || !statusHistory || statusHistory.length === 0) return;

    const map = mapInstanceRef.current;
    
    // Clear existing markers and polylines
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    const locations = [];
    const markers = [];

    // Add markers for each location
    statusHistory.forEach((status, index) => {
      if (status.latitude && status.longitude) {
        const lat = status.latitude;
        const lng = status.longitude;
        const marker = L.marker([lat, lng])
          .bindPopup(`
            <div>
              <strong>${status.status.replace('_', ' ').toUpperCase()}</strong><br>
              <strong>Location:</strong> ${status.location}<br>
              <small>${new Date(status.timestamp).toLocaleString()}</small>
            </div>
          `)
          .addTo(map);
        
        markers.push(marker);
        locations.push([lat, lng]);
      }
    });

    // Add polyline connecting locations in order
    if (locations.length > 1) {
      L.polyline(locations, {
        color: '#007bff',
        weight: 3,
        opacity: 0.7
      }).addTo(map);
    }

    // Fit map to show all markers
    if (markers.length > 0) {
      const group = new L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.1));
    }

  }, [statusHistory]);

  return (
    <div>
      {(!statusHistory || statusHistory.length === 0) && (
        <div style={{ 
          height: '400px', 
          width: '100%',
          border: '1px solid #ddd',
          borderRadius: '4px',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666'
        }}>
          No tracking data available
        </div>
      )}
      <div 
        ref={mapRef} 
        className="map-container"
        style={{ 
          height: '400px', 
          width: '100%',
          border: '1px solid #ddd',
          borderRadius: '4px',
          backgroundColor: '#f8f9fa',
          display: (!statusHistory || statusHistory.length === 0) ? 'none' : 'block'
        }}
      />
    </div>
  );
};

export default ParcelMap; 