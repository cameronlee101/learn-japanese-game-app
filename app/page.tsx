import React from 'react'
import './app.css'

function Home() {
  return (
    <main className='main-center'>
      <h1 className='text-5xl font-semibold mb-8'>Welcome to the website</h1>
      <p className='text'>
        This website is meant to be a study tool to help you memorize Japanese vocabulary and kanji.
      </p>
      <p className='text'>
        The content of this website follows the &#34;Genki I&#34; textbook, and assumes you know hiragana and katakana or can easily look up the romaji (the romanized equivalent of hiragana and katakana).
      </p>
      <p className='text'>
        To get started, open the menu in the top left and select an activity!
      </p>
    </main>
  )
}

export default Home
