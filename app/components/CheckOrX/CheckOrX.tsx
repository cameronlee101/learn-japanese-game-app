import Image from 'next/image'
import React, { useEffect, useState } from 'react'

export enum symbolOptions {
  checkMark ,
  xMark,
}

export const IMAGE_SIZE = 64

const CheckOrX = (props: { symbol: symbolOptions }) => {
  const { symbol } = props

  const [image, setImage] = useState('/xmark.png')

  useEffect(() => {
    switch (symbol) {
      case symbolOptions.checkMark:
        setImage('/checkmark.png')
        break
      case symbolOptions.xMark:
        setImage('/xmark.png')
        break
      default:
        console.error('Error: could not set CheckOrX component image')
    }
  }, [symbol, image])
  
  return (
    <main className='w-16 h-auto'>
      <Image src={image} alt="correctness symbol" width={64} height={64}/>
    </main>
  )
}

export default CheckOrX