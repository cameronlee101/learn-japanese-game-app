'use client'
import { Content, ContentClass, getFullExampleContentObject } from "@/app/utils/content-utils"
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

  const [allParameters, setAllParameters] = useState<string[]>([])
  const [tableHeaders, setTableHeaders] = useState<string[]>([])
  const [contents, setContents] = useState<Content[]>([{japanese: 'Loading...', english: 'Loading...'}])

  // Gets contents for the table on page load
  useEffect(() => {
    getContent()
  }, [])

  // Extracts parameter names from an example object for the table headers and to align table data
  useEffect(() => {
    if (getFullExampleContentObject(contents[0])) {
      if (getFullExampleContentObject(contents[0])) {
        setAllParameters(Object.keys(getFullExampleContentObject(contents[0])!))

        let objAttributes = Object.keys(getFullExampleContentObject(contents[0])!)
        for (let i in objAttributes) {
          const no_spaces = objAttributes[i].replaceAll('_', ' ')
          objAttributes[i] = no_spaces.charAt(0).toUpperCase() +  no_spaces.slice(1)
        }
        setTableHeaders(objAttributes)
      }
      else {
        console.error('Error occurred when retrieving example object containing all attributes')
      }
    }
  }, [contents])

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
        setContents(fetchedContents)
      }
    })
  }

  return (
    <main className='main-center'>
      <h1 className='text-5xl font-semibold mb-8'>Contents of {selectedChapterStr} {selectedTopicStr}</h1>
      <div className='overflow-x-auto w-full'>
        <table className='table table-striped-columns table-hover table-bordered table-sm'>
          <thead>
            <tr>
              {tableHeaders.map((parameter, index) => (
                <th 
                  key={index}
                  style={{ minWidth:'200px' }}
                >
                  {parameter}
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
      </div>
    </main>
  );
}

export default ContentsOf;