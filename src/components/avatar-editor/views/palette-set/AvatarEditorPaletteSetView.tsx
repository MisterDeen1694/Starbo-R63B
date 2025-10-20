import { HabboClubLevelEnum } from "@nitrots/nitro-renderer";
import { FC, useCallback, useEffect, useRef } from "react";
import {
	AvatarEditorGridColorItem,
	CategoryData,
	CreateLinkEvent,
	GetSessionDataManager,
	IAvatarEditorCategoryModel,
} from "../../../../api";
import { AvatarEditorPaletteSetItem } from "./AvatarEditorPaletteSetItemView";

export interface AvatarEditorPaletteSetViewProps {
	model: IAvatarEditorCategoryModel;
	category: CategoryData;
	paletteSet: AvatarEditorGridColorItem[];
	paletteIndex: number;
}

export const AvatarEditorPaletteSetView: FC<AvatarEditorPaletteSetViewProps> = (
	props
) => {
	const {
		model = null,
		category = null,
		paletteSet = [],
		paletteIndex = -1,
	} = props;
	const elementRef = useRef<HTMLDivElement>(null);

	const selectColor = useCallback(
		(item: AvatarEditorGridColorItem) => {
			const index = paletteSet.indexOf(item);

			if (index === -1) return;

			if (
				item.isHC &&
				GetSessionDataManager().clubLevel === HabboClubLevelEnum.NO_CLUB
			)
				return CreateLinkEvent("habboUI/open/hccenter");

			model.selectColor(category.name, index, paletteIndex);
		},
		[model, category, paletteSet, paletteIndex]
	);

	useEffect(() => {
		if (!model || !category || !elementRef || !elementRef.current) return;

		elementRef.current.scrollTop = 0;
	}, [model, category]);

	return (
		<div className="picker" ref={elementRef}>
			{paletteSet.length > 0 &&
				paletteSet.map((item, index) => (
					<AvatarEditorPaletteSetItem
						key={index}
						colorItem={item}
						onClick={() => selectColor(item)}
					/>
				))}
		</div>
	);
};
