"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./Flashcard.module.css";
import { Content } from "@/app/utils/content-utils";
import { getFlashcardBack, getFlashcardFront } from "./Flashcard-utils";

const SPACE = " ";
const COOLDOWN_DURATION = 300;

const Flashcard = (props: { contents: Content }) => {
  const { contents } = props;

  const [isFlipped, setIsFlipped] = useState(false);
  const [lastKeyPressTime, setLastKeyPressTime] = useState(0);
  const [flippingCard, setFlippingCard] = useState(false);

  const flashcardFrontRef = useRef<HTMLDivElement>(null);
  const flashcardBackRef = useRef<HTMLDivElement>(null);

  // Changes how content is justified on flashcard when props for flashcard changes (start when there is overflow, center when there isn't)
  useEffect(() => {
    const handleOverflow = () => {
      const front = flashcardFrontRef.current;
      if (front) {
        const hasOverflow = front.scrollHeight > front.clientHeight;
        front.style.justifyContent = hasOverflow ? "start" : "center";
      }
      const back = flashcardBackRef.current;
      if (back) {
        const hasOverflow = back.scrollHeight > back.clientHeight;
        back.style.justifyContent = hasOverflow ? "start" : "center";
      }
    };

    // Initial check
    handleOverflow();

    // Attach event listener for dynamic changes
    window.addEventListener("resize", handleOverflow);

    return () => {
      window.removeEventListener("resize", handleOverflow);
    };
  }, [props]);

  // Creates keypress event listener on the window which uses the enableInput and lastKeyPressTime states
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key == SPACE) {
        handleFlip();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [lastKeyPressTime]);

  // Run this effect whenever flippingCard state changes
  useEffect(() => {
    if (flippingCard) {
      // Disable input for a time and flip the flashcard
      setLastKeyPressTime(Date.now());
      setFlippingCard(false);
      setIsFlipped(!isFlipped);
    }
  }, [flippingCard]);

  const handleFlip = () => {
    // If enough time has passed since the last card flip, queue the flashcard to flip (which will execute in useEffect)
    if (Date.now() - lastKeyPressTime >= COOLDOWN_DURATION) {
      setFlippingCard(true);
    }
  };

  return (
    <div
      className={`${styles.flashcard} ${isFlipped ? styles.flipped : ""}`}
      onMouseUp={handleFlip}
      data-test="flashcard"
    >
      <div
        ref={flashcardFrontRef}
        className={styles.front}
        data-test="flashcard-front"
      >
        {getFlashcardFront(contents)}
      </div>
      <div
        ref={flashcardBackRef}
        className={styles.back}
        data-test="flashcard-back"
      >
        {getFlashcardBack(contents)}
      </div>
    </div>
  );
};

export default Flashcard;
