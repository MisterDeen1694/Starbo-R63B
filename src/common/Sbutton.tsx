import { CSSProperties, FC, useMemo } from "react";
import { Flex, FlexProps } from "./Flex";

export interface SbuttonProps extends FlexProps {
	variant?: "white";
	width?: number;
	height?: number;
	active?: boolean;
	disabled?: boolean;
}

export const Sbutton: FC<SbuttonProps> = (props) => {
	const {
		variant = "white",
		width = null,
		height = null,
		active = false,
		disabled = false,
		classNames = [],
		style = {},
		...rest
	} = props;

	const getClassNames = useMemo(() => {
		const newClassNames: string[] = ["starbo-button"];

		if (variant) newClassNames.push(variant);
		if (active) newClassNames.push("active");
		if (disabled) newClassNames.push("disabled");
		if (classNames.length) newClassNames.push(...classNames);

		return newClassNames;
	}, [variant, active, disabled, classNames]);

	const getStyle = useMemo(() => {
		let newStyle: CSSProperties = {};
		if (width) newStyle["--button-width"] = width + "px";
		if (height) newStyle["--button-height"] = height + "px";

		if (Object.keys(style).length) newStyle = { ...newStyle, ...style };

		return newStyle;
	}, [height, width, style]);

	return (
		<Flex center classNames={getClassNames} style={getStyle} {...rest} />
	);
};
