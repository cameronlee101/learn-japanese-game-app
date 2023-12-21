'use client';
import React, { useEffect, useState } from 'react';
import styles from './Flashcard.module.css';
import { KanjiContent, VocabContent, isKanjiContent, isVocabContent } from '@/app/utils/utils';
import { useRouter } from 'next/navigation'

const SPACE = ' '
const COOLDOWN_DURATION = 300

const Flashcard = (props: { contents:VocabContent|KanjiContent }) => {
  const { contents } = props

  const router = useRouter()

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

  if (isVocabContent(contents)) {
    const data = contents as VocabContent
    return (
      <div className={`${styles.flashcard} ${isFlipped ? styles.flipped : ''}`} onClick={handleFlip}>
        <div className={styles.front}>
          {data.japanese}{data.alternate && ('/' + data.alternate)} {data.kanji && ('(' + data.kanji + ')')}
        </div>
        <div className={styles.back}>
          {data.english}{data.example && (', ex. ' + data.example)}
        </div>
      </div>
    );
  }
  else if (isKanjiContent(contents)) {
    const data = contents as KanjiContent
    return (
      <div className={`${styles.flashcard} ${isFlipped ? styles.flipped : ''}`} onClick={handleFlip}>
        <div className={styles.front}>
          {data.kanji}
        </div>
        <div className={`${styles.back} flex flex-col`}>
          <div>
            Meaning: {data.english}
          </div>
          <div>
            Readings: {data.readings.join(', ')}
          </div>
          <div>
            Examples: {data.examples.join(',\n')}
          </div>
        </div>
      </div>
    );
  }
  else {
    alert('Error occurred when confirming type of flashcard contents, returning to home page (you may need to press "ok" on this alert multiple times)')
    router.push('/')
  }
};

export default Flashcard;
