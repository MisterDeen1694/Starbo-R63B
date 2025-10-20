import { AchievementData } from "@nitrots/nitro-renderer";
import { FC } from "react";
import { LayoutItemCountView } from "../../../../common";
import { useAchievements } from "../../../../hooks";
import { AchievementBadgeView } from "../AchievementBadgeView";
import clsx from "clsx";

interface AchievementListItemViewProps {
	achievement: AchievementData;
}

export const AchievementListItemView: FC<AchievementListItemViewProps> = (
	props
) => {
	const { achievement = null } = props;
	const { selectedAchievement = null, setSelectedAchievementId = null } =
		useAchievements();

	if (!achievement) return null;

	return (
		<button
			onClick={() => setSelectedAchievementId(achievement.achievementId)}
			className={clsx(
				"achievement",
				achievement.unseen > 0 && "new",
				selectedAchievement === achievement && "active"
			)}
		>
			{achievement.unseen > 0 && (
				<LayoutItemCountView count={achievement.unseen} />
			)}
			<AchievementBadgeView achievement={achievement} />
		</button>
	);
};
