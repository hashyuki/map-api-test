import { GeoJsonLineString } from "../../types/map";
/**
 * Searches for places based on a given query using the Mapbox Geocoding API and returns the coordinates of the first result.
 * @param {string} query - The search query for the location or address.
 * @returns {Promise<[number, number]>} A promise that resolves to the longitude and latitude of the first found place.
 * @see {@link https://docs.mapbox.com/api/search/geocoding-v5/} for more details on the Mapbox Geocoding API.
 */
export const searchPlaces = async (query: string): Promise<[number, number]> => {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${accessToken}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch place information');
        }
        const data = await response.json();
        if (data.features.length > 0) {
            const firstPlace = data.features[0];
            const longitude = firstPlace.center[0];
            const latitude = firstPlace.center[1];
            return [longitude, latitude];
        } else {
            throw new Error('No places found');
        }
    } catch (error) {
        console.error("Error fetching place information:", error);
        throw error;
    }
};

/**
 * Fetches a driving route between two points using the Mapbox Directions API and returns it as a GeoJSON LineString.
 * @param {[number, number]} start - The starting coordinates [longitude, latitude].
 * @param {[number, number]} end - The ending coordinates [longitude, latitude].
 * @returns {Promise<GeoJsonLineString>} A promise that resolves to a GeoJSON LineString representing the best driving route.
 * @see {@link https://docs.mapbox.com/api/navigation/directions/} for more details on the Mapbox Directions API.
 */
export const getRoute = async (start: [number, number], end: [number, number]): Promise<GeoJsonLineString> => {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${accessToken}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch route information');
        }
        const data = await response.json();
        if (data.routes.length > 0 && data.routes[0].geometry) {
            return {
                type: "LineString",
                coordinates: data.routes[0].geometry.coordinates
            };
        } else {
            throw new Error('No route found');
        }
    } catch (error) {
        console.error("Error fetching route information:", error);
        throw error;
    }
};