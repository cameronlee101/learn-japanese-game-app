import React, { useEffect, useState } from 'react'

export enum symbolOptions {
  checkMark ,
  xMark,
}

const CheckOrX = (props: { symbol: symbolOptions }) => {
  const { symbol } = props

  const [image, setImage] = useState('/')

  useEffect(() => {
    switch (symbol) {
      case symbolOptions.checkMark:
        setImage('/checkmark.png')
        break
      case symbolOptions.xMark:
        setImage('/xmark.png')
        break
      default:
        console.error('Err')
        console.trace()
    }
  }, [props.symbol, image])
  
  return (
    <main className='w-16 h-auto pointer-events-none user-select-none'>
      <img src={image} alt="correctness symbol"/>
    </main>
  )
}

export default CheckOrX