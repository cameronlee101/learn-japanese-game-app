export enum Chapters {
  Ch1 = 'Chapter 1',
  Ch2 = 'Chapter 2',
  Ch3 = 'Chapter 3',
}

export enum Topics {
  Vocabulary = 'Vocabulary',
  Kanji = 'Kanji',
  Numbers = 'Numbers',
  Conjugations = 'Conjugations',
}

const validContentSelections = [
  [Chapters.Ch1, Topics.Vocabulary],
  [Chapters.Ch1, Topics.Numbers],
  [Chapters.Ch2, Topics.Vocabulary],
  [Chapters.Ch3, Topics.Vocabulary],
  [Chapters.Ch3, Topics.Kanji],
]

export interface VocabFlashcardContent {
  japanese: string
  alternate?: string
  kanji?: string
  english: string
  example?: string
}

export class ContentClass {
  // TODO: switch to storing data on external server
  textbookData = require('./content.json')

  // Retrieves content based on chapter and topic from storage
  get (chapter: string, topic: string):undefined|VocabFlashcardContent[] {
    const numberPattern: RegExp = /\d+/
    const chapterNum = parseInt(chapter.match(numberPattern)![0])

    if (isNaN(chapterNum)) {
      console.error(`Error getting number from "${chapter}" when retrieving content`)
    }
    else {
      const content = this.textbookData.chapters[chapterNum - 1][topic.toLowerCase()]
      if (content == undefined) {
        console.error(`Topic '${topic}' not found in chapter ${chapterNum}`);
      } else {
        return content;
      }
    }
  
    return undefined
  }
}

// Function used to check if the given object is of type VocabFlashcardContent
export function isVocabFlashcardContent(obj:any) {
  return obj && 
  typeof obj === 'object' && 
  'japanese' in obj && 
  'english' in obj
}

// Function used to check if the combination of selections is valid and thus have content
export function isSelectionValid(chapter: string, topic: string): boolean {
  return validContentSelections.some(([selectedChapter, selectedTopic]) => {
    return selectedChapter === chapter && selectedTopic === topic;
  })
}