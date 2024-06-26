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
    const destinationMarkerRef = useRef<mapboxgl.Marker | null>(null);

    const initializeMap = () => {
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY!;
        const map = new mapboxgl.Map({
            container: mapContainerRef.current!,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [139.6917, 35.6895],
            zoom: zoom
        });

        const geolocateControl = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
        });

        map.addControl(geolocateControl);

        geolocateControl.on('geolocate', (event) => {
            const { latitude, longitude } = event.coords;
            if (onLocationChange) {
                onLocationChange([longitude, latitude]);
            }
        });

        map.on('load', () => {
            mapRef.current = map;
            geolocateControl.trigger();
            fetchGeoJsonData();
        });

        return map;
    };

    const fetchGeoJsonData = async () => {
        try {
            const response = await fetch('/api/db/get_landmarks');
            const geojsonData = await response.json();

            if (mapRef.current && !mapRef.current.getSource('places')) {
                mapRef.current.addSource('places', {
                    type: 'geojson',
                    data: geojsonData
                });

                mapRef.current.addLayer({
                    id: 'places',
                    type: 'circle',
                    source: 'places',
                    paint: {
                        'circle-color': [
                            'match',
                            ['get', 'genre'],
                            'sightseeing', '#008000',
                            'restaurant', '#ff8c00',
                            '#000000'
                        ],
                        'circle-radius': 6,
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#ffffff'
                    }
                });

                mapRef.current.on('click', 'places', (e) => {
                    const coordinates = e.features[0].geometry.coordinates.slice();
                    const description = e.features[0].properties.description;

                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }

                    new mapboxgl.Popup()
                        .setLngLat(coordinates)
                        .setHTML(description)
                        .addTo(mapRef.current!);
                });

                mapRef.current.on('mouseenter', 'places', () => {
                    mapRef.current!.getCanvas().style.cursor = 'pointer';
                });

                mapRef.current.on('mouseleave', 'places', () => {
                    mapRef.current!.getCanvas().style.cursor = '';
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        const map = initializeMap();

        return () => {
            map.remove();
        };
    }, [zoom, onLocationChange]);

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

    useEffect(() => {
        if (route && mapRef.current) {
            if (!mapRef.current.getSource('route')) {
                mapRef.current.addSource('route', {
                    type: 'geojson',
                    data: route.geometry
                });
                mapRef.current.getSource('route')!.setData(route);
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
                mapRef.current.getSource('route')!.setData(route);
            }
        }
    }, [route]);

    return <div ref={mapContainerRef} className={styles.mapContainer} />;
};

export default Map;
