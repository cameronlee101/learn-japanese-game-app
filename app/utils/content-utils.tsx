import { RealmAppService } from './realm-app-service'

export enum Chapters {
  Ch1 = 'Chapter 1',
  Ch2 = 'Chapter 2',
  Ch3 = 'Chapter 3',
  Ch4 = 'Chapter 4',
  Ch5 = 'Chapter 5',
  Ch6 = 'Chapter 6',
  Ch7 = 'Chapter 7',
  Ch8 = 'Chapter 8',
  Ch9 = 'Chapter 9',
  Ch10 = 'Chapter 10',
  Ch11 = 'Chapter 11',
  Ch12 = 'Chapter 12',
}

export enum Topics {
  Vocabulary = 'Vocabulary',
  Kanji = 'Kanji',
  Numbers = 'Numbers',
  Conjugations = 'Conjugations',
}

export type VocabContent = {
  japanese: string
  alternate?: string
  kanji?: string
  english: string
  example?: string
  [key: string]: string | undefined
}

export type KanjiContent = {
  kanji: string
  readings: string[]
  english: string
  examples: string[]
  [key: string]: string | string[]
}

export type ConjugationContent = {
  dictionary_hiragana: string,
  dictionary_kanji?: string,
  english: string,
  conjugate_to: string, 
  conjugation: string,
  [key: string]: string | undefined
}

export type Content = VocabContent | KanjiContent | ConjugationContent

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

  async getContent(chapter: string, topic: string):Promise<undefined|Content[]> {
    const collection:[] = await (await this.getCollection()).aggregate([])
    const chapterKey = chapter.toLowerCase().replaceAll(' ', '')
    const topicKey = topic.toLowerCase()

    const chapterResult = collection.find((item) => chapterKey in item)
    if (!chapterResult) {
      console.error(`Error: could not retrieve chapter content for ${chapter}`)
    }
    else {
      const topicResult = chapterResult[chapterKey][topicKey]
      if (!topicResult) {
        console.error(`Error: topic '${topic}' not found in ${chapter}`)
      }
      else {
        return topicResult
      }
    }

    return undefined
  }

  async getAggregatedCollection():Promise<[]> {
    return await (await this.getCollection()).aggregate([])
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

// Function used to return an object of the same type as passed in argument that has values for all parameters
// Returned object used to see all types contained in an interface
export function getFullExampleContentObject(obj:any):undefined|Content {
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
    console.error('Error: could not retrieve full example content object')
    return undefined
  } 
}