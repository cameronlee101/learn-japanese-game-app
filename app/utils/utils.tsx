export enum Chapters {
  Ch1 = 'Chapter 1',
  Ch2 = 'Chapter 2',
  Ch3 = 'Chapter 3',
}

export enum Topics {
  Vocabulary = 'Vocabulary',
  Kanji = 'Kanji',
}

interface FlashcardContent {
  japanese: string
  english: string
  example?: string
}

export class ContentClass {
  // TODO: switch to storing data on external server
  textbookData = require('./content.json')

  // Retrieves content based on chapter and topic from storage
  get (chapter: string, topic: string):undefined|FlashcardContent[] {
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