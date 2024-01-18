import React from 'react'

const ErrorBox = (props: { 
  text: string,
  onClose: () => void
}) => {
  const { text, onClose } = props

  return (
    <div className='flex flex-col bg-red-400 w-80 p-3 rounded-xl bg-opacity-95 sm:text-xl fixed top-10' data-test='error-text-box'>
      <div className='flex flex-row justify-between pb-1'>
        <p>Error:</p>
        <button className='btn-close' aria-label='Close' onClick={onClose} data-test='error-text-box-close'></button>
      </div>
      <p className='text-left'>{text}</p>
    </div>
  )
}

export default ErrorBox