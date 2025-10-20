import { Dispatch, FC, SetStateAction } from "react";
import {
	AchievementUtilities,
	IAchievementCategory,
	LocalizeText,
} from "../../../../api";
import { LayoutItemCountView } from "../../../../common";

interface AchievementCategoryListItemViewProps {
	category: IAchievementCategory;
	setSelectedCategoryCode: Dispatch<SetStateAction<string>>;
}

export const AchievementsCategoryListItemView: FC<
	AchievementCategoryListItemViewProps
> = (props) => {
	const { category = null, setSelectedCategoryCode = null } = props;

	if (!category) return null;

	const progress =
		AchievementUtilities.getAchievementCategoryProgress(category);
	const maxProgress =
		AchievementUtilities.getAchievementCategoryMaxProgress(category);
	const getCategoryImage =
		AchievementUtilities.getAchievementCategoryImageUrl(category, progress);
	const getTotalUnseen =
		AchievementUtilities.getAchievementCategoryTotalUnseen(category);

	return (
		<button
			className="category"
			onClick={() => setSelectedCategoryCode(category.code)}
		>
			{getTotalUnseen > 0 && (
				<LayoutItemCountView
					count={getTotalUnseen}
					style={{ top: "27px", right: "22px" }}
				/>
			)}
			<h3 className="title">
				{LocalizeText(`quests.${category.code}.name`)}
			</h3>
			<div
				className="image"
				style={{ backgroundImage: `url(${getCategoryImage})` }}
			>
				<span className="progress">{progress + "/" + maxProgress}</span>
			</div>
		</button>
	);
};
