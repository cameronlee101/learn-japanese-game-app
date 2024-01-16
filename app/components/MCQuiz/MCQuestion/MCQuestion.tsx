import { Content } from '@/app/utils/content-utils'
import React from 'react'
import { getMCQuestion } from '../MCQuiz-utils'

const MCQuestion = ( props: { content:Content }) => {
  const { content } = props

  return (<>
    <div 
      className='flex flex-col whitespace-pre-wrap bg-orange-100 justify-center items-center rounded-lg text-2xl shadow-md
      sm:w-96 sm:h-52 sm:px-10 sm:py-7
      w-72 h-40'
    >
      {getMCQuestion(content)}
    </div>
  </>)
}

export default MCQuestion