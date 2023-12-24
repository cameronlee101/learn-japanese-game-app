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

  let needToResetClass = false
  const [checkOrXClass, setCheckOrXClass] = useState('')
  const [checkOrXPos, setCheckOrXPos] = useState({ x: 0, y: 0 });
  const [checkOrXSymbol, setCheckOrXSymbol] = useState(symbolOptions.xMark)

  // Creates 4 randomly ordered options using the 1 correct option and 3 other incorrect options 
  useEffect(() => {
    const shuffledIncorrectArray = otherOptions.sort(() => Math.random() - 0.5)

    const selectedStrings = shuffledIncorrectArray.slice(0, 3);
    const selectedOptions = [...selectedStrings, correctOption]

    const shuffledOptions = selectedOptions.sort(() => Math.random() - 0.5) 
  
    setOptions(shuffledOptions.map((text) => ({ text, state: validOptionStates.none })))
  }, [props])

  // Handles logic when an option is clicked
  const handleClick = (choice:string, index:number, e:React.MouseEvent) => {
    // Option chosen is correct
    // TODO: refactor
    if (choice === correctOption) {
      setCheckOrXSymbol(symbolOptions.checkMark)
      setCheckOrXPos({ x: e.clientX - 32, y: e.clientY - 32 })
      setCheckOrXClass(styles.fadeUp)

      setTimeout(() => {
        setCheckOrXClass('')
      }, 1500)

      onOptionChosen(true)
      updateOptionState(index, validOptionStates.correct)
    }
    // Option chosen is incorrect
    else {
      setCheckOrXSymbol(symbolOptions.xMark)
      setCheckOrXPos({ x: e.clientX - 32, y: e.clientY - 32 })
      setCheckOrXClass(styles.fadeUp)

      setTimeout(() => {
        setCheckOrXClass('')
      }, 1500)

      onOptionChosen(false)
      updateOptionState(index, validOptionStates.incorrect)
    }
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
      <div className={styles.MCOptionArea}>
        {options.map((option, index) => 
          <div 
            key={index}
            className={`${styles.MCOption} ${options[index].state === validOptionStates.incorrect ? styles.incorrect : '' }`} 
            onClick={options[index].state === validOptionStates.incorrect ? ()=>{} : (e) => handleClick(option.text, index, e)}
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