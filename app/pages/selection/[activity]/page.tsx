'use client'
import React, { useEffect, useState } from 'react'
import { Chapters, ContentClass, Topics } from '@/app/utils/content-utils'
import { useRouter } from 'next/navigation'
import { useLocalStorage } from "@uidotdev/usehooks"
import styles from './selection.module.css'
import TopicStatusModal from '@/app/components/TopicStatusModal/TopicStatusModal'

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
  const selectedSuffix = titleSuffixes.find((item) => { if (item.activity === params.activity) return item.suffix })

  const [selection, setSelection] = useLocalStorage('selection', [chapters[0].valueOf(), topics[0].valueOf()])
  const [selectedChapter, setSelectedChapter] = useState<string>(chapters[0])
  const [selectedTopic, setSelectedTopic] = useState<string>(topics[0])

  const [collection, setCollection] = useState([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Gets chapter and topic from localstorage and sets the relevant hooks (used for remembering
    // chapter and topic the user previously selected)
    if (selection) {  
      setSelectedChapter(selection[0])
      setSelectedTopic(selection[1])
    }
  }, [])

  // If user selection is valid, updates localstorage on user's chapter and topic choice, then changes the page
  const submitForm = (event: React.FormEvent) => {
    event.preventDefault()
    if (isSelectionValid(selectedChapter, selectedTopic)) {
      setSelection([selectedChapter, selectedTopic])
      router.push('/pages/' + params.activity + '/' + selectedChapter + '/' + selectedTopic)
    }
    else {
      alert('Current chapter and topics selection is not valid, please change one or more selection')
    } 
  }

  // Returns whether there is content for the selected chapter and topic
  const isSelectionValid = (chapter: string, topic: string): boolean => {
    const chapterKey = chapter.toLowerCase().replaceAll(' ', '')
    const topicKey = topic.toLowerCase()
      
    const chapterResult = collection.find((item) => chapterKey in item)
    if (chapterResult && chapterResult[chapterKey][topicKey]) {
      return true
    }
    return false
  }

  // Toggles whether the modal is visible. Retrieves content collection if it hasn't been retrieved yet
  const toggleShowModal = () => {
    if (collection.length == 0) {
      new ContentClass().getAggregatedCollection().then((content) => {
        setCollection(content)
      })
    }
    setShowModal(!showModal)
  }

  return (
    <main className='main-center'>
      <h1 className='text-5xl font-semibold'>
        Select Chapter and Topic {selectedSuffix ? selectedSuffix.suffix : ''}
      </h1>      
      <div>
        <form className='flex flex-col mt-6' onSubmit={submitForm}>
          <div className={`${styles.selectArea}`}>
            <label htmlFor='chapter' className='text-xl'>Chapter</label>
            <select 
              id='chapter'
              value={selectedChapter}
              onChange={(e) => {setSelectedChapter(e.target.value)}}
              className={`${styles.select}`}
            >
              {chapters.map((item) => (
                <option 
                  key={item} 
                  value={item} 
                  className={`${styles.option}`}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className={`${styles.selectArea}`}>
            <label htmlFor='topic' className='text-xl'>Topic</label>
            <select 
              id='topic'
              value={selectedTopic}
              onChange={(e) => {setSelectedTopic(e.target.value)}}
              className={`${styles.select}`}
            >
              {topics.map((item) => (
                <option 
                  key={item} 
                  value={item} 
                  className={`${styles.option}`}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>
          <button 
            className='bg-slate-500 hover:bg-slate-700 text-white text-xl font-bold py-1 px-2 rounded-full mt-20'
          >
            Submit
          </button>
          <button 
            className='bg-slate-500 hover:bg-slate-700 text-white text-xl font-bold py-1 px-2 rounded-full mt-10' 
            onClick={toggleShowModal}
            type='button'
          >
            See Valid Topics
          </button>
        </form>
      </div>
      {showModal && <TopicStatusModal onClose={toggleShowModal} isSelectionValid={isSelectionValid}/>}
    </main>
  )
}

export default Selection