import React, { useEffect, useState } from 'react'
import styles from './MCOptions.module.css'

const MCOptions = (props: {
  onOptionChosen: (isCorrect: boolean) => void
  correctOption: string
  otherOptions: string[]
}) => {  
  const { onOptionChosen, correctOption, otherOptions } = props

  const [options, setOptions] = useState([''])

  // Creates 4 randomly ordered options using the 1 correct option and 3 other incorrect options 
  useEffect(() => {
    const shuffledIncorrectArray = otherOptions.sort(() => Math.random() - 0.5)

    const selectedStrings = shuffledIncorrectArray.slice(0, 3);
    const selectedOptions = [...selectedStrings, correctOption]

    const shuffledOptions = selectedOptions.sort(() => Math.random() - 0.5)
  
    setOptions(shuffledOptions)
  }, [props])

  const handleClick = (choice:string) => {
    // TODO: do logic whether option is correct or not
    if (choice === correctOption) {
      onOptionChosen(true)
    }
    else {
      onOptionChosen(false)
    }
  }

  return (
    <div className={styles.MCOptionArea}>
      <div className={styles.MCOption} onClick={() => handleClick(options[0])}>
        {options[0]}
      </div>
      <div className={styles.MCOption} onClick={() => handleClick(options[1])}>
        {options[1]}
      </div>
      <div className={styles.MCOption} onClick={() => handleClick(options[2])}>
        {options[2]}
      </div>
      <div className={styles.MCOption} onClick={() => handleClick(options[3])}>
        {options[3]}
      </div>
    </div>
  )
}

export default MCOptions