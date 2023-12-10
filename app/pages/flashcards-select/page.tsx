'use client'
import React, { useEffect, useState } from 'react'
import { useLocalStorage } from "@uidotdev/usehooks";

enum Chapters {
  Ch1 = 'Chapter 1',
  Ch2 = 'Chapter 2',
  Ch3 = 'Chapter 3',
}

enum Topics {
  Vocabulary = 'Vocabulary',
  Kanji = 'Kanji',
}

function FlashcardsSelect() {
  const chapters = Object.values(Chapters)
  const topics = Object.values(Topics)

  const [selection, setSelection] = useLocalStorage('selection', [chapters[0].valueOf(), topics[0].valueOf()])
  const [selectedChapter, setSelectedChapter] = useState<string>(chapters[0])
  const [selectedTopic, setSelectedTopic] = useState<string>(topics[0])

  useEffect(() => {
    // Gets chapter and topic from localstorage and sets the relevant hooks
    const storedValue = localStorage.getItem('selection')
    
    if (storedValue) {
      const [storedChapter, storedTopic] = JSON.parse(storedValue)
  
      setSelectedChapter(storedChapter);
      setSelectedTopic(storedTopic);
    }
  }, [])
  
  const submitForm = (event: React.FormEvent) => {
    event.preventDefault()
    setSelection([selectedChapter, selectedTopic])
    alert('Submitted form')
  }

  return (
    <main className='flex flex-col items-center text-center min-h-screen min-w-full p-12'>
      <h1 className='text-5xl font-semibold'>Select Flashcard Level</h1>
      <div>
        <form className='flex flex-col mt-6' onSubmit={submitForm}>
          <div className='flex flex-col space-y-1 mt-6'>
            <label htmlFor='chapter'>Chapter</label>
            <select 
              id='chapter'
              value={selectedChapter}
              onChange={(e) => {setSelectedChapter(e.target.value)}}
            >
              {chapters.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className='flex flex-col space-y-1 mt-6'>
            <label htmlFor='topic'>Topic</label>
            <select 
              id='topic'
              value={selectedTopic}
              onChange={(e) => {setSelectedTopic(e.target.value)}}
            >
              {topics.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
          <button className='bg-slate-500 hover:bg-slate-700 text-white font-bold py-1 px-2 rounded-full mt-8'>Submit</button>
        </form>
      </div>
    </main>
  )
}

export default FlashcardsSelect