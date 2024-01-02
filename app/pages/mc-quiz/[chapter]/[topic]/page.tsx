'use client'
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContentClass, KanjiContent, VocabContent, isKanjiContent, isVocabContent } from '@/app/utils/utils';
import styles from './mc-quiz.module.css'
import MCOptions from '@/app/components/MCOptions/MCOptions';

function MCQuiz({ 
  params,
}: {
  params: { chapter: string, topic: string }
}) {
  const router = useRouter()
  const selectedChapterStr = decodeURI(params.chapter)
  const selectedTopicStr = decodeURI(params.topic)

  let hasSelectedIncorrect:boolean = false;

  const [contents, setContents] = useState<VocabContent[]|KanjiContent[]>([{japanese: 'Loading...', english: 'Loading...'}, {japanese: 'Loading...', english: 'Loading...'}, {japanese: 'Loading...', english: 'Loading...'}, {japanese: 'Loading...', english: 'Loading...'}])
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
        setContents(shuffledContents as (VocabContent[] | KanjiContent[]))
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
      const quizQuestion = getQuizQuestion()
      const quizOptions = getQuizOptions()
      if (quizQuestion && quizOptions && !wrongAnswersRef.current.find(item => item.question === quizQuestion)) {
        wrongAnswersRef.current = [...wrongAnswersRef.current, {question:quizQuestion, answer:quizOptions.answer}]
      }
    }    
  }

  // TODO: refactor or change to passing entire object
  const getQuizQuestion = ():string|undefined => {
    if (isVocabContent(contents[0])) {
      return (contents[currentIndex] as VocabContent).japanese
    } 
    else if (isKanjiContent(contents[0])) {
      return (contents[currentIndex] as KanjiContent).kanji
    } 
    else {
      console.error('Error: could not retrieve quiz question from unrecognized content type')
      return 'Error'
    }
  }

  // TODO: refactor or change to passing entire object
  const getQuizOptions = ():{answer:string, others:string[]}|undefined => {
    if (isVocabContent(contents[0])) {
      const othersArray: string[] = contents.map(obj => obj.english);

      if (currentIndex == contents.length - 1) {
        return (
          {answer: contents[currentIndex].english, others: othersArray.slice(0, currentIndex)}
        )
      }
      else {
        return (
          {answer: contents[currentIndex].english, others: [...othersArray.slice(0, currentIndex), ...othersArray.slice(currentIndex+1)]} 
        )
      }
    }
    else if (isKanjiContent(contents[0])) {
      const othersArray: string[] = contents.map(obj => obj.english);
      
      if (currentIndex == contents.length - 1) {
        return (
          {answer: contents[currentIndex].english, others: othersArray.slice(0, currentIndex)}
        )
      }
      else {
        return (
          {answer: contents[currentIndex].english, others: [...othersArray.slice(0, currentIndex), ...othersArray.slice(currentIndex+1)]} 
        )
      }
    }
    else {
      console.error('Error: could not retrieve quiz options from unrecognized content type');
      return undefined
    }
  }

  return (
    <main className='main-center'>
      <h1 className='text-5xl font-semibold'>
        Quiz
      </h1>
      {playingGame && 
        <div className={`${styles.centerArea}`}>
          <div className='flex bg-orange-200 justify-center items-center mb-20 w-96 h-52 px-10 py-7 rounded-lg text-2xl shadow-md'>
            {getQuizQuestion()}
          </div>
          <div className='flex justify-center items-center'>
            <MCOptions 
              onOptionChosen={handleOptionChosen}
              correctOption={getQuizOptions()?.answer || 'Error'}
              otherOptions={getQuizOptions()?.others || ['Error']}
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
          {correctAnswersNum === contents.length ? (
            <p className='text-xl'>
              Congratulations! You got all questions perfect!
            </p>
          ) : (<>
            <p className='text-xl mb-4'>
              Here is a list of question you got incorrect on the first guess:
            </p>
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