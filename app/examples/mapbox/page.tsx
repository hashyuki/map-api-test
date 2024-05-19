"use client";

import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from "./page.module.css";
import { getLocation } from "../../utils/getLocation";

const Home = () => {
    useEffect(() => {
        mapboxgl.accessToken = "mapbox api key"

        const loadMap = async () => {
            try {
                const { latitude, longitude } = await getLocation();

                const map = new mapboxgl.Map({
                    container: "map",
                    style: "mapbox://styles/mapbox/streets-v11",
                    center: [longitude, latitude],
                    zoom: 12,
                });

                map.on("load", () => {
                    console.log("Map initialized");

                    let marker = new mapboxgl.Marker({ draggable: true })
                        .setLngLat([longitude, latitude])
                        .addTo(map);

                    marker.on("dragend", () => {
                        const lngLat = marker.getLngLat();
                        console.log("Marker dragged to:", lngLat);
                    });

                    marker.getElement().addEventListener("click", (event) => {
                        event.stopPropagation();
                        marker.remove();
                    });
                });

                map.on("click", (e) => {
                    const { longitude, latitude } = e.lngLat;

                    let newMarker = new mapboxgl.Marker({ draggable: true })
                        .setLngLat([longitude, latitude])
                        .addTo(map);

                    newMarker.on("dragend", () => {
                        const lngLat = newMarker.getLngLat();
                        console.log("New marker dragged to:", lngLat);
                    });

                    newMarker.getElement().addEventListener("click", (event) => {
                        event.stopPropagation();
                        newMarker.remove();
                    });
                });
            } catch (error) {
                console.error("Error:", error);
                alert("位置情報を取得できませんでした。");
            }
        };

        loadMap();
    }, []);

    return <div id="map" className={styles.mapContainer}></div>;
};

export default Home;
