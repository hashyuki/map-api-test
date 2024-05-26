import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const start = req.nextUrl.searchParams.get('start');
    const end = req.nextUrl.searchParams.get('end');
    if (!start || !end) {
        return new Response(JSON.stringify({ error: 'Start and end parameters are required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    const [startLng, startLat] = start.split(',');
    const [endLng, endLat] = end.split(',');
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${endLng},${endLat}?geometries=geojson&access_token=${accessToken}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch route information');
        }
        const data = await response.json();
        if (data.routes.length > 0 && data.routes[0].geometry) {
            return new Response(JSON.stringify({
                type: "LineString",
                coordinates: data.routes[0].geometry.coordinates
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } else {
            throw new Error('No route found');
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}