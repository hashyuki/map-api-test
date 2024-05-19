"use client";

import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
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


