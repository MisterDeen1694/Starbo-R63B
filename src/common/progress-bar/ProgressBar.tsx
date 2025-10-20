import { FC } from "react";

interface LayoutProgressBarProps {
	label?: string;
	progress: number;
	maxProgress?: number;
}

export const ProgressBar: FC<LayoutProgressBarProps> = (props) => {
	const { label = "", progress = 0, maxProgress = 100 } = props;

	return (
		<div className="progress-bar">
			<div className="track">
				{label && <div className="label">{label}</div>}
				<div
					className="indicator"
					style={{
						width:
							~~(
								((progress - 0) * (100 - 0)) /
									(maxProgress - 0) +
								0
							) + "%",
					}}
				></div>
			</div>
		</div>
		// <Column
		// 	position={position}
		// 	justifyContent={justifyContent}
		// 	classNames={getClassNames}
		// 	{...rest}
		// >
		// 	{text && text.length > 0 && (
		// 		<Flex
		// 			fit
		// 			center
		// 			position="absolute"
		// 			className="nitro-progress-bar-text small"
		// 		>
		// 			{text}
		// 		</Flex>
		// 	)}
		// 	<Base
		// 		className="nitro-progress-bar-inner"
		// 		style={{
		// 			width:
		// 				~~(
		// 					((progress - 0) * (100 - 0)) / (maxProgress - 0) +
		// 					0
		// 				) + "%",
		// 		}}
		// 	/>
		// 	{children}
		// </Column>
	);
};
