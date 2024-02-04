import { RealmAppService } from "./realm-app-service";

export enum Chapters {
  Ch1 = "Chapter 1",
  Ch2 = "Chapter 2",
  Ch3 = "Chapter 3",
  Ch4 = "Chapter 4",
  Ch5 = "Chapter 5",
  Ch6 = "Chapter 6",
  Ch7 = "Chapter 7",
  Ch8 = "Chapter 8",
  Ch9 = "Chapter 9",
  Ch10 = "Chapter 10",
  Ch11 = "Chapter 11",
  Ch12 = "Chapter 12",
}

export enum Topics {
  Vocabulary = "Vocabulary",
  Kanji = "Kanji",
  Numbers = "Numbers",
  Conjugations = "Conjugations",
}

export type VocabContent = {
  japanese: string;
  alternate?: string;
  kanji?: string;
  english: string;
  example?: string;
  [key: string]: string | undefined;
};

export type KanjiContent = {
  kanji: string;
  readings: string[];
  english: string;
  examples: string[];
  [key: string]: string | string[];
};

export type ConjugationContent = {
  dictionary_hiragana: string;
  dictionary_kanji?: string;
  english: string;
  conjugate_to: string;
  conjugation: string;
  [key: string]: string | undefined;
};

export type Content = VocabContent | KanjiContent | ConjugationContent;

export class ContentClass {
  private async getCollection() {
    const app = await new RealmAppService().getAppInstance();
    const client = await app?.currentUser?.mongoClient("mongodb-atlas");

    const collection = await client
      ?.db("Japanese-content")
      ?.collection("Genki-I");

    if (!collection) {
      throw new Error("Failed to connect to server");
    }

    return collection;
  }

  async getContent(
    chapter: string,
    topic: string,
  ): Promise<undefined | Content[]> {
    const collection: [] = await (await this.getCollection()).aggregate([]);
    const chapterKey = chapter.toLowerCase().replaceAll(" ", "");
    const topicKey = topic.toLowerCase();

    const chapterResult = collection.find((item) => chapterKey in item);
    if (!chapterResult) {
      console.error(`Error: could not retrieve chapter content for ${chapter}`);
    } else {
      const topicResult = chapterResult[chapterKey][topicKey];
      if (!topicResult) {
        console.error(`Error: topic '${topic}' not found in ${chapter}`);
      } else {
        return topicResult;
      }
    }

    return undefined;
  }

  async getAggregatedCollection(): Promise<[]> {
    return await (await this.getCollection()).aggregate([]);
  }
}

// Function used to check if the given object is of type VocabContent or is an array with VocabContent
export function isOrHasVocabContent(obj: any): obj is VocabContent {
  if (Array.isArray(obj) && obj.length > 0) {
    return isOrHasVocabContent(obj[0]);
  } else if (Array.isArray(obj) && obj.length == 0) {
    return false;
  } else {
    const { japanese, english, alternate, kanji, example, ...rest } = obj;

    // Return false if the object has any extra attributes
    if (Object.keys(rest).length > 0) {
      return false;
    }

    return (
      typeof japanese === "string" &&
      typeof english === "string" &&
      (alternate === undefined || typeof alternate === "string") &&
      (kanji === undefined || typeof kanji === "string") &&
      (example === undefined || typeof example === "string")
    );
  }
}
// Function used to check if the given object is of type KanjiContent or is an array with KanjiContent
export function isOrHasKanjiContent(obj: any): obj is KanjiContent {
  if (Array.isArray(obj) && obj.length > 0) {
    return isOrHasKanjiContent(obj[0]);
  } else if (Array.isArray(obj) && obj.length == 0) {
    return false;
  } else {
    const { kanji, readings, english, examples, ...rest } = obj;

    // Return false if the object has any extra attributes
    if (Object.keys(rest).length > 0) {
      return false;
    }

    return (
      typeof kanji === "string" &&
      Array.isArray(readings) &&
      readings.every((reading: any) => typeof reading === "string") &&
      typeof english === "string" &&
      Array.isArray(examples) &&
      examples.every((example: any) => typeof example === "string")
    );
  }
}
// Function used to check if the given object is of type ConjugationContent or is an array with ConjugationContent
export function isOrHasConjugationContent(obj: any): obj is ConjugationContent {
  if (Array.isArray(obj) && obj.length > 0) {
    return isOrHasConjugationContent(obj[0]);
  } else if (Array.isArray(obj) && obj.length === 0) {
    return false;
  } else {
    const { dictionary_hiragana, dictionary_kanji, english, conjugate_to, conjugation, ...rest } = obj;

    // Return false if the object has any extra attributes
    if (Object.keys(rest).length > 0) {
      return false;
    }

    return (
      typeof dictionary_hiragana === "string" &&
      (dictionary_kanji === undefined || typeof dictionary_kanji === "string") &&
      typeof english === "string" &&
      typeof conjugate_to === "string" &&
      typeof conjugation === "string"
    );
  }
}

// Function used to return an object of the same type as passed in argument that has values for all parameters
// Returned object used to see all types contained in an interface
export function getFullExampleContentObject(obj: any): undefined | Content {
  if (isOrHasVocabContent(obj)) {
    return {
      japanese: "a",
      alternate: "a",
      kanji: "a",
      english: "a",
      example: "a",
    };
  } else if (isOrHasKanjiContent(obj)) {
    return {
      kanji: "a",
      readings: ["a"],
      english: "a",
      examples: ["a"],
    };
  } else if (isOrHasConjugationContent(obj)) {
    return {
      dictionary_hiragana: "a",
      dictionary_kanji: "a",
      english: "a",
      conjugate_to: "a",
      conjugation: "a",
    };
  } else {
    console.error("Error: could not retrieve full example content object");
    return undefined;
  }
}
