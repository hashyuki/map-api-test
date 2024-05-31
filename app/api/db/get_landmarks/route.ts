import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
    const { data, error } = await supabase
        .from('landmark')
        .select('*');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const geojsonData = {
        type: 'FeatureCollection',
        features: data.map((landmark: any) => ({
            type: 'Feature',
            properties: {
                description: `<strong>${landmark.name}</strong><p>${landmark.description}</p>`,
                genre: landmark.genre
            },
            geometry: {
                type: 'Point',
                coordinates: [landmark.longitude, landmark.latitude]
            }
        }))
    };

    return NextResponse.json(geojsonData);
}
