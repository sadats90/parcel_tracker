import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ParcelMap = ({ statusHistory, center = [23.7937, 90.4066], zoom = 10 }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Small delay to ensure DOM is ready
    const initMap = () => {
      try {
        // Check if map already exists and remove it
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        // Initialize map
        const map = L.map(mapRef.current, {
          preferCanvas: true,
          zoomControl: true,
          attributionControl: true
        }).setView(center, zoom);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        // Wait for map to be ready
        map.whenReady(() => {
          mapInstanceRef.current = map;
          setIsMapReady(true);
          setMapError(null);
        });

      } catch (error) {
        console.error('Error initializing map:', error);
        setIsMapReady(false);
        setMapError('Failed to initialize map');
      }
    };

    // Use setTimeout to ensure DOM is ready
    const timer = setTimeout(initMap, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (error) {
          console.error('Error removing map:', error);
        }
        mapInstanceRef.current = null;
      }
      setIsMapReady(false);
      setMapError(null);
    };
  }, [center, zoom]);

  useEffect(() => {
    console.log('ParcelMap received statusHistory:', statusHistory);
    if (!isMapReady || !mapInstanceRef.current || !statusHistory || statusHistory.length === 0) return;

    try {
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
          const lat = parseFloat(status.latitude);
          const lng = parseFloat(status.longitude);
          
          // Validate coordinates
          if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            console.warn('Invalid coordinates:', { lat, lng, status });
            return;
          }

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

    } catch (error) {
      console.error('Error updating map markers:', error);
    }

  }, [statusHistory, isMapReady]);

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
      
      {statusHistory && statusHistory.length > 0 && !isMapReady && !mapError && (
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
          Loading map...
        </div>
      )}
      
      {mapError && (
        <div style={{ 
          height: '400px', 
          width: '100%',
          border: '1px solid #dc3545',
          borderRadius: '4px',
          backgroundColor: '#f8d7da',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#721c24'
        }}>
          Error: {mapError}
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
          display: (statusHistory && statusHistory.length > 0 && isMapReady && !mapError) ? 'block' : 'none'
        }}
      />
    </div>
  );
};

export default ParcelMap; 