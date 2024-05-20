"use client";
import mapboxgl from 'mapbox-gl';
import React, { useEffect, useState } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from "./page.module.css";
import { initializeMapboxMap, addMapboxMarker, trackUserLocationMapbox, searchMapboxPlaces, getRoute } from "../../api/maps/mapbox/route";

const Home = () => {
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [destination, setDestination] = useState(null);

    useEffect(() => {
        const setupMap = async () => {
            const initializedMap = await initializeMapboxMap(35.6895, 139.6917, 20);
            setMap(initializedMap);
            const userMarker = addMapboxMarker(initializedMap, 35.6895, 139.6917);
            trackUserLocationMapbox(initializedMap, userMarker);
        };

        setupMap();
    }, []);

    const handleSearch = async () => {
        if (map && searchQuery) {
            try {
                const results = await searchMapboxPlaces(searchQuery);
                const place = results[0];
                const [longitude, latitude] = place.center;
                setDestination([longitude, latitude]);
                addMapboxMarker(map, latitude, longitude);
            } catch (error) {
                console.error("Error searching places:", error);
            }
        }
    };
    const handleRouteSearch = async () => {
        if (map && destination) {
            const userLocation = [map.getCenter().lng, map.getCenter().lat];
            const route = await getRoute(userLocation, destination);
            if (route) {
                // Assuming route.geometry is in GeoJSON format
                if (map.getSource('route')) {
                    map.getSource('route').setData(route.geometry);
                } else {
                    map.addSource('route', {
                        type: 'geojson',
                        data: route.geometry
                    });
                    map.addLayer({
                        id: 'route',
                        type: 'line',
                        source: 'route',
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        paint: {
                            'line-color': '#FF0000',
                            'line-width': 8
                        }
                    });
                }
            }
        }
    };

    return (
        <div>
            <div id="map" className={styles.mapContainer}></div>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search places..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
                <button onClick={handleRouteSearch}>Route Search</button>
            </div>
        </div>
    );
};

export default Home;