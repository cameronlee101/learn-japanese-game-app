'use client'
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContentClass, KanjiContent, VocabContent, isKanjiContent, isVocabContent } from '@/app/utils/utils';
import './mc-quiz.css'
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

  const [contents, setContents] = useState<VocabContent[]|KanjiContent[]>([{japanese: 'Loading...', english: 'Loading...'}])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctAnswersNum, setCorrectAnswersNum] = useState(0)

  const [wrongAnswersState, setWrongAnswersState] = useState<{question:string, answer:string}[]>([])
  const wrongAnswersRef = useRef<{question:string, answer:string}[]>([])

  const [playingGame, setPlayingGame] = useState(true)

  // Gets the contents for given chapter and topic, and checks that they are defined
  useEffect(() => {
    // Fetch flashcard contents
    const fetchedContents = new ContentClass().get(selectedChapterStr, selectedTopicStr)

    // Check if contents are undefined
    if (fetchedContents === undefined) {
      alert('Error retrieving contents, returning to home page (you may need to press "ok" on this alert multiple times)')
      router.push('/')
    } else {
      const shuffledContents = shuffleArray(fetchedContents)

      // Update the state with shuffled contents
      setContents(shuffledContents as (VocabContent[] | KanjiContent[]))
    }
  }, [])

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

        if (hasSelectedIncorrect) {
          hasSelectedIncorrect = false
        }
        else {
          setCorrectAnswersNum(correctAnswersNum+1)
        }
      }, 1000)
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
      return (contents[currentIndex] as VocabContent).japanese;
    } 
    else if (isKanjiContent(contents[0])) {
      return (contents[currentIndex] as KanjiContent).kanji;
    } 
    else {
      console.error('Error: unrecognized content type');
      console.trace();
      return 'Error';
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
      console.error('Error: unrecognized content type')
      console.trace()
      return undefined
    }
  }

  return (
    <main className='main-center'>
      <h1 className='text-5xl font-semibold'>
        Quiz
      </h1>
      {playingGame && 
        <div className='centerArea'>
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
            <p className='progressIndicator'>First-Time Correct Answers: {correctAnswersNum}</p>
            <p className='progressIndicator'>Progress: {currentIndex}/{contents.length}</p>
          </div>
        </div>
      }
      {!playingGame && <>
        <p className='text-xl mt-8'>
          Game Over! <br/>
          Total First-Time Correct Answers: {correctAnswersNum}/{contents.length}  
        </p>
        <div className='mt-8'>
          {correctAnswersNum === contents.length ? (
            <p className='text-xl'>
              Congratulations! You got all questions perfect!
            </p>
          ) : (<>
            <p className='text-xl mb-4'>
              Here is a list of question you got incorrect the first time:
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
        </div>
      </>}
      
    </main>
  );
}

export default MCQuiz;