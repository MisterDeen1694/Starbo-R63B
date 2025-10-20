import { Dispatch, FC, SetStateAction } from "react";
import { IAchievementCategory } from "../../../../api";
import { AchievementsCategoryListItemView } from "./AchievementsCategoryListItemView";

interface AchievementsCategoryListViewProps {
	categories: IAchievementCategory[];
	setSelectedCategoryCode: Dispatch<SetStateAction<string>>;
}

export const AchievementsCategoryListView: FC<
	AchievementsCategoryListViewProps
> = (props) => {
	const { categories = null, setSelectedCategoryCode = null } = props;

	return (
		<div className="categories">
			{categories &&
				categories.length > 0 &&
				categories.map((category, index) => (
					<AchievementsCategoryListItemView
						key={index}
						category={category}
						setSelectedCategoryCode={setSelectedCategoryCode}
					/>
				))}
		</div>
	);
};
