import Image from "next/image";
import React, { useEffect, useState } from "react";
import checkmark from "@/public/checkmark.png";
import xmark from "@/public/xmark.png";

export enum symbolOptions {
	checkMark,
	xMark,
}

export const IMAGE_SIZE = 64;

const CheckOrX = (props: { symbol: symbolOptions }) => {
	const { symbol } = props;

	const [image, setImage] = useState(xmark);

	useEffect(() => {
		switch (symbol) {
			case symbolOptions.checkMark:
				setImage(checkmark);
				break;
			case symbolOptions.xMark:
				setImage(xmark);
				break;
			default:
				console.error("Error: could not set CheckOrX component image");
		}
	}, [symbol, image]);

	return (
		<div className="w-16 h-auto" data-test="check-or-x">
			<Image src={image} alt="correctness symbol" width={64} height={64} />
		</div>
	);
};

export default CheckOrX;
