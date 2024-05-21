"use client";
import mapboxgl from 'mapbox-gl';
import React, { useEffect, useState } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from "./page.module.css";
import { initializeMapboxMap, addMapboxMarker, trackUserLocationMapbox, searchMapboxPlaces, getRoute } from "../../api/maps/mapbox/route";

const Home = () => {
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [destination, setDestination] = useState<[number, number] | null>(null);

    useEffect(() => {
        const setupMap = async (latitude, longitude) => {
            const initializedMap = await initializeMapboxMap(latitude, longitude, 12);
            setMap(initializedMap);
            const userMarker = addMapboxMarker(initializedMap, latitude, longitude);
            trackUserLocationMapbox(initializedMap, userMarker);

            // ユーザーの位置を状態に設定
            setUserLocation([longitude, latitude]);
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                setupMap(latitude, longitude);
            }, () => {
                setupMap(35.6895, 139.6917); // デフォルトの位置 (東京)
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
            setupMap(35.6895, 139.6917);
        }
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
        if (map && destination && userLocation) {
            const route = await getRoute(userLocation, destination);
            if (route) {
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