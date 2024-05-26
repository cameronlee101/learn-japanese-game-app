"use client";
import CheckOrX, {
	IMAGE_SIZE,
	symbolOptions,
} from "@/components/check-or-x/CheckOrX";
import MatchOption from "@/components/match-option/MatchOption";
import { fetchContent } from "@/utils/helper-fns";
import { Content, IndexAndSide } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./matching.module.css";
import classNames from "classnames";

type ChosenOption = {
	x: number;
	y: number;
	text: string;
};

const NUM_OF_PAIRS = 6;

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

	// Game logic related states
	const [curContentIndices, setCurContentIndices] = useState({
		first: 0,
		last: 0,
	});
	const [rangeArray, setRangeArray] = useState<IndexAndSide[]>([]);

	const [firstOptionChosenInfo, setFirstOptionChosenInfo] =
		useState<null | ChosenOption>(null);
	// TODO: remove
	const [focus, setFocus] = useState(false);

	// Shuffles and updates the contents based on the result of the react query
	useEffect(() => {
		setShuffledContents();
	}, [data]);

	// When the game contents change (ie. when it's fetched on page load), updates the initial first and last indices for the cards to be matched
	useEffect(() => {
		getNextContentIndices();
	}, [contents]);

	// TODO: desc
	useEffect(() => {
		const { first, last } = curContentIndices;

		console.log(curContentIndices);

		const array: IndexAndSide[] = [];

		for (let i = first; i <= last; i++) {
			array.push({ index: i, side: "front" });
			array.push({ index: i, side: "back" });
		}

		console.log(array);

		setRangeArray(shuffleArray(array));
	}, [curContentIndices]);

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

	// TODO: desc
	const getNextContentIndices = (): void => {
		if (contents.length != 1) {
			if (contents.length == curContentIndices.last + 1) {
				// TODO
				console.error("end game");
			} else if (contents.length < curContentIndices.last + NUM_OF_PAIRS + 1) {
				setCurContentIndices({
					first: curContentIndices.last + 1,
					last: contents.length - 1,
				});
			} else {
				setCurContentIndices({
					first: curContentIndices.last + 1,
					last: curContentIndices.last + NUM_OF_PAIRS,
				});
			}
		}
	};

	// Callback function passed to MatchOption components, handles logic for the first and second component that is clicked to see if they match
	const handleClick = (e: React.MouseEvent, cardText: string) => {
		setFocus(!focus);

		if (!firstOptionChosenInfo) {
			setFirstOptionChosenInfo({ x: e.pageX, y: e.pageY, text: cardText });
		} else {
			setCheckOrX1Pos({
				x: firstOptionChosenInfo.x - IMAGE_SIZE / 2,
				y: firstOptionChosenInfo.y - IMAGE_SIZE / 2,
			});
			setCheckOrX2Pos({
				x: e.pageX - IMAGE_SIZE / 2,
				y: e.pageY - IMAGE_SIZE / 2,
			});

			// remove then add class to reset fading up animation
			setAnimationClass("");
			setTimeout(() => {
				setAnimationClass(styles.fadeUp);
			}, 1);

			setFirstOptionChosenInfo(null);
		}
	};

	// TODO: desc
	const distributeCards = (): JSX.Element => {
		return (
			<>
				{rangeArray.map((curIndexAndSide: IndexAndSide) => (
					<MatchOption
						content={contents[curIndexAndSide.index]}
						key={curIndexAndSide.index + "_" + curIndexAndSide.side}
						side={curIndexAndSide.side}
						focused={focus}
						completed={false}
						handleClick={handleClick}
					/>
				))}
			</>
		);
	};

	return (
		<>
			<div className="main-center">
				<h1 className="text-5xl font-semibold">
					{selectedChapterStr} {selectedTopicStr} Term Matching
				</h1>
				<div className="grid grid-cols-4 gap-2">{distributeCards()}</div>
			</div>
			<div
				className={classNames(animationClass, "absolute pointer-events-none")}
				style={{ left: checkOrXPos1.x, top: checkOrXPos1.y, opacity: 0 }}
			>
				<CheckOrX symbol={checkOrXSymbol} />
			</div>
			<div
				className={classNames(animationClass, "absolute pointer-events-none")}
				style={{ left: checkOrXPos2.x, top: checkOrXPos2.y, opacity: 0 }}
			>
				<CheckOrX symbol={checkOrXSymbol} />
			</div>
		</>
	);
}

export default MatchingActivity;
