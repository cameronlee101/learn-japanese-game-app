import React from "react";

type ProgressIndicatorProps = {
	firstTimeCorrect: number;
	completed: number;
	total: number;
};

const ProgressIndicator = ({
	firstTimeCorrect,
	completed,
	total,
}: ProgressIndicatorProps) => {
	return (
		<div className="flex flex-col mt-10 items-center justify-center">
			<p
				className="mx-4 min-w-[10rem] text-2xl"
				data-test="correct-answers-indicator"
			>
				First Guess Correct Answers: {firstTimeCorrect}
			</p>
			<p className="mx-4 min-w-[10rem] text-2xl" data-test="progress-indicator">
				Progress: {completed}/{total}
			</p>
		</div>
	);
};

export default ProgressIndicator;
