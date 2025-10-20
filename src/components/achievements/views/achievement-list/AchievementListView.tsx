import { AchievementData } from "@nitrots/nitro-renderer";
import { FC } from "react";
import { AchievementListItemView } from "./AchievementListItemView";
import clsx from "clsx";

interface AchievementListViewProps {
	achievements: AchievementData[];
}

export const AchievementListView: FC<AchievementListViewProps> = (props) => {
	const { achievements = null } = props;

	return (
		<div
			className={clsx(
				"achievements",
				achievements.length > 20 && "reduce-columns"
			)}
		>
			{achievements &&
				achievements.length > 0 &&
				achievements.map((achievement, index) => (
					<AchievementListItemView
						key={index}
						achievement={achievement}
					/>
				))}
		</div>
	);
};
