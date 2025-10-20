import { FC, useEffect, useState } from "react";
import { AvatarEditorGridPartItem, GetConfiguration } from "../../../../api";
import { LayoutGridItemProps } from "../../../../common";
import clsx from "clsx";
export interface AvatarEditorFigureSetItemViewProps
	extends LayoutGridItemProps {
	partItem: AvatarEditorGridPartItem;
	onClick: () => void;
}

export const AvatarEditorFigureSetItemView: FC<
	AvatarEditorFigureSetItemViewProps
> = (props) => {
	const { partItem = null, children = null, onClick, ...rest } = props;
	const [updateId, setUpdateId] = useState(-1);
	const hcDisabled = GetConfiguration<boolean>("hc.disabled", false);

	useEffect(() => {
		const rerender = () => setUpdateId((prevValue) => prevValue + 1);

		partItem.notify = rerender;

		return () => (partItem.notify = null);
	}, [partItem]);

	return (
		<div
			className={clsx(
				"item",
				partItem.isSelected && "selected",
				!hcDisabled && partItem.isHC && "starbo-club"
			)}
			id={clsx(partItem.id)}
			onClick={onClick}
		>
			{partItem.isClear && <div className="remove"></div>}
			{!partItem.isClear && <img src={partItem.imageUrl} />}
		</div>
	);
};
