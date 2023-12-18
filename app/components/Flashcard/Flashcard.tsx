'use client';
import React, { useEffect, useState } from 'react';
import styles from './Flashcard.module.css';
import { FlashcardContent } from '@/app/utils/utils';

const SPACE = ' '
const COOLDOWN_DURATION = 300

const Flashcard = (props: { contents:FlashcardContent }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [lastKeyPressTime, setLastKeyPressTime] = useState(0)
  const [flippingCard, setFlippingCard] = useState(false)

  // Creates keypress event listener on the window which uses the enableInput and lastKeyPressTime states
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key == SPACE) {
        handleFlip()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [lastKeyPressTime])

  // Run this effect whenever flippingCard state changes
  useEffect(() => {
    if (flippingCard) {
      // Disable input for a time and flip the flashcard
      setLastKeyPressTime(Date.now());
      setFlippingCard(false)
      setIsFlipped(!isFlipped)
    }
  }, [flippingCard]);

  const handleFlip = () => {
    // If enough time has passed since the last card flip, queue the flashcard to flip (which will execute in useEffect)
    if (Date.now() - lastKeyPressTime >= COOLDOWN_DURATION) {
      setFlippingCard(true)
    }
  };

  return (
    <div className={`${styles.flashcard} ${isFlipped ? styles.flipped : ''}`} onClick={handleFlip}>
      <div className={styles.front}>{props.contents.japanese}</div>
      <div className={styles.back}>{props.contents.english}</div>
    </div>
  );
};

export default Flashcard;
