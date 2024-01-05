import { Content } from '@/app/utils/utils'
import React from 'react'
import { getMCQuestionText } from '../MCQuiz-utils'

const MCQuestion = ( props: { content:Content }) => {
  const { content } = props

  return (<>
    <div className='flex bg-orange-200 justify-center items-center w-96 h-52 px-10 py-7 rounded-lg text-2xl shadow-md'>
      <div dangerouslySetInnerHTML={{ __html: getMCQuestionText(content) }}></div>
    </div>
  </>)
}

export default MCQuestion