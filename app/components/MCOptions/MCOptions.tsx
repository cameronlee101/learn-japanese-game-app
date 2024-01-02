'use client'
import React, { useEffect, useState } from 'react'
import styles from './MCOptions.module.css'
import CheckOrX, { symbolOptions } from '../CheckOrX/CheckOrX'

enum validOptionStates {
  none,
  incorrect,
  correct
}

const MCOptions = (props: {
  onOptionChosen: (isCorrect: boolean) => void
  correctOption: string
  otherOptions: string[]
}) => {  
  const { onOptionChosen, correctOption, otherOptions } = props

  const [options, setOptions] = useState<{text:string, state:validOptionStates}[]>([])

  const [checkOrXClass, setCheckOrXClass] = useState('')
  const [checkOrXPos, setCheckOrXPos] = useState({ x: 0, y: 0 });
  const [checkOrXSymbol, setCheckOrXSymbol] = useState(symbolOptions.xMark)
  const [inputEnalbed, setInputEnabled] = useState(true)

  // Creates 4 randomly ordered options using the 1 correct option and 3 other incorrect options 
  useEffect(() => {
    const shuffledIncorrectArray = otherOptions.sort(() => Math.random() - 0.5)

    const selectedStrings = shuffledIncorrectArray.slice(0, 3);
    const selectedOptions = [...selectedStrings, correctOption]

    const shuffledOptions = selectedOptions.sort(() => Math.random() - 0.5) 
  
    setOptions(shuffledOptions.map((text) => ({ text, state: validOptionStates.none })))
    setInputEnabled(true)
  }, [props])

  // Handles logic when an option is clicked for the first time
  const handleClick = (choice:string, index:number, e:React.MouseEvent) => {
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
    setCheckOrXPos({ x: e.clientX - 32, y: e.clientY - 32 })

    // remove, then add class to reset fading up animation
    setCheckOrXClass('');
    setTimeout(() => {
      setCheckOrXClass(styles.fadeUp);
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
            onClick={inputEnalbed && options[index].state === validOptionStates.none ? (e) => handleClick(option.text, index, e) : ()=>{}}  
          >
            {option.text}
          </div>
        )}
      </div>
      <div className={`${checkOrXClass} absolute`} style={{left:checkOrXPos.x, top:checkOrXPos.y, opacity:0}}>
        <CheckOrX symbol={checkOrXSymbol}/>
      </div>
    </>
  )
}

export default MCOptions