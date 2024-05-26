import React, { useEffect, useRef } from "react";
import styles from "./MatchOption.module.css";
import { Content, Side } from "@/utils/types";
import classNames from "classnames";
import { getText } from "./MatchOption-utils";

type MatchOptionProps = {
	content: Content;
	side: Side;
	focused: boolean;
	completed: boolean;
	handleClick: (e: React.MouseEvent, cardText: string) => void;
};

const MatchOption = ({
	content,
	side,
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
				completed && styles.completed
			)}
			ref={matchOptionRef}
			data-test="matchOption"
			onMouseUp={(e) => {
				handleClick(e, getText(content, side));
			}}
		>
			{getText(content, side)}
		</div>
	);
};

export default MatchOption;
