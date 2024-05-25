import React from 'react';
import styles from './text_input.module.css';

interface Props {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

const TextInput: React.FC<Props> = ({ value, onChange, placeholder }) => {
    return (
        <input
            type="text"
            className={styles.textInput}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    );
};

export default TextInput;