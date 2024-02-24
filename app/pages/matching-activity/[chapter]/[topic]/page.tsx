"use client";
import CheckOrX, { IMAGE_SIZE, symbolOptions } from "@/app/components/CheckOrX/CheckOrX";
import MatchOption from "@/app/components/MatchOption/MatchOption";
import { Content, fetchContent } from "@/app/utils/content-utils";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./matching-activity.module.css";

type ChosenOption = {
  x: number
  y: number
  text: string
}

function MatchingActivity({
  params,
}: {
  params: { chapter: string; topic: string };
}) {
  const router = useRouter();
  const selectedChapterStr = decodeURI(params.chapter);
  const selectedTopicStr = decodeURI(params.topic);

  const { status, data, error } = useQuery({
    queryKey: ["content", selectedChapterStr, selectedTopicStr],
    queryFn: () => fetchContent(selectedChapterStr, selectedTopicStr),
  });

  const [contents, setContents] = useState<Content[]>([
    { japanese: "Loading...", english: "Loading..." },
  ]);
  // Checkmark/X-mark related states
  const [checkOrXPos1, setCheckOrX1Pos] = useState({ x: 100, y: 100 });
  const [checkOrXPos2, setCheckOrX2Pos] = useState({ x: 100, y: 100 });
  const [animationClass, setAnimationClass] = useState("");
  const [checkOrXSymbol, setCheckOrXSymbol] = useState(symbolOptions.xMark);
  const [firstOptionChosenInfo, setFirstOptionChosenInfo]= useState<null|ChosenOption>(null);
  // TODO: remove
  const [focus, setFocus] = useState(false);

  // Shuffles and updates the contents based on the result of the react query
  useEffect(() => {
    setShuffledContents();
  }, [data]);

  // Shuffles and updates the contents based on the result of the react query
  const setShuffledContents = () => {
    if (error) {
      console.error(error);
      alert("Error retrieving contents, returning to home page");
      router.push("/");
    }
    if (data) {
      const shuffledContents = shuffleArray(data);
      setContents(shuffledContents);
    }
  };

  // Shuffles the given array
  const shuffleArray = (array: any[]): any[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Callback function passed to MatchOption components, handles logic for the first and second component that is clicked to see if they match
  const handleClick = (e:React.MouseEvent) => {
    setFocus(!focus)

    if (!firstOptionChosenInfo) {
      setFirstOptionChosenInfo({x: e.pageX, y: e.pageY, text: "TODO"})
    }
    else {
      setCheckOrX1Pos({
        x: firstOptionChosenInfo.x - IMAGE_SIZE / 2,
        y: firstOptionChosenInfo.y - IMAGE_SIZE / 2,
      });
      setCheckOrX2Pos({
        x: e.pageX - IMAGE_SIZE / 2,
        y: e.pageY - IMAGE_SIZE / 2,
      });
  
      // remove, then add class to reset fading up animation
      setAnimationClass("");
      setTimeout(() => {
        setAnimationClass(styles.fadeUp);
      }, 1);

      setFirstOptionChosenInfo(null);
    }
  }

  return (<>
    <div className="main-center">
      <h1 className="text-5xl font-semibold">
        {selectedChapterStr} {selectedTopicStr} Term Matching
      </h1>
      <div>
        <MatchOption content={contents[0]} attr="english" focused={focus} handleClick={handleClick}></MatchOption>
        <MatchOption content={contents[0]} attr="english" focused={focus} handleClick={handleClick}></MatchOption>
        <MatchOption content={contents[0]} attr="english" focused={focus} handleClick={handleClick}></MatchOption>
        <MatchOption content={contents[0]} attr="english" focused={focus} handleClick={handleClick}></MatchOption>
      </div>
    </div>
    <div
      className={`${animationClass} absolute pointer-events-none`}
      style={{ left: checkOrXPos1.x, top: checkOrXPos1.y, opacity: 0 }}
    >
      <CheckOrX symbol={checkOrXSymbol} />
    </div>
    <div
      className={`${animationClass} absolute pointer-events-none`}
      style={{ left: checkOrXPos2.x, top: checkOrXPos2.y, opacity: 0 }}
    >
      <CheckOrX symbol={checkOrXSymbol} />
    </div>
  </>);
}

export default MatchingActivity;