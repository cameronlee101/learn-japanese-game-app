'use client'
import React, { useEffect, useState } from 'react'
import styles from './MCOptions.module.css'
import CheckOrX, { IMAGE_SIZE, symbolOptions } from '../../CheckOrX/CheckOrX'
import { Content } from '@/app/utils/content-utils'
import { getMCOptionText } from '../MCQuiz-utils'

enum validOptionStates {
  none,
  incorrect,
  correct
}

const NUM_OF_OPTIONS = 4

const MCOptions = (props: {
  onOptionChosen: (isCorrect: boolean) => void
  correctOption: Content
  otherOptions: Content[]
}) => {  
  const { onOptionChosen, correctOption, otherOptions } = props

  const [options, setOptions] = useState<{content:Content, state:validOptionStates}[]>([])

  const [checkOrXClass, setCheckOrXClass] = useState('')
  const [checkOrXPos, setCheckOrXPos] = useState({ x: 0, y: 0 })
  const [checkOrXSymbol, setCheckOrXSymbol] = useState(symbolOptions.xMark)
  const [inputEnalbed, setInputEnabled] = useState(true)

  // Creates NUM_OF_OPTIONS randomly ordered options using the 1 correct option and NUM_OF_OPTIONS-1 other incorrect options 
  useEffect(() => {
    const shuffledIncorrectArray = otherOptions.sort(() => Math.random() - 0.5)

    const selectedStrings = shuffledIncorrectArray.slice(0, NUM_OF_OPTIONS - 1)
    const selectedOptions = [...selectedStrings, correctOption]

    const shuffledOptions = selectedOptions.sort(() => Math.random() - 0.5) 
  
    setOptions(shuffledOptions.map((content) => ({ content, state: validOptionStates.none })))
    setInputEnabled(true)
  }, [correctOption, otherOptions])

  // Handles logic when an option is clicked for the first time
  const handleClick = (choice:Content, index:number, e:React.MouseEvent) => {
    // Option chosen is correct
    if (choice === correctOption) {
      setCheckOrXSymbol(symbolOptions.checkMark)
      onOptionChosen(true)
      updateOptionState(index, validOptionStates.correct)
      setInputEnabled(false)
    }
    // Option chosen is incorrect
    else {
      setCheckOrXSymbol(symbolOptions.xMark)
      onOptionChosen(false)
      updateOptionState(index, validOptionStates.incorrect)
    }
    
    // Set the check or X symbol to the cursor position
    setCheckOrXPos({ x: e.pageX - IMAGE_SIZE / 2, y: e.pageY - IMAGE_SIZE / 2 })

    // remove, then add class to reset fading up animation
    setCheckOrXClass('')
    setTimeout(() => {
      setCheckOrXClass(styles.fadeUp)
    }, 1)
  }

  // Updates an attribute in the 'options' array at the given index to indicate that that option was selected and indicate it's correctness 
  // Updated state used to assign a class on the JSX element to indicate if an incorrect option was already chosen
  const updateOptionState = (index: number, newState: validOptionStates) => {
    setOptions((prevOptions) => {
      const newOptions = [...prevOptions]
      newOptions[index] = { ...newOptions[index], state: newState }
      return newOptions
    })
  }

  return (
    <>
      <div className={`${styles.MCOptionArea}`}>
        {options.map((option, index) => 
          <div 
            key={index}
            className={`${styles.MCOption} ${options[index].state === validOptionStates.incorrect ? styles.incorrect : '' }`} 
            // Element only has click event listener if hasn't been clicked yet
            onMouseUp={inputEnalbed && options[index].state === validOptionStates.none ? (e) => handleClick(option.content, index, e) : ()=>{}}
            data-test={`mc-option-${index}`}  
          >
            {getMCOptionText(option.content)}
          </div>
        )}
      </div>
      <div className={`${checkOrXClass} absolute pointer-events-none`} style={{left:checkOrXPos.x, top:checkOrXPos.y, opacity:0}}>
        <CheckOrX symbol={checkOrXSymbol}/>
      </div>
    </>
  )
}

export default MCOptions