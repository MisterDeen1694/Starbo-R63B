import clsx from "clsx";
import { CSSProperties, FC, ReactNode, useMemo } from "react";

export interface ButtonProps {
	variant?: "primary";
	width?: "full" | "auto" | number;
	height?: "small" | "medium" | "large" | number;
	outline?: boolean;
	disabled?: boolean;
	children?: ReactNode;
	onClick?: (any: any | null) => void;
}

export const Button: FC<ButtonProps> = ({
	children,
	variant = "primary",
	width = "auto",
	height = "medium",
	outline = false,
	disabled = false,
	...rest
}) => {
	const style: React.CSSProperties = {
		width: typeof width === "number" && `${width}px`,
		height: typeof height === "number" && `${width}px`,
	};
	return (
		<button
			{...rest}
			disabled={disabled}
			className={clsx(
				"starbo-button",
				variant,
				typeof width !== "number" && "w-" + width,
				typeof height !== "number" && "h-" + height,
				outline && "outline"
			)}
			style={style}
		>
			{children}
		</button>
	);
};

// export const Button: FC<ButtonProps & HTMLButtonElement> = (
// 	children,
// 	props
// ) => {
// 	const {
// 		variant = "primary",
// 		width = "auto",
// 		height = "medium",
// 		disabled = false,
// 		outline = false,
// 		...rest
// 	} = props;

// 	/*
// 	const getClassNames = useMemo(() => {
// 		const newClassNames: string[] = ["starbo-button"];

// 		if (variant) newClassNames.push(variant);
// 		if (active) newClassNames.push("active");
// 		if (disabled) newClassNames.push("disabled");
// 		if (classNames.length) newClassNames.push(...classNames);

// 		return newClassNames;
// 	}, [variant, active, disabled, classNames]);

// 	const getStyle = useMemo(() => {
// 		let newStyle: CSSProperties = {};
// 		if (width) newStyle["--button-width"] = width + "px";
// 		if (height) newStyle["--button-height"] = height + "px";

// 		if (Object.keys(style).length) newStyle = { ...newStyle, ...style };

// 		return newStyle;
// 	}, [height, width, style]);
// */
// 	return <button {...rest}>{children}</button>;
// };
