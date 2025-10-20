import { AchievementData } from "@nitrots/nitro-renderer";
import { FC } from "react";
import { AchievementUtilities, GetConfiguration } from "../../../api";
import clsx from "clsx";
interface AchievementBadgeViewProps {
	achievement: AchievementData;
}

export const AchievementBadgeView: FC<AchievementBadgeViewProps> = (props) => {
	const { achievement = null } = props;

	if (!achievement) return null;

	return (
		<img
			draggable="false"
			className={clsx(
				"image",
				!AchievementUtilities.getAchievementHasStarted(achievement) &&
					"incomplete"
			)}
			src={GetConfiguration<string>("badge.asset.url").replace(
				"%badgename%",
				achievement.badgeId.toString()
			)}
		/>
	);
};
