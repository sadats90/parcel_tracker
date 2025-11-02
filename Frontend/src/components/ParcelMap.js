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
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || !statusHistory || statusHistory.length === 0) {
      setMapReady(false);
      return;
    }

    console.log('ParcelMap: Initializing with statusHistory:', statusHistory);

    // Clean up existing map
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (error) {
        console.error('Error removing existing map:', error);
      }
      mapInstanceRef.current = null;
    }

    // Initialize map with a small delay to ensure DOM is ready
    const initMap = () => {
      try {
        // Check if container exists
        if (!mapRef.current) {
          console.warn('Map container not found, retrying...');
          setTimeout(initMap, 50);
          return;
        }

        // Initialize map
        const map = L.map(mapRef.current, {
          zoomControl: true,
          attributionControl: true
        }).setView(center, zoom);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        mapInstanceRef.current = map;
        setMapReady(true);
        console.log('Map initialized successfully');

      } catch (error) {
        console.error('Error initializing map:', error);
        // Retry after a delay
        setTimeout(initMap, 100);
      }
    };

    // Start initialization with a small delay
    setTimeout(initMap, 10);

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (error) {
          console.error('Error removing map in cleanup:', error);
        }
        mapInstanceRef.current = null;
      }
      setMapReady(false);
    };
  }, [statusHistory, center, zoom]);

  // Separate useEffect for adding markers after map is ready
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !statusHistory || statusHistory.length === 0) return;

    const map = mapInstanceRef.current;
    console.log('ParcelMap: Adding markers to ready map');

    // Add markers and polylines
    const locations = [];
    const markers = [];

    statusHistory.forEach((status, index) => {
      if (status.latitude && status.longitude) {
        const lat = parseFloat(status.latitude);
        const lng = parseFloat(status.longitude);
        
        // Validate coordinates
        if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          try {
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
          } catch (error) {
            console.error(`Error creating marker ${index}:`, error, { lat, lng, status });
          }
        } else {
          console.warn(`Invalid coordinates for status ${index}:`, { lat, lng, status });
        }
      } else {
        console.warn(`Missing coordinates for status ${index}:`, status);
      }
    });

    console.log('ParcelMap: Created markers:', markers.length, 'locations:', locations.length);

    // Add polyline connecting locations
    if (locations.length > 1) {
      try {
        console.log('ParcelMap: Adding polyline with locations:', locations);
        L.polyline(locations, {
          color: '#007bff',
          weight: 3,
          opacity: 0.7
        }).addTo(map);
      } catch (error) {
        console.error('Error adding polyline:', error, 'locations:', locations);
      }
    }

    // Fit map to show all markers
    if (markers.length > 0) {
      try {
        const group = new L.featureGroup(markers);
        const bounds = group.getBounds();
        console.log('ParcelMap: Bounds:', bounds);
        if (bounds.isValid()) {
          map.fitBounds(bounds.pad(0.1));
        } else {
          console.warn('ParcelMap: Invalid bounds, using fallback');
          // Fallback: set view to first marker
          const firstMarker = markers[0];
          if (firstMarker) {
            map.setView(firstMarker.getLatLng(), zoom);
          }
        }
      } catch (error) {
        console.error('Error fitting bounds:', error);
        // Fallback: set view to center
        map.setView(center, zoom);
      }
    }
  }, [mapReady, statusHistory, center, zoom]);

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
      
      {statusHistory && statusHistory.length > 0 && (
        <div style={{ position: 'relative' }}>
          {!mapReady && (
            <div style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1000,
              backgroundColor: '#f8f9fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}>
              Loading map...
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
              backgroundColor: '#f8f9fa'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ParcelMap; 