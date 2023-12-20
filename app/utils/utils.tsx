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

export interface VocabContent {
  japanese: string
  alternate?: string
  kanji?: string
  english: string
  example?: string
  [key: string]: string | undefined;
}

export interface KanjiContent {
  kanji: string
  readings: string[]
  english: string
  examples: string[]
  [key: string]: string | string[];
}

export class ContentClass {
  // TODO: switch to storing data on external server
  textbookData = require('./content.json')

  // Retrieves content based on chapter and topic from storage
  get (chapter: string, topic: string):undefined|VocabContent[] {
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

// Function used to check if the given object is of type VocabdContent
export function isVocabContent(obj:any):boolean {
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

// Function used to return an object of the same type as passed in argument that has values for all parameters
export function getExampleFullObject(obj:any):VocabContent|undefined {
  if (isVocabContent(obj)) {
    return {
      japanese: 'a',
      alternate: 'a',
      kanji: 'a',
      english: 'a',
      example: 'a',
    }
  }
  return undefined
}