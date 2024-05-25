"use client";
import React, { useState } from 'react';
import TextInput from '../../atoms/text_input/text_input';
import Button from '../../atoms/button/button';
import styles from './serch_place.module.css';

interface Props {
    onSearch: (query: string) => void;
}

const SearchPlace: React.FC<Props> = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        onSearch(query);
        setQuery('');
    };

    return (
        <div className={styles.VStack}>
            <div>目的地検索</div>
            <div className={styles.HStack}>
                <TextInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search places..." />
                <Button onClick={handleSearch}>Add Marker</Button>
            </div>
        </div>
    );
};

export default SearchPlace;