import mapboxgl from "mapbox-gl";

// Mapbox API キーの設定
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

// マップの初期化機能のみを提供する関数
const initializeMapboxMap = async (latitude: number, longitude: number, zoom: number = 12) => {
    try {
        const map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v11",
            center: [longitude, latitude],
            zoom: zoom,
        });
        return map;
    } catch (error) {
        console.error("Error initializing Mapbox map:", error);
        throw error;
    }
};

// マーカーの追加機能を提供する関数
const addMapboxMarker = (map: mapboxgl.Map, latitude: number, longitude: number, draggable: boolean = true) => {
    let marker = new mapboxgl.Marker({ draggable })
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

    return marker;
};

const trackUserLocationMapbox = (map: mapboxgl.Map, marker: mapboxgl.Marker) => {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition((position) => {
            const newPos = [position.coords.longitude, position.coords.latitude];
            marker.setLngLat(newPos);
            map.flyTo({ center: newPos });
        }, (error) => {
            console.error("Error getting location: ", error);
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
};

const searchMapboxPlaces = async (query: string) => {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${accessToken}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch place information');
        }
        const data = await response.json();
        return data.features; // Return the search results
    } catch (error) {
        console.error("Error fetching place information:", error);
        throw error;
    }
};

const getRoute = async (start, end) => {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${accessToken}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch route information');
        }
        const data = await response.json();
        return data.routes[0]; // Return the first route found
    } catch (error) {
        console.error("Error fetching route information:", error);
        throw error;
    }
};

export { initializeMapboxMap, addMapboxMarker, trackUserLocationMapbox, searchMapboxPlaces, getRoute };