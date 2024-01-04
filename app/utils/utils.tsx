import { RealmAppService } from './realm-app-service'

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
  [Chapters.Ch3, Topics.Conjugations],
]

export interface VocabContent {
  japanese: string
  alternate?: string
  kanji?: string
  english: string
  example?: string
  [key: string]: string | undefined
}

export interface KanjiContent {
  kanji: string
  readings: string[]
  english: string
  examples: string[]
  [key: string]: string | string[]
}

export interface ConjugationContent {
  dictionary_hiragana: string,
  dictionary_kanji?: string,
  english: string,
  conjugate_to: string, 
  conjugation: string,
  [key: string]: string | undefined
}

export class ContentClass {
  private async getCollection() {
    const app = await new RealmAppService().getAppInstance()
    const client = await app?.currentUser?.mongoClient('mongodb-atlas')

    const collection = await client?.db('Japanese-content')?.collection('Genki-I')

    if (!collection) {
      throw new Error('Failed to connect to server')
    }

    return collection
  }

  async getContent(chapter: string, topic: string):Promise<undefined|VocabContent[]|KanjiContent[]|ConjugationContent[]> {
    const collection:[] = await (await this.getCollection()).aggregate([])
    const chapterKey = chapter.toLowerCase().replaceAll(' ', '')
    const topicKey = topic.toLowerCase()

    const chapterResult = collection.find((item) => chapterKey in item)
    if (!chapterResult) {
      console.error(`Error retrieving chapter content for ${chapter}`)
    }
    else {
      const topicResult = chapterResult[chapterKey][topicKey]
      if (!topicResult) {
        console.error(`Topic '${topic}' not found in ${chapter}`)
      }
      else {
        return topicResult
      }
    }

    return undefined
  }
}

// Function used to check if the given object is of type VocabContent or is an array with VocabContent
export function isVocabContent(obj:any):boolean {
  if (Array.isArray(obj) && (obj as []).length > 0) {
    return isVocabContent(obj[0])
  }
  else if (Array.isArray(obj) && (obj as []).length == 0) {
    return false
  }
  else {
    return obj && 
    typeof obj === 'object' && 
    'japanese' in obj && 
    'english' in obj
  }
}
// Function used to check if the given object is of type KanjiContent or is an array with KanjiContent
export function isKanjiContent(obj:any):boolean {
  if (Array.isArray(obj) && (obj as []).length > 0) {
    return isKanjiContent(obj[0])
  }
  else if (Array.isArray(obj) && (obj as []).length == 0) {
    return false
  }
  else {
    return obj && 
    typeof obj === 'object' && 
    'kanji' in obj && 
    'readings' in obj && 
    'english' in obj &&
    'examples' in obj
  }
}
// Function used to check if the given object is of type ConjugationContent or is an array with ConjugationContent
export function isConjugationContent(obj:any):boolean {
  if (Array.isArray(obj) && (obj as []).length > 0) {
    return isConjugationContent(obj[0])
  }
  else if (Array.isArray(obj) && (obj as []).length == 0) {
    return false
  }
  else {
    return obj && 
    typeof obj === 'object' && 
    'dictionary_hiragana' in obj && 
    'english' in obj &&
    'conjugate_to' in obj &&
    'conjugation' in obj
  }
}

// Function used to check if the combination of selections is valid and thus have content
export function isSelectionValid(chapter: string, topic: string): boolean {
  return validContentSelections.some(([selectedChapter, selectedTopic]) => {
    return selectedChapter === chapter && selectedTopic === topic;
  })
}

// Function used to return an object of the same type as passed in argument that has values for all parameters
// Returned object used to see all types contained in an interface
export function getExampleFullObject(obj:any):VocabContent|KanjiContent|ConjugationContent|undefined {
  if (isVocabContent(obj)) {
    return {
      japanese: 'a',
      alternate: 'a',
      kanji: 'a',
      english: 'a',
      example: 'a',
    }
  }
  else if (isKanjiContent(obj)) {
    return {
      kanji: 'a',
      readings: ['a'],
      english: 'a',
      examples: ['a'],
    }
  }
  else if (isConjugationContent(obj)) {
    return {
      dictionary_hiragana: 'a',
      dictionary_kanji: 'a',
      english: 'a',
      conjugate_to: 'a', 
      conjugation: 'a',
    }
  }
  else {
    console.error('Error occurred when attempting to retrieve example content object')
    return undefined
  } 
}