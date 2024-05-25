import React from 'react';
import styles from './button.module.css';

interface Props {
    onClick: () => void;
    children: React.ReactNode;
}

const Button: React.FC<Props> = ({ onClick, children }) => {
    return (
        <button className={styles.button} onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;