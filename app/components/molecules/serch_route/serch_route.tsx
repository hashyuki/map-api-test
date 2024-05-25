"use client";
import React, { useState } from 'react';
import Button from '../../atoms/button/button';
import styles from './serch_route.module.css';

interface SearchCoordinatesProps {
    onSearch: (lat: number, lng: number) => void;
}

const SearchRoute: React.FC<SearchCoordinatesProps> = ({ onSearch }) => {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const handleSearch = () => {
        onSearch(parseFloat(latitude), parseFloat(longitude));
        setLatitude('');
        setLongitude('');
    };

    return (
        <div className={styles.VStack}>
            <div>ルート検索</div>
            <div className={styles.HStack}>
                <Button onClick={handleSearch}>Search Route</Button>
            </div>
        </div>
    );
};

export default SearchRoute;