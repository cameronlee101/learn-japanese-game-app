'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContentClass, KanjiContent, VocabContent } from '@/app/utils/utils';
import styles from './mc-quiz.module.css'

function MCQuiz({ 
  params,
}: {
  params: { chapter: string, topic: string }
}) {
  const router = useRouter()
  const selectedChapterStr = params.chapter.replaceAll('%20', ' ')
  const selectedTopicStr = params.topic.replaceAll('%20', ' ')

  const [contents, setContents] = useState<VocabContent[]|KanjiContent[]>([{japanese: 'Loading...', english: 'Loading...'}])

  // Gets the contents for given chapter and topic, and checks that they are defined
  useEffect(() => {
    // Fetch flashcard contents
    const fetchedContents = new ContentClass().get(selectedChapterStr, selectedTopicStr)

    // Check if contents are undefined
    if (fetchedContents === undefined) {
      alert('Error retrieving contents, returning to home page (you may need to press "ok" on this alert multiple times)')
      router.push('/')
    }
    else {
      setContents(fetchedContents as (VocabContent[] | KanjiContent[]))
    }
  }, [])

  return (
    <main className='main-center'>
      <h1 className='text-5xl font-semibold'>
        Quiz
      </h1>
    </main>
  );
}

export default MCQuiz;