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
  private async getCollection() {
    const app = await new RealmAppService().getAppInstance()
    const client = await app?.currentUser?.mongoClient('mongodb-atlas')

    const collection = await client?.db('Japanese-content')?.collection('Genki-I')

    if (!collection) {
      throw new Error('Failed to connect to server')
    }

    return collection
  }

  async getContent(chapter: string, topic: string):Promise<undefined|VocabContent[]|KanjiContent[]> {
    const collection:[] = await (await this.getCollection()).aggregate([])
    const chapterKey = chapter.toLowerCase().replaceAll(' ', '')
    const topicKey = topic.toLowerCase()

    const chapterResult = collection.find((item) => chapterKey in item)
    if (!chapterResult) {
      console.error(`Error retrieving chapter content for ${chapter}`)
      console.trace()
    }
    else {
      const topicResult = chapterResult[chapterKey][topicKey]
      if (!topicResult) {
        console.error(`Topic '${topic}' not found in ${chapter}`)
        console.trace()
      }
      else {
        return topicResult
      }
    }

    return undefined
  }
}

// Function used to check if the given object is of type VocabContent
export function isVocabContent(obj:any):boolean {
  return obj && 
  typeof obj === 'object' && 
  'japanese' in obj && 
  'english' in obj
}
// Function used to check if the given object is of type KanjiContent
export function isKanjiContent(obj:any):boolean {
  return obj && 
  typeof obj === 'object' && 
  'kanji' in obj && 
  'readings' in obj && 
  'english' in obj &&
  'examples' in obj
}

// Function used to check if the combination of selections is valid and thus have content
export function isSelectionValid(chapter: string, topic: string): boolean {
  return validContentSelections.some(([selectedChapter, selectedTopic]) => {
    return selectedChapter === chapter && selectedTopic === topic;
  })
}

// Function used to return an object of the same type as passed in argument that has values for all parameters
// Returned object used to see all types contained in an interface
export function getExampleFullObject(obj:any):VocabContent|KanjiContent|undefined {
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
  else {
    console.error('Error occurred when attempting to retrieve content object')
    console.trace()
    return undefined
  } 
}