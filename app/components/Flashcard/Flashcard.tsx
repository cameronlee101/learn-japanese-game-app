'use client';
import React, { useState } from 'react';
import styles from './Flashcard.module.css';

const Flashcard = (props: { frontContent: string, backContent: string }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`${styles.flashcard} ${isFlipped ? styles.flipped : ''}`} onClick={handleFlip}>
      <div className={styles.front}>{props.frontContent}</div>
      <div className={styles.back}>{props.backContent}</div>
    </div>
  );
};

export default Flashcard;
