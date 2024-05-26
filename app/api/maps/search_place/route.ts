import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get('query');
    if (!query) {
        return new Response(JSON.stringify({ error: 'Query parameter is required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

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
            return new Response(JSON.stringify([longitude, latitude]), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } else {
            throw new Error('No places found');
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