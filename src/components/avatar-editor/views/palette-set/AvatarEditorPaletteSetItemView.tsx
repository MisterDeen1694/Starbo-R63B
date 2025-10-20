import { FC, useEffect, useState } from "react";
import { AvatarEditorGridColorItem, GetConfiguration } from "../../../../api";
import clsx from "clsx";

export interface AvatarEditorPaletteSetItemProps {
	colorItem: AvatarEditorGridColorItem;
	onClick: () => void;
}

export const AvatarEditorPaletteSetItem: FC<AvatarEditorPaletteSetItemProps> = (
	props
) => {
	const { colorItem = null, onClick } = props;
	const [updateId, setUpdateId] = useState(-1);

	const hcDisabled = GetConfiguration<boolean>("hc.disabled", false);

	useEffect(() => {
		const rerender = () => setUpdateId((prevValue) => prevValue + 1);

		colorItem.notify = rerender;

		return () => (colorItem.notify = null);
	}, [colorItem]);
	return (
		<button
			className={clsx(
				"color",
				!hcDisabled && colorItem.isHC && "starbo-club",
				colorItem.isSelected && "selected"
			)}
			onClick={onClick}
			style={{ backgroundColor: colorItem.color }}
		/>
	);
};
