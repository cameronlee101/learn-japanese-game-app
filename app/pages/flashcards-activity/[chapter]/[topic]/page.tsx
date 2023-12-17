'use client'
import React, { useEffect, useRef, useState } from 'react'
import { ContentClass } from "@/app/utils/utils"
import Flashcard from '@/app/components/Flashcard/Flashcard'
import styles from './FlashcardsActivity.module.css'
import { FaArrowCircleLeft, FaArrowCircleRight  } from "react-icons/fa";
import { useRouter } from 'next/navigation'

function FlashcardsActivity({ 
  params,
}: {
  params: { chapter: string, topic: string }
}) {
  const router = useRouter()
  const selectedChapterStr = params.chapter.replaceAll('%20', ' ')
  const selectedTopicStr = params.topic.replaceAll('%20', ' ')

  const flashcardContents = new ContentClass().get(selectedChapterStr, selectedTopicStr)

  const [animationClass, setAnimationClass] = useState('')
  const [enableInput, setEnableInput] = useState(true)
  const [lastKeyPressTime, setLastKeyPressTime] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const cooldownDuration = 500

  // TODO: commentt
  useEffect(() => {
    if (flashcardContents == undefined) {
      alert('Error retriving flashcard contents, returning to home page')
      router.push('/')
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key == 'ArrowLeft') {
        flashcardLeft()
      }
      else if (event.key == 'ArrowRight') {
        flashcardRight()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [enableInput, lastKeyPressTime])

  // Run this effect whenever enableInput or direction changes
  useEffect(() => {
    // If input was enabled, do something
    if (enableInput) {
      // Move the flashcards to the left and update their contents accordingly
      if (direction == 'left') {
        setEnableInput(false)
        setAnimationClass(styles.moveLeft)
        setLastKeyPressTime(Date.now())
        setDirection(null)
        
        setTimeout(() => {
          if (currentIndex == 0) {
            setCurrentIndex(flashcardContents!.length - 1)
          }
          else {
            setCurrentIndex(currentIndex - 1)
          }   
        }, cooldownDuration / 2)
      } 
      // Move the flashcards to the right and update their contents accordingly
      else if (direction == 'right') {
        setEnableInput(false)
        setAnimationClass(styles.moveRight)
        setLastKeyPressTime(Date.now())
        setDirection(null)
        
        setTimeout(() => {
          setCurrentIndex((currentIndex + 1) % flashcardContents!.length)
        }, cooldownDuration / 2)
      }
    }
  }, [enableInput, direction]); 

  const flashcardLeft = () => {
    // If enough time has passed, allow input and queue the flashcards to move left (which will execute in useEffect)
    if (Date.now() - lastKeyPressTime >= cooldownDuration) {
      setEnableInput(true)
      setAnimationClass('')
      setDirection('left');
    }
  }

  const flashcardRight = () => {
    // If enough time has passed, allow input and queue the flashcards to move right (which will execute in useEffect)
    if (Date.now() - lastKeyPressTime >= cooldownDuration) {
      setEnableInput(true)
      setAnimationClass('')
      setDirection('right');
    }
  }

  return (    
    <main className={`main-center ${styles.main}`}>
      <h1 className='text-5xl font-semibold'>{selectedChapterStr} {selectedTopicStr} Flashcards</h1>
      <div className={styles.flashcardArea}>
        <div className={animationClass}>
          <Flashcard frontContent={flashcardContents![currentIndex].japanese} backContent={flashcardContents![currentIndex].english}></Flashcard>
        </div>
        <div className='flex justify-center mt-10'>
          <FaArrowCircleLeft className={styles.flashcardButton} onClick={flashcardLeft}/>
          <FaArrowCircleRight className={styles.flashcardButton} onClick={flashcardRight}/>
        </div>
      </div>
    </main>
  )
}

export default FlashcardsActivity