"use client";

import React, { useState } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';

import SearchPlace from '../../components/molecules/serch_place/serch_place';
import SearchCoordinates from '../../components/molecules/serch_coordinates/serch_coordinates';
import SearchRoute from '../../components/molecules/serch_route/serch_route';
import Map from '../../components/organisms/map/map';
import styles from './page.module.css'
import { GeoJsonLineString } from "../../types/map";

const Home = () => {
    const [destination, setDestination] = useState<[number, number] | null>(null);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [route, setRoute] = useState<GeoJsonLineString | null>(null);

    const handleSearch = async (query) => {
        if (!query) return;
        try {
            const response = await fetch(`/api/maps/search_place?query=${encodeURIComponent(query)}`)
            const lngLat = await response.json();
            setDestination(lngLat);
        } catch (error) {
            console.error("Error searching places:", error);
        }
    };

    const handleCoordinateSearch = async (lat, lng) => {
        setDestination([lng, lat]);
    };

    const handleRouteSearch = async () => {
        if (!destination || !userLocation) return;
        try {
            const response = await fetch(`/api/maps/search_route?start=${userLocation.join(',')}&end=${destination.join(',')}`);
            const routeData = await response.json();
            setRoute(routeData);
        } catch (error) {
            console.error("Error fetching route:", error);
        }
    };

    return (
        <>
            <div className={styles.VStack}>
                <Map onLocationChange={setUserLocation} destination={destination} route={route} />
                <SearchPlace onSearch={handleSearch} />
                <SearchCoordinates onSearch={handleCoordinateSearch} />
                <SearchRoute onSearch={handleRouteSearch} />
            </div>
        </>
    );
};

export default Home;