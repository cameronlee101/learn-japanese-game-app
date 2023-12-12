'use client'
import React, { useEffect, useState } from 'react'
import { ContentClass } from "@/app/utils/utils";
import Flashcard from '@/app/components/Flashcard/Flashcard';
import styles from './FlashcardsActivity.module.css'

function FlashcardsActivity({ 
  params,
}: {
  params: { chapter: string, topic: string }
}) {
  const selectedChapterStr = params.chapter.replaceAll('%20', ' ')
  const selectedTopicStr = params.topic.replaceAll('%20', ' ')

  const content = new ContentClass().get(selectedChapterStr, selectedTopicStr)

  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    // Add a class to trigger the animation after a delay
    const animationTimeout = setTimeout(() => {
      setAnimationClass(styles.moveAround);
    }, 0); 

    return () => clearTimeout(animationTimeout);
  }, [])

  return (
    <main className='main-center'>
      <h1 className='text-5xl font-semibold'>{selectedChapterStr} {selectedTopicStr} Flashcards</h1>
      <div className={`${animationClass} ${styles.flashcardDiv}`}>
        <Flashcard frontContent={content[0].japanese} backContent={content[0].english}></Flashcard>
      </div>
    </main>
  )
}

export default FlashcardsActivity;