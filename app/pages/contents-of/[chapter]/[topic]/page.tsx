'use client'
import { ContentClass, KanjiContent, VocabContent, getExampleFullObject } from "@/app/utils/utils"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'

function ContentsOf({ 
  params,
}: {
  params: { chapter: string, topic: string }
}) {
  const router = useRouter()
  const selectedChapterStr = decodeURI(params.chapter)
  const selectedTopicStr = decodeURI(params.topic)

  const [contents, setContents] = useState<VocabContent[]|KanjiContent[]>([{japanese: 'Loading...', english: 'Loading...'}])

  // Extracts parameter names from an example object for the table headers
  let allParameters = ['']
  if (getExampleFullObject(contents[0])) {
    if (getExampleFullObject(contents[0])) {
      allParameters = Object.keys(getExampleFullObject(contents[0])!)
    }
    else {
      console.error('Error occurred when retrieving example object containing all attributes')
      console.trace()
    }
  }

  // Gets contents for the table on page load
  useEffect(() => {
    getContent()
  }, [])

  // Gets the contents for given chapter and topic checks that they are defined
  const getContent = () => {
    // Fetches contents
    new ContentClass().getContent(selectedChapterStr, selectedTopicStr).then((fetchedContents) => {
      // Check if contents are undefined
      if (fetchedContents === undefined) {
        alert('Error retrieving contents, returning to home page (you may need to press "ok" on this alert multiple times)')
        router.push('/')
      } else {
        // Update the state with contents
        setContents(fetchedContents as (VocabContent[] | KanjiContent[]))
      }
    })
  }

  return (
    <main className='main-center'>
      <h1 className='text-5xl font-semibold mb-8'>Contents of {selectedChapterStr} {selectedTopicStr}</h1>
      <table className='table table-striped-columns table-hover table-bordered table-sm'>
        <thead >
          <tr>
            {allParameters.map((parameter, index) => (
              <th 
                key={index}
                style={{ minWidth:'100px' }}
              >
                {parameter.charAt(0).toUpperCase() + parameter.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='table-group-divider'>
          {contents.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {allParameters.map((parameter, columnIndex) => (
                <td key={columnIndex} className='whitespace-pre'>
                  {Array.isArray(item[parameter])
                  ? (item[parameter] as string[]).join(',   ') 
                  : item[parameter] || ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default ContentsOf;