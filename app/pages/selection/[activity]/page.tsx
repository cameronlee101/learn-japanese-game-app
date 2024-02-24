"use client";
import React, { useEffect, useState } from "react";
import { Chapters, Topics, fetchAllContent } from "@/app/utils/content-utils";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@uidotdev/usehooks";
import styles from "./selection.module.css";
import TopicStatusModal from "@/app/components/TopicStatusModal/TopicStatusModal";
import ErrorBox from "@/app/components/ErrorBox/ErrorBox";
import { useQuery } from "@tanstack/react-query";

const titleSuffixes = [
  {
    activity: "flashcards-activity",
    suffix: "for Flashcards",
  },
  {
    activity: "mc-quiz",
    suffix: "for Multiple Choice Quiz",
  },
  {
    activity: "matching-activity",
    suffix: "for Term Matching",
  },
  {
    activity: "contents-of",
    suffix: "to See The Contents of",
  },
];

function Selection({ params }: { params: { activity: string } }) {
  const { status, data, error } = useQuery({
    queryKey: ["collection"],
    queryFn: fetchAllContent,
  });

  const chapters = Object.values(Chapters);
  const topics = Object.values(Topics);
  const router = useRouter();
  const selectedSuffix = titleSuffixes.find((item) => {
    if (item.activity === params.activity) return item.suffix;
  });

  const [selection, setSelection] = useLocalStorage("selection", [
    chapters[0].valueOf(),
    topics[0].valueOf(),
  ]);
  const [selectedChapter, setSelectedChapter] = useState<string>(chapters[0]);
  const [selectedTopic, setSelectedTopic] = useState<string>(topics[0]);

  const [errorBoxText, setErrorBoxText] = useState("");
  const [showError, setShowError] = useState(false);

  const [collection, setCollection] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Gets chapter and topic from localstorage and sets the relevant hooks (used for remembering
    // chapter and topic the user previously selected)
    if (selection) {
      setSelectedChapter(selection[0]);
      setSelectedTopic(selection[1]);
    }
  }, []);

  // Updates the contents based on the result of the react query
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setCollection(data);
    }
  }, [data]);

  // If user selection is valid, updates localstorage on user's chapter and topic choice, then changes the page
  const submitForm = (event: React.FormEvent) => {
    event.preventDefault();
    if (isSelectionValid(selectedChapter, selectedTopic)) {
      setSelection([selectedChapter, selectedTopic]);
      router.push(
        "/pages/" +
          params.activity +
          "/" +
          selectedChapter +
          "/" +
          selectedTopic,
      );
    } else {
      setErrorBoxText(
        "Current chapter and topic selection is not valid, please change one or more selection",
      );
      setShowError(true);
    }
  };

  // Returns whether there is content for the selected chapter and topic
  const isSelectionValid = (chapter: string, topic: string): boolean => {
    const chapterKey = chapter.toLowerCase().replaceAll(" ", "");
    const topicKey = topic.toLowerCase();

    if (
      collection &&
      collection.find((doc: any) => {
        if (doc[chapterKey] && doc[chapterKey][topicKey]) {
          return true;
        }
      })
    ) {
      return true;
    } else {
      return false;
    }
  };

  // Toggles whether the modal is visible
  const toggleShowModal = () => {
    setShowModal(!showModal);
  };

  // Closes the error text box
  const closeErrorBox = () => {
    setShowError(false);
  };

  return (
    <main className="main-center">
      <h1 className="text-5xl font-semibold">
        Select Chapter and Topic {selectedSuffix ? selectedSuffix.suffix : ""}
      </h1>
      <div>
        <form className="flex flex-col mt-6" onSubmit={submitForm}>
          <div className={styles.selectArea}>
            <label htmlFor="chapter" className="text-xl">
              Chapter
            </label>
            <select
              id="chapter"
              value={selectedChapter}
              onChange={(e) => {
                setSelectedChapter(e.target.value);
              }}
              className={styles.select}
            >
              {chapters.map((item) => (
                <option key={item} value={item} className={styles.option}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.selectArea}>
            <label htmlFor="topic" className="text-xl">
              Topic
            </label>
            <select
              id="topic"
              value={selectedTopic}
              onChange={(e) => {
                setSelectedTopic(e.target.value);
              }}
              className={styles.select}
            >
              {topics.map((item) => (
                <option key={item} value={item} className={styles.option}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <button
            className="bg-slate-500 hover:bg-slate-700 text-white text-xl font-bold py-1 px-2 rounded-full mt-20"
            data-test="submit-button"
            disabled={collection.length == 0 ? true : false}
          >
            Submit
          </button>
          <button
            className="bg-slate-500 hover:bg-slate-700 text-white text-xl font-bold py-1 px-2 rounded-full mt-10"
            onClick={toggleShowModal}
            type="button"
            data-test="valid-topics-button"
          >
            See Valid Topics
          </button>
        </form>
      </div>
      {showModal && (
        <TopicStatusModal
          onClose={toggleShowModal}
          isSelectionValid={isSelectionValid}
        />
      )}
      {showError && <ErrorBox text={errorBoxText} onClose={closeErrorBox} />}
    </main>
  );
}

export default Selection;
