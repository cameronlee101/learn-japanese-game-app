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
import ProgressIndicator from "@/components/general/ProgressIndicator";
import { getText } from "@/components/match-option/MatchOption-utils";

type ChosenOption = {
	x: number;
	y: number;
	indexAndSide: IndexAndSide;
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
	const [curContentIndexRange, setCurContentIndexRange] = useState({
		first: 0,
		last: -1,
	});
	const [rangeArray, setRangeArray] = useState<IndexAndSide[]>([]);
	const [completedIndices, setCompletedIndices] = useState<number[]>([]);
	const [playingGame, setPlayingGame] = useState(true);

	const [wrongAnswersIndices, setWrongAnswersIndices] = useState<number[]>([]);

	const [firstOptionChosenInfo, setFirstOptionChosenInfo] =
		useState<null | ChosenOption>(null);

	// Resets all the states (effectively resetting the game)
	const resetStates = () => {
		setCurContentIndexRange({
			first: 0,
			last: -1,
		});
		setWrongAnswersIndices([]);
		setCompletedIndices([]);
		setPlayingGame(true);
	};

	// Shuffles and updates the contents based on the result of the react query
	useEffect(() => {
		setShuffledContents();
	}, [data]);

	// When the game contents change (ie. when it's fetched on page load), updates the initial first and last indices for the cards to be matched
	useEffect(() => {
		getNextContentIndices();
	}, [contents]);

	// Once the user matches all of the options currently displayed, moves to the next set of options after the animations finish
	useEffect(() => {
		if (
			completedIndices.length % NUM_OF_PAIRS == 0 ||
			completedIndices.length == contents.length
		) {
			setTimeout(() => {
				getNextContentIndices();
			}, 1000);
		}
	}, [completedIndices]);

	// TODO: desc
	useEffect(() => {
		const array: IndexAndSide[] = [];

		for (
			let i = curContentIndexRange.first;
			i <= curContentIndexRange.last;
			i++
		) {
			array.push({ index: i, side: "front" });
			array.push({ index: i, side: "back" });
		}

		setRangeArray(shuffleArray(array));
	}, [curContentIndexRange]);

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
			if (contents.length == curContentIndexRange.last + 1) {
				setPlayingGame(false);
			} else if (
				contents.length <
				curContentIndexRange.last + NUM_OF_PAIRS + 1
			) {
				setCurContentIndexRange({
					first: curContentIndexRange.last + 1,
					last: contents.length - 1,
				});
			} else {
				setCurContentIndexRange({
					first: curContentIndexRange.last + 1,
					last: curContentIndexRange.last + NUM_OF_PAIRS,
				});
			}
		}
	};

	// Callback function passed to MatchOption components, handles logic for the first and second component that is clicked to see if they match
	const handleClick = (
		e: React.MouseEvent,
		indexAndSide: IndexAndSide,
		wasCompleted: boolean
	) => {
		// if this option was already matched with it's counterpart, do nothing
		if (wasCompleted) return;

		// case: first option hasn't been selected yet
		if (!firstOptionChosenInfo) {
			setFirstOptionChosenInfo({
				x: e.pageX,
				y: e.pageY,
				indexAndSide: indexAndSide,
			});

			// case: first option has been chosen; checking if second option chosen is different to the first option chosen, in which case performs logic to see if the two options match
			// otherwise, just cancels the first chosen option
		} else {
			if (
				!(
					firstOptionChosenInfo.indexAndSide.index == indexAndSide.index &&
					firstOptionChosenInfo.indexAndSide.side == indexAndSide.side
				)
			) {
				setCheckOrX1Pos({
					x: firstOptionChosenInfo.x - IMAGE_SIZE / 2,
					y: firstOptionChosenInfo.y - IMAGE_SIZE / 2,
				});
				setCheckOrX2Pos({
					x: e.pageX - IMAGE_SIZE / 2,
					y: e.pageY - IMAGE_SIZE / 2,
				});

				// checking if both the options match
				if (firstOptionChosenInfo.indexAndSide.index == indexAndSide.index) {
					setCompletedIndices([...completedIndices, indexAndSide.index]);
					setCheckOrXSymbol(symbolOptions.checkMark);
				} else {
					setCheckOrXSymbol(symbolOptions.xMark);

					if (
						!wrongAnswersIndices.find((index) => {
							return indexAndSide.index == index;
						})
					) {
						setWrongAnswersIndices([
							...wrongAnswersIndices,
							indexAndSide.index,
						]);
					}
				}

				// remove then add class in 1ms to reset fading up animation
				setAnimationClass("");
				setTimeout(() => {
					setAnimationClass(styles.fadeUp);
				}, 1);
			}

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
						index={curIndexAndSide.index}
						focused={
							firstOptionChosenInfo &&
							firstOptionChosenInfo.indexAndSide.index ==
								curIndexAndSide.index &&
							firstOptionChosenInfo.indexAndSide.side == curIndexAndSide.side
								? true
								: false
						}
						completed={
							completedIndices.find((index) => curIndexAndSide.index == index)
								? true
								: false
						}
						handleClick={handleClick}
					/>
				))}
			</>
		);
	};

	return (
		<main className="main-center">
			<h1 className="text-5xl font-semibold">
				{selectedChapterStr} {selectedTopicStr} Term Matching
			</h1>
			{playingGame && (
				<>
					<div className="grid grid-cols-4 gap-2">{distributeCards()}</div>
					<div
						className={classNames(
							animationClass,
							"absolute pointer-events-none"
						)}
						style={{ left: checkOrXPos1.x, top: checkOrXPos1.y, opacity: 0 }}
					>
						<CheckOrX symbol={checkOrXSymbol} />
					</div>
					<div
						className={classNames(
							animationClass,
							"absolute pointer-events-none"
						)}
						style={{ left: checkOrXPos2.x, top: checkOrXPos2.y, opacity: 0 }}
					>
						<CheckOrX symbol={checkOrXSymbol} />
					</div>
					<ProgressIndicator
						firstTimeCorrect={contents.length - wrongAnswersIndices.length}
						completed={completedIndices.length}
						total={contents.length}
					/>
				</>
			)}
			{!playingGame && (
				<>
					<p className="text-xl mt-8">
						Game Over! <br />
						Total First Guess Correct Answers:{" "}
						{contents.length - wrongAnswersIndices.length}/{contents.length}
					</p>
					<div className="mt-8">
						{wrongAnswersIndices.length == 0 ? (
							<>
								<p className="text-xl">
									Congratulations! You got all questions perfect!
								</p>
							</>
						) : (
							<>
								<p className="text-xl mb-4">
									Here is the list of questions you got incorrect on the first
									guess:
								</p>
								<div className="overflow-x-auto w-full">
									<table className="table table-striped-columns table-hover table-bordered table-sm">
										<thead>
											<tr>
												<th className="w-1/2">Question</th>
												<th className="w-1/2">Answer</th>
											</tr>
										</thead>
										<tbody className="table-group-divider">
											{wrongAnswersIndices.map((index) => (
												<tr key={index}>
													<td>{getText(contents[index], "front")}</td>
													<td>{getText(contents[index], "back")}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</>
						)}
						<button
							className="bg-slate-500 hover:bg-slate-700 text-white text-xl font-bold py-1 px-8 rounded-full mt-20"
							onMouseUp={() => {
								resetStates();
								setShuffledContents();
							}}
						>
							Play Again
						</button>
					</div>
				</>
			)}
		</main>
	);
}

export default MatchingActivity;
