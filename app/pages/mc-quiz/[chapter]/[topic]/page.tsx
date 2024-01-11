'use client'
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Content, ContentClass } from '@/app/utils/content-utils';
import styles from './mc-quiz.module.css'
import MCOptions from '@/app/components/MCQuiz/MCOptions/MCOptions';
import MCQuestion from '@/app/components/MCQuiz/MCQuestion/MCQuestion';
import { getMCOptionString, getMCQuestionString } from '@/app/components/MCQuiz/MCQuiz-utils';

function MCQuiz({ 
  params,
}: {
  params: { chapter: string, topic: string }
}) {
  const router = useRouter()
  const selectedChapterStr = decodeURI(params.chapter)
  const selectedTopicStr = decodeURI(params.topic)

  let hasSelectedIncorrect:boolean = false;

  const [contents, setContents] = useState<Content[]>([{japanese: 'Loading...', english: 'Loading...'}, {japanese: 'Loading...', english: 'Loading...'}, {japanese: 'Loading...', english: 'Loading...'}, {japanese: 'Loading...', english: 'Loading...'}])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctAnswersNum, setCorrectAnswersNum] = useState(0)

  const [wrongAnswersState, setWrongAnswersState] = useState<{question:string, answer:string}[]>([])
  const wrongAnswersRef = useRef<{question:string, answer:string}[]>([])

  const [playingGame, setPlayingGame] = useState(true)

  // Gets contents for activity on page load
  useEffect(() => {
    getShuffledContent()
  }, [])

  // Resets all the states (effectively resetting the game)
  const resetStates = () => {
    setCurrentIndex(0)
    setCorrectAnswersNum(0)
    setWrongAnswersState([])
    wrongAnswersRef.current = []
    setPlayingGame(true)
  }

  // Gets the contents for given chapter and topic checks that they are defined, and shuffles them
  const getShuffledContent = () => {
    // Fetches contents
    new ContentClass().getContent(selectedChapterStr, selectedTopicStr).then((fetchedContents) => {
      // Check if contents are undefined
      if (fetchedContents === undefined) {
        alert('Error retrieving contents, returning to home page (you may need to press "ok" on this alert multiple times)')
        router.push('/')
      } else {
        // Shuffles contents
        const shuffledContents = shuffleArray(fetchedContents)

        // Update the state with shuffled contents
        setContents(shuffledContents)
      }
    })
  }

  // Shuffles the given array
  const shuffleArray = (array:any[]):any[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array
  }

  // Performs logic based on the option the user chose
  const handleOptionChosen = (isCorrect: boolean) => {
    // Option chosen is correct
    if (isCorrect) {
      setTimeout(() =>{
        if (currentIndex < contents.length - 1) {
          setCurrentIndex(currentIndex+1)
        }
        else {
          setWrongAnswersState(wrongAnswersRef.current)
          setPlayingGame(false)
        }

        hasSelectedIncorrect ? hasSelectedIncorrect = false : setCorrectAnswersNum(correctAnswersNum+1)
      }, 700)
    }
    // Option chosen is incorrect
    else {
      hasSelectedIncorrect = true
      const curContent = contents[currentIndex]
      
      if (curContent && !wrongAnswersRef.current.find(item => item.question === getMCQuestionString(curContent))) {
        wrongAnswersRef.current = [...wrongAnswersRef.current, {question: getMCQuestionString(curContent), answer: getMCOptionString(curContent)}]
      }
    }    
  }

  // Returns an object containing the current correct Content object, and an array with the other Content objects
  const getMCOptions = () => {
    if (currentIndex == contents.length - 1) {
      return (
        {correct: contents[currentIndex], incorrect: contents.slice(0, currentIndex)}
      )
    }
    else {
      return (
        {correct: contents[currentIndex], incorrect: [...contents.slice(0, currentIndex), ...contents.slice(currentIndex+1)]} 
      )
    }
  }

  return (
    <main className='main-center'>
      <h1 className='text-5xl font-semibold'>{selectedChapterStr} {selectedTopicStr} M.C. Quiz</h1>
      {playingGame && 
        <div className={`${styles.centerArea}`}>
          <div className='flex sm:mb-20 mb-10'>
            <MCQuestion content={getMCOptions().correct}/>
          </div>
          <div className='flex justify-center items-center'>
            <MCOptions 
              onOptionChosen={handleOptionChosen}
              correctOption={getMCOptions().correct}
              otherOptions={getMCOptions().incorrect}
            />
          </div>
          <div className='flex flex-col mt-10 items-center justify-center'>
            <p className={`${styles.progressIndicator}`}>First Guess Correct Answers: {correctAnswersNum}</p>
            <p className={`${styles.progressIndicator}`}>Progress: {currentIndex}/{contents.length}</p>
          </div>
        </div>
      }
      {!playingGame && <>
        <p className='text-xl mt-8'>
          Game Over! <br/>
          Total First Guess Correct Answers: {correctAnswersNum}/{contents.length}  
        </p>
        <div className='mt-8'>
          {correctAnswersNum === contents.length ? (<>
            <p className='text-xl'>
              Congratulations! You got all questions perfect!
            </p>
          </>) : (<>
            <p className='text-xl mb-4'>
              Here is the list of questions you got incorrect on the first guess:
            </p>
            <div className='overflow-x-auto w-full'>
              <table className='table table-striped-columns table-hover table-bordered table-sm'>
                <thead>
                  <tr>
                    <th className='w-1/2'>Question</th>
                    <th className='w-1/2'>Answer</th>
                  </tr>
                </thead>
                <tbody className='table-group-divider'>
                  {wrongAnswersState.map(item => (
                    <tr key={item.question}>
                      <td>{item.question}</td>
                      <td>{item.answer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>)}
          <button 
            className='bg-slate-500 hover:bg-slate-700 text-white text-xl font-bold py-1 px-8 rounded-full mt-20'
            onClick={() => {
              resetStates()
              getShuffledContent()
            }}
          >
            Play Again
          </button>
        </div>
      </>}
      
    </main>
  );
}

export default MCQuiz;