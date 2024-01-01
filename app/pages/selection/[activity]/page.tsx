'use client'
import React, { useEffect, useState } from 'react'
import { Chapters, Topics, isSelectionValid } from '@/app/utils/utils'
import { useRouter } from 'next/navigation'
import { useLocalStorage } from "@uidotdev/usehooks"
import './selection.css'

const titleSuffixes = [
  {
    activity: 'flashcards-activity',
    suffix: 'for Flashcards',
  },
  {
    activity: 'mc-quiz',
    suffix: 'for Multiple Choice Quiz'
  },
  {
    activity: 'contents-of',
    suffix: 'to See The Contents of'
  }
]

function Selection({ 
  params,
}: {
  params: { activity:string }
}) {
  const chapters = Object.values(Chapters)
  const topics = Object.values(Topics)
  const router = useRouter()
  const selectedSuffix = titleSuffixes.find((item) => { if (item.activity === params.activity) return item.suffix });

  const [selection, setSelection] = useLocalStorage('selection', [chapters[0].valueOf(), topics[0].valueOf()])
  const [selectedChapter, setSelectedChapter] = useState<string>(chapters[0])
  const [selectedTopic, setSelectedTopic] = useState<string>(topics[0])

  useEffect(() => {
    // Gets chapter and topic from localstorage and sets the relevant hooks (used for remembering
    // chapter and topic the user previously selected)
    const storedValue = localStorage.getItem('selection')
    
    if (storedValue) {
      const [storedChapter, storedTopic] = JSON.parse(storedValue)
  
      setSelectedChapter(storedChapter);
      setSelectedTopic(storedTopic);
    }
  }, [])
  
  const submitForm = (event: React.FormEvent) => {
    // Updates localstorage on user's previous chapter and topic choice and changes page
    event.preventDefault()
    if (isSelectionValid(selectedChapter, selectedTopic)) {
      setSelection([selectedChapter, selectedTopic])
      router.push('/pages/' + params.activity + '/' + selectedChapter + '/' + selectedTopic)
    }
    else {
      alert('Current chapter and topics selection is not valid, please change one or more selection')
    } 
  }

  return (
    <main className='main-center'>
      <h1 className='text-5xl font-semibold'>
        Select Chapter and Topic {selectedSuffix ? selectedSuffix.suffix : ''}
      </h1>      
      <div>
        <form className='flex flex-col mt-6' onSubmit={submitForm}>
          <div className='selectArea'>
            <label htmlFor='chapter' className='text-xl'>Chapter</label>
            <select 
              id='chapter'
              value={selectedChapter}
              onChange={(e) => {setSelectedChapter(e.target.value)}}
            >
              {chapters.map((item) => (
                <option 
                  key={item} 
                  value={item} 
                  disabled={!isSelectionValid(item, selectedTopic)}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className='selectArea'>
            <label htmlFor='topic' className='text-xl'>Topic</label>
            <select 
              id='topic'
              value={selectedTopic}
              onChange={(e) => {setSelectedTopic(e.target.value)}}
            >
              {topics.map((item) => (
                <option 
                  key={item} 
                  value={item} 
                  disabled={!isSelectionValid(selectedChapter, item)}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>
          <button className='bg-slate-500 hover:bg-slate-700 text-white text-xl font-bold py-1 px-2 rounded-full mt-20'>Submit</button>
        </form>
      </div>
    </main>
  )
}

export default Selection