"use client";

import React, { useEffect } from "react";
import styles from "./page.module.css";
import { getLocation } from "../../utils/getLocation";

const Home = () => {
    useEffect(() => {
        const googleMapAPIKey = "google map api key"

        const loadMap = async () => {
            try {
                const { latitude, longitude } = await getLocation();

                if (!window.google) {
                    const script = document.createElement("script");
                    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapAPIKey}`;
                    script.async = true;
                    await new Promise((resolve, reject) => {
                        script.onload = resolve;
                        script.onerror = reject;
                        document.head.appendChild(script);
                    });
                }

                const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;

                const map = new Map(document.getElementById("map") as HTMLElement, {
                    center: { lat: latitude, lng: longitude },
                    zoom: 12,
                });

                console.log("Map initialized");
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
