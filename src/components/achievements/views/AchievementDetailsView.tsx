import { AchievementData } from "@nitrots/nitro-renderer";
import { FC } from "react";
import {
	AchievementUtilities,
	LocalizeBadgeDescription,
	LocalizeBadgeName,
	LocalizeText,
} from "../../../api";
import { ProgressBar } from "../../../common";
import { AchievementBadgeView } from "./AchievementBadgeView";

interface AchievementDetailsViewProps {
	achievement: AchievementData;
}

export const AchievementDetailsView: FC<AchievementDetailsViewProps> = (
	props
) => {
	const { achievement = null } = props;

	if (!achievement) return null;

	return (
		<div className="details">
			<div className="left">
				<AchievementBadgeView achievement={achievement} />
				<p className="level">
					{LocalizeText(
						"achievements.details.level",
						["level", "limit"],
						[
							AchievementUtilities.getAchievementLevel(
								achievement
							).toString(),
							achievement.levelCount.toString(),
						]
					)}
				</p>
			</div>
			<div className="right">
				<div className="infomation">
					<h3 className="title">
						{LocalizeBadgeName(
							AchievementUtilities.getAchievementBadgeCode(
								achievement
							)
						)}
					</h3>
					<p className="description">
						{LocalizeBadgeDescription(
							AchievementUtilities.getAchievementBadgeCode(
								achievement
							)
						)}
					</p>
				</div>
				<div className="progress">
					<p className="reward">
						{achievement.levelRewardPoints > 0 && (
							<>
								{LocalizeText("achievements.details.reward")}{" "}
								<span>{achievement.levelRewardPoints}</span>
							</>
						)}
					</p>
					{achievement.scoreLimit > 0 && (
						<ProgressBar
							label={
								(
									achievement.currentPoints +
									achievement.scoreAtStartOfLevel
								).toString() +
								"/" +
								(
									achievement.scoreLimit +
									achievement.scoreAtStartOfLevel
								).toString()
							}
							progress={
								achievement.currentPoints +
								achievement.scoreAtStartOfLevel
							}
							maxProgress={
								achievement.scoreLimit +
								achievement.scoreAtStartOfLevel
							}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
