import mapboxgl, { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";

// Initialize Mapbox token (should be in your environment variables)
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

export default function Mapbox() {
  const [map, setMap] = useState<Map | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (!mapContainer.current) return; // Ensure container exists
    
    // Initialize the map only once
    if (map) return;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom
    });

    // Add navigation control (zoom buttons)
    mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Wait for the map to load before adding event listeners
    mapInstance.on('load', () => {
      console.log('Map loaded successfully');
      
      // Add event listeners for map movement
      mapInstance.on('move', () => {
        const center = mapInstance.getCenter();
        setLng(Number(center.lng.toFixed(4)));
        setLat(Number(center.lat.toFixed(4)));
        setZoom(Number(mapInstance.getZoom().toFixed(2)));
      });

      // Add random markers around Boston area
      const markers = [
        { lng: -71.0589, lat: 42.3601, title: "Boston Common", description: "Historic park in downtown Boston" },
        { lng: -71.0636, lat: 42.3581, title: "Boston Public Library", description: "Central library of the Boston Public Library system" },
        { lng: -71.0942, lat: 42.3398, title: "Harvard University", description: "Prestigious university in Cambridge" },
        { lng: -71.0924, lat: 42.3736, title: "MIT", description: "Massachusetts Institute of Technology" },
        { lng: -71.0275, lat: 42.3539, title: "Logan Airport", description: "Boston's main airport" },
        { lng: -71.0972, lat: 42.3467, title: "Fenway Park", description: "Home of the Boston Red Sox" },
        { lng: -71.0603, lat: 42.3584, title: "Faneuil Hall", description: "Historic meeting hall and marketplace" },
        { lng: -71.0547, lat: 42.3601, title: "North End", description: "Historic Italian-American neighborhood" }
      ];

      console.log('Adding markers to map...');

      markers.forEach((markerData, index) => {
        try {
          // Create popup
          const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: true,
            closeOnClick: false
          }).setHTML(`
            <div style="padding: 10px; max-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #333;">${markerData.title}</h3>
              <p style="margin: 0; font-size: 14px; color: #666;">${markerData.description}</p>
            </div>
          `);

          // Add marker to map using default Mapbox marker
          new mapboxgl.Marker({
            color: '#ff6b6b'
          })
          .setLngLat([markerData.lng, markerData.lat])
          .setPopup(popup)
          .addTo(mapInstance);

          console.log(`Added marker ${index + 1}: ${markerData.title}`);
        } catch (error) {
          console.error(`Error adding marker ${index + 1}:`, error);
        }
      });

      console.log('All markers added successfully');
    });

    // Handle load errors
    mapInstance.on('error', (e) => {
      console.error('Map error:', e);
    });

    setMap(mapInstance);

    // Cleanup function
    return () => {
      mapInstance.remove();
    };
  }, []); // Empty dependency array - only run once

  return (
    <div className="flex flex-col items-center w-full h-full sm:my-5">
      <div className="w-full p-4 bg-gray-100 rounded-t-lg">
        <p className="text-sm">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </p>
      </div>
      <div
        ref={mapContainer}
        className="w-full h-[600px] rounded-b-lg shadow-lg"
        style={{ minHeight: '600px' }} // Ensure minimum height
      />
    </div>
  );
}