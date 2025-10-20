import React, { FC, ReactNode } from "react";
import clsx from "clsx";
import { DraggableWindow, DraggableWindowPosition } from "../draggable-window";

//Main card: close, info, width, height en resize regelen
//Header: Headertext, kleur
//Body: main achtergrond, en of content is in 2 columen, hoe de columns verdeeld moeten zijn
//Column: houd columnen bij elkaar (Allen bij 2 columnen is dit nodig)
//SubHeader: width, height en kleur van de sub header
//Content: de inhoud van de card

// Main component
interface CardProps {
	variant?: "primary";
	uniqueKey?: string;
	cardPosition?: string;
	minWidth?: number;
	width?: number;
	maxWidth?: number;
	minHeight?: number;
	height?: number;
	maxHeight?: number;
	disableDrag?: boolean;
	onReport?: () => void;
	onInfo?: () => void;
	onClose?: () => void;
	resize?: "both" | "height" | "width" | "disabled";
	children: ReactNode;
}

const CardBase: FC<CardProps> = ({
	variant = "primary",
	uniqueKey = null,
	cardPosition = DraggableWindowPosition.CENTER,
	disableDrag = false,
	minWidth,
	width,
	maxWidth,
	minHeight,
	height,
	maxHeight,
	onReport,
	onInfo,
	onClose,
	resize = "both",
	children,
}) => {
	const base = "starbo-card";
	const variants = {
		primary: "primary",
	};
	const style: React.CSSProperties = {
		width: `${width}px`,
		height: `${height}px`,
		resize: resize === "disabled" ? "none" : "both",
	};

	// Width rules
	if (resize === "both" || resize === "width") {
		style.minWidth = `${minWidth ?? width}px`;
		if (maxWidth != null) style.maxWidth = `${maxWidth}px`;
	}

	// Height rules
	if (resize === "both" || resize === "height") {
		style.minHeight = `${minHeight ?? height}px`;
		style.maxHeight = maxHeight != null ? `${maxHeight}px` : undefined;
	}

	// Special case: resize="width" -> hoogte vastzetten
	if (resize === "width") {
		style.minHeight = `${height}px`;
		style.maxHeight = `${height}px`;
	}

	// Special case: resize="height" -> breedte vastzetten
	if (resize === "height") {
		style.minWidth = `${width}px`;
		style.maxWidth = `${width}px`;
	}

	//clone children and pass down the actions to the header
	const enhancedChildren = React.Children.map(children, (child) => {
		if (React.isValidElement(child) && child.type === CardHeader) {
			return React.cloneElement(child, { onReport, onClose, onInfo });
		}
		return child;
	});

	return (
		<DraggableWindow
			uniqueKey={uniqueKey}
			handleSelector=".drag-handler"
			windowPosition={cardPosition}
			disableDrag={disableDrag}
		>
			<div
				className={clsx(base, variants[variant], uniqueKey)}
				style={style}
			>
				{enhancedChildren}
			</div>
		</DraggableWindow>
	);
};

// Sub components
const CardHeader: FC<{
	color?: string;
	children: ReactNode;
	onReport?;
	onInfo?;
	onClose?;
}> = ({ color = "primary", children, onInfo, onClose, onReport }) => {
	const colors = {
		primary: "color-primary",
	};
	return (
		<div className={clsx("header drag-handler", colors[color])}>
			<h2>{children}</h2>
			<div className="actions">
				{onInfo && <button onClick={onInfo} className="info"></button>}
				{onReport && (
					<button onClick={onReport} className="report"></button>
				)}
				{onClose && (
					<button onClick={onClose} className="close"></button>
				)}
			</div>
		</div>
	);
};

const CardBody: FC<{ children: ReactNode; columns?: boolean }> = ({
	children,
	columns,
}) => <div className={clsx(columns && "columns", "body")}>{children}</div>;

const CardColumn: FC<{
	children: ReactNode;
	width?: number;
	side: "left" | "right";
}> = ({ children, width, side }) => (
	<div style={width && { width: `${width}px` }} className={side}>
		{children}
	</div>
);

const CardSubheader: FC<{
	children?: ReactNode;
	width?: number | "full";
	height: number;
	color:
		| `rgb(${string}, ${string}, ${string})`
		| `rgba(${string}, ${string}, ${string}, ${string})`;
}> = ({ children, width = "full", height, color }) => {
	const style: React.CSSProperties = {
		width: width === "full" ? "calc(100% + 4px)" : `${width}px`,
		height: `${height}px`,
		backgroundColor: color,
	};
	return (
		<div style={style} className="sub-header">
			{children}
		</div>
	);
};

const CardTabs: FC<{ children: ReactNode }> = ({ children }) => (
	<div className="tabs">{children}</div>
);

const CardTab: FC<{
	children: ReactNode;
	isActive?: boolean;
	onClick: () => void;
}> = ({ children, isActive = false, onClick }) => (
	<div onClick={onClick} className={clsx(isActive && "active", "tab")}>
		<div className="inner">{children}</div>
	</div>
);

const CardContent: FC<{ children: ReactNode }> = ({ children }) => (
	<div className="content">{children}</div>
);

// Export
export const StarboCard = Object.assign(CardBase, {
	Header: CardHeader,
	Body: CardBody,
	Column: CardColumn,
	Subheader: CardSubheader,
	Tabs: CardTabs,
	Tab: CardTab,
	Content: CardContent,
});
