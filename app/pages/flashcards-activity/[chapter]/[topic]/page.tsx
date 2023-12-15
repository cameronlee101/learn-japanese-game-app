'use client'
import React, { useEffect, useRef, useState } from 'react'
import { ContentClass } from "@/app/utils/utils"
import Flashcard from '@/app/components/Flashcard/Flashcard'
import styles from './FlashcardsActivity.module.css'

function FlashcardsActivity({ 
  params,
}: {
  params: { chapter: string, topic: string }
}) {
  const selectedChapterStr = params.chapter.replaceAll('%20', ' ')
  const selectedTopicStr = params.topic.replaceAll('%20', ' ')

  const content = new ContentClass().get(selectedChapterStr, selectedTopicStr)

  const [animationClass, setAnimationClass] = useState('')
  const [enableInput, setEnableInput] = useState(true)
  const [lastKeyPressTime, setLastKeyPressTime] = useState(0)
  const cooldownDuration = 1800 // Adjust the cooldown duration as needed

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const currentTime = Date.now()

      if (enableInput) {
        if (event.key == 'ArrowRight') {
          setEnableInput(false)
          setAnimationClass(styles.moveRight)
          setLastKeyPressTime(currentTime)
        }
        else if (event.key == 'ArrowLeft') {
          setEnableInput(false)
          setAnimationClass(styles.moveLeft)
          setLastKeyPressTime(currentTime)
        }
      } else {
        const elapsedTime = currentTime - lastKeyPressTime

        if (elapsedTime >= cooldownDuration) {
          setEnableInput(true)
          setAnimationClass('')
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [enableInput, lastKeyPressTime])

  return (    
    <main className={`main-center ${styles.main}`}>
      <h1 className='text-5xl font-semibold'>{selectedChapterStr} {selectedTopicStr} Flashcards</h1>
      <div className={`${animationClass} ${styles.flashcardDiv}`}>
        <Flashcard frontContent={content[0].japanese} backContent={content[0].english}></Flashcard>
      </div>
    </main>
  )
}

export default FlashcardsActivity