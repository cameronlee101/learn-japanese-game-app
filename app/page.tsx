import Link from 'next/link'
import React from 'react'

function Home() {
  return (
    <main className='flex flex-col text-center items-center justify-center h-full w-full'>
      <p>current pages:</p>
      <Link href='/pages/test1'>test1</Link>
      <Link href='/pages/test2'>test2</Link>
    </main>
  )
}

export default Home