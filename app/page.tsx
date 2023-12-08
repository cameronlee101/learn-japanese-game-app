import React from 'react'
import Flashcard from "./components/Flashcard/Flashcard"
import './app.module.css'

export default function Home() {
  return (
    <main className='bg-color flex flex-col text-center items-center justify-center h-full'>
      <Flashcard frontContent="こんいちは" backContent="Hello"></Flashcard>
    </main>
  )
}