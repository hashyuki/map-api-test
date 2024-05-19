"use client"

import React from "react";
import styles from "./page.module.css";

const Home = () => {
    const categories = {
        "Google Map API": "google-map",
        "MapBox API": "mapbox",
    };

    return (
        <main className={styles.main}>
            <div className={styles.title}>
                Map API Sample
            </div>
            <div className={styles.container}>
                {Object.entries(categories).map(([name, url]) => (
                    <a key={name} className={styles.category} href={`/examples/${url}`}>
                        {name}
                    </a>
                ))}
            </div>
        </main>
    )
};

export default Home;