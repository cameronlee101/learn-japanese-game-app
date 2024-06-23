import React, { useEffect, useRef } from "react";
import styles from "./MatchOption.module.css";
import { Content, IndexAndSide, Side } from "@/utils/types";
import classNames from "classnames";
import { getText } from "./MatchOption-utils";

type MatchOptionProps = {
	content: Content;
	side: Side;
	index: number;
	focused: boolean;
	completed: boolean;
	handleClick: (
		e: React.MouseEvent,
		indexAndSide: IndexAndSide,
		wasCompleted: boolean
	) => void;
};

const MatchOption = ({
	content,
	side,
	index,
	focused,
	completed,
	handleClick,
}: MatchOptionProps) => {
	const matchOptionRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let curRef = matchOptionRef.current;
		if (curRef) {
			const hasOverflow = curRef.scrollHeight > curRef.clientHeight;
			curRef.style.justifyContent = hasOverflow ? "start" : "center";
		}
	}, [content]);

	return (
		<div
			className={classNames(
				styles.matchOption,
				focused && styles.focused,
				completed && styles.completed,
				!completed && "cursor-pointer"
			)}
			ref={matchOptionRef}
			data-test="matchOption"
			onMouseUp={(e) => {
				handleClick(e, { index: index, side: side }, completed);
			}}
		>
			{getText(content, side)}
		</div>
	);
};

export default MatchOption;
