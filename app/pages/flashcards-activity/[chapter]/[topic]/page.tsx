"use client";
import React, { useEffect, useState } from "react";
import { Content, fetchContent } from "@/app/utils/content-utils";
import Flashcard from "@/app/components/Flashcard/Flashcard";
import styles from "./flashcards-activity.module.css";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

const ARROW_LEFT = "ArrowLeft";
const ARROW_RIGHT = "ArrowRight";
const COOLDOWN_DURATION = 600;

function FlashcardsActivity({
  params,
}: {
  params: { chapter: string; topic: string };
}) {
  const router = useRouter();
  const selectedChapterStr = decodeURI(params.chapter);
  const selectedTopicStr = decodeURI(params.topic);

  const { status, data, error } = useQuery({
    queryKey: ["content", selectedChapterStr, selectedTopicStr],
    queryFn: () => fetchContent(selectedChapterStr, selectedTopicStr),
  });

  const [animationClass, setAnimationClass] = useState("");
  const [lastKeyPressTime, setLastKeyPressTime] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const [contents, setContents] = useState<Content[]>([
    { japanese: "Loading...", english: "Loading..." },
  ]);

  // Shuffles and updates the contents based on the result of the react query
  useEffect(() => {
    setShuffledContents();
  }, [data]);

  // Shuffles and updates the contents based on the result of the react query
  const setShuffledContents = () => {
    if (error) {
      console.error(error);
      alert("Error retrieving contents, returning to home page");
      router.push("/");
    }
    if (data) {
      const shuffledContents = shuffleArray(data);
      setContents(shuffledContents);
    }
  };

  // Shuffles the given array
  const shuffleArray = (array: any[]): any[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Creates keypress event listener on the window which uses the lastKeyPressTime state
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key == ARROW_LEFT) {
        flashcardPrev();
      } else if (event.key == ARROW_RIGHT) {
        flashcardNext();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [lastKeyPressTime]);

  // Run this effect whenever enableInput or direction states change
  useEffect(() => {
    if (direction === "left" || direction === "right") {
      // Disable input for a time and assign the animation class to the flashcard to animate it moving
      setLastKeyPressTime(Date.now());
      setDirection(null);

      if (direction === "left") {
        setAnimationClass(styles.moveLeft);
      } else if (direction === "right") {
        setAnimationClass(styles.moveRight);
      }

      // Creates timeout that changes the flashcard's contents when it is off the screen during its animation
      setTimeout(() => {
        if (direction === "left") {
          setCurrentIndex((currentIndex + 1) % contents.length);
        } else if (direction === "right") {
          setCurrentIndex(
            currentIndex === 0 ? contents.length - 1 : currentIndex - 1,
          );
        }
      }, COOLDOWN_DURATION / 2);
    }
  }, [direction]);

  const flashcardPrev = () => {
    // If enough time has passed, allow input and queue to move to the previous flashcard (which will execute in useEffect)
    if (Date.now() - lastKeyPressTime >= COOLDOWN_DURATION) {
      setAnimationClass("");
      setDirection("right");
    }
  };

  const flashcardNext = () => {
    // If enough time has passed, allow input and queue to move to the next flashcard (which will execute in useEffect)
    if (Date.now() - lastKeyPressTime >= COOLDOWN_DURATION) {
      setAnimationClass("");
      setDirection("left");
    }
  };

  return (
    <main className="main-center overflow-hidden">
      <h1 className="text-5xl font-semibold">
        {selectedChapterStr} {selectedTopicStr} Flashcards
      </h1>
      <div className={`${styles.centerArea}`}>
        <div className={animationClass}>
          <Flashcard contents={contents[currentIndex]} />
        </div>
        <div className="flex mt-10">
          <FaArrowCircleLeft
            className={`${styles.flashcardButton}`}
            onClick={flashcardPrev}
            data-test="flashcard-prev-button"
          />
          <FaArrowCircleRight
            className={`${styles.flashcardButton}`}
            onClick={flashcardNext}
            data-test="flashcard-next-button"
          />
        </div>
        <p id="flashcardCounter" className="my-10 text-2xl font-semibold">
          {currentIndex + 1}/{contents.length}
        </p>
      </div>
    </main>
  );
}

export default FlashcardsActivity;
