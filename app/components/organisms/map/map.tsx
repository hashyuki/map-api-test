import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './map.module.css';

interface Props {
    zoom?: number;
    onLocationChange?: (location: [number, number]) => void;
    destination?: [number, number] | null;
    route?: any;
}

const Map: React.FC<Props> = ({ zoom = 12, onLocationChange, destination, route }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
    const destinationMarkerRef = useRef<mapboxgl.Marker | null>(null);

    // initialize a map
    useEffect(() => {
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
        const initializeMap = (location: [number, number]) => {
            const map = new mapboxgl.Map({
                container: mapContainerRef.current!,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: location,
                zoom: zoom
            });

            const userMarker = new mapboxgl.Marker()
                .setLngLat(location)
                .addTo(map);

            userMarker.on('dragend', event => {
                const { lng, lat } = event.target.getLngLat();
                onLocationChange?.([lng, lat]);
            });

            mapRef.current = map;
            userMarkerRef.current = userMarker;
        };

        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                const initialLocation = [longitude, latitude] as [number, number];
                onLocationChange?.(initialLocation);
                initializeMap(initialLocation);
            },
            () => {
                const defaultLocation = [139.6917, 35.6895] as [number, number]; // Tokyo
                onLocationChange?.(defaultLocation);
                initializeMap(defaultLocation);
            }
        );

        return () => {
            mapRef.current?.remove();
        };
    }, [zoom, onLocationChange]);

    // monitor user's position and update marker
    useEffect(() => {
        if (!mapRef.current || !userMarkerRef.current) return;

        const id = navigator.geolocation.watchPosition(position => {
            const { latitude, longitude } = position.coords;
            const newLocation = [longitude, latitude] as [number, number];
            userMarkerRef.current.setLngLat(newLocation);
            mapRef.current.flyTo({ center: newLocation });
            onLocationChange?.(newLocation);
        }, error => {
            console.error('Failed to retrieve your location.');
        }, {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        });

        return () => {
            navigator.geolocation.clearWatch(id);
        };
    }, [mapRef.current, userMarkerRef.current, onLocationChange]);

    // add a destination marker
    useEffect(() => {
        if (destination && mapRef.current) {
            if (!destinationMarkerRef.current) {
                destinationMarkerRef.current = new mapboxgl.Marker()
                    .setLngLat(destination)
                    .addTo(mapRef.current);
            } else {
                destinationMarkerRef.current.setLngLat(destination);
            }
            mapRef.current.flyTo({ center: destination });
        }
    }, [destination]);

    // add a route
    useEffect(() => {
        if (route && mapRef.current) {
            if (!mapRef.current.getSource('route')) {
                mapRef.current.addSource('route', {
                    type: 'geojson',
                    data: route.geometry
                });
                mapRef.current.getSource('route').setData(route);
                mapRef.current.addLayer({
                    id: 'route',
                    type: 'line',
                    source: 'route',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#888',
                        'line-width': 8
                    }
                });
            } else {
                mapRef.current.getSource('route').setData(route);
            }
        }
    }, [route]);

    return <div ref={mapContainerRef} className={styles.mapContainer} />;
};

export default Map;