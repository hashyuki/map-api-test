"use client";
import React, { useState } from 'react';
import TextInput from '../../atoms/text_input/text_input';
import Button from '../../atoms/button/button';
import styles from './serch_coordinates.module.css';

interface SearchCoordinatesProps {
    onSearch: (lat: number, lng: number) => void;
}

const SearchCoordinates: React.FC<SearchCoordinatesProps> = ({ onSearch }) => {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const handleSearch = () => {
        onSearch(parseFloat(latitude), parseFloat(longitude));
        setLatitude('');
        setLongitude('');
    };

    return (
        <div className={styles.VStack}>
            <div>緯度経度検索</div>
            <div className={styles.HStack}>
                <TextInput value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="Latitude..." />
                <TextInput value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="Longitude..." />
                <Button onClick={handleSearch}>Add Marker</Button>
            </div>
        </div>
    );
};

export default SearchCoordinates;