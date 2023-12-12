'use client'
import React, { useEffect } from 'react'
import { ContentClass } from "@/app/utils/utils";

function FlashcardsActivity({ 
  params,
}: {
  params: { chapter: string, topic: string }
}) {
  const selectedChapterStr = params.chapter.replaceAll('%20', ' ')
  const selectedTopicStr = params.topic.replaceAll('%20', ' ')

  let content
  useEffect(() => {
    content = new ContentClass().get(selectedChapterStr, selectedTopicStr)
    console.log(content)
  }, [])

  return (
    <main className='main-center'>
      <h1 className='text-5xl font-semibold'>{selectedChapterStr} {selectedTopicStr} Flashcards</h1>
      <p></p>
    </main>
  );
}

export default FlashcardsActivity;