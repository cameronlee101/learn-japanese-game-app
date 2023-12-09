import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <main className='flex flex-col text-center items-center justify-center h-full w-full'>
      <p>current pages:</p>
      <Link href='/pages/test1'>test1</Link>
      <Link href='/'>home</Link>
    </main>
  )
}

export default page