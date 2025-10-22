import clsx from "clsx";
import { CSSProperties, FC, ReactNode, useMemo } from "react";

export interface ButtonProps {
	variant?: "primary";
	color?: "primary" | "secondary" | "tertiary" | "quaternary" | "quinary";
	width?: "full" | "auto" | number;
	height?: "small" | "medium" | "large" | number;
	shadow?: boolean;
	outline?: boolean;
	disabled?: boolean;
	title?: string;
	children?: ReactNode;

	onClick?: (any: any | null) => void;
}

export const Button: FC<ButtonProps> = ({
	children,
	variant = "primary",
	color = "primary",
	width = "auto",
	height = "medium",
	shadow = false,
	outline = false,
	disabled = false,
	title = null,
	...rest
}) => {
	const style: React.CSSProperties = {
		width: typeof width === "number" && `${width}px`,
		height: typeof height === "number" && `${height}px`,
	};
	return (
		<button
			{...rest}
			title={title}
			disabled={disabled}
			className={clsx(
				"starbo-button",
				variant,
				"color-" + color,
				typeof width !== "number" && "w-" + width,
				typeof height !== "number" && "h-" + height,
				shadow && "shadow",
				outline && "outline"
			)}
			style={style}
		>
			{children}
		</button>
	);
};
