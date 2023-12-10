import React from 'react'

function Home() {
  return (
    <main className='flex flex-col items-center text-center min-h-screen min-w-full p-12'>
      <h1 className='text-5xl font-semibold'>Welcome to the website</h1>
      <p className='items-center text-center text-xl mt-10'>
        This website is meant to help you memorize Japanese vocabulary with various games and activities. <br/><br/>
        To get started, open the menu in the top left and select an activity!
      </p>
    </main>
  )
}

export default Home
