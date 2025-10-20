import { ILinkEventTracker } from "@nitrots/nitro-renderer";
import { FC, useEffect, useState } from "react";
import {
	AchievementUtilities,
	AddEventLinkTracker,
	LocalizeText,
	RemoveLinkEventTracker,
} from "../../api";
import { ProgressBar, StarboCard } from "../../common";
const { Header, Body, Subheader, Content } = StarboCard;
import { useAchievements } from "../../hooks";
import { AchievementCategoryView } from "./views/AchievementCategoryView";
import { AchievementsCategoryListView } from "./views/category-list/AchievementsCategoryListView";

export const AchievementsView: FC<{}> = () => {
	const [isVisible, setIsVisible] = useState(false);
	const {
		achievementCategories = [],
		selectedCategoryCode = null,
		setSelectedCategoryCode = null,
		achievementScore = 0,
		getProgress = 0,
		getMaxProgress = 0,
		selectedCategory = null,
	} = useAchievements();

	useEffect(() => {
		const linkTracker: ILinkEventTracker = {
			linkReceived: (url: string) => {
				const parts = url.split("/");

				if (parts.length < 2) return;

				switch (parts[1]) {
					case "show":
						setIsVisible(true);
						return;
					case "hide":
						setIsVisible(false);
						return;
					case "toggle":
						setIsVisible((prevValue) => !prevValue);
						return;
				}
			},
			eventUrlPrefix: "achievements/",
		};

		AddEventLinkTracker(linkTracker);

		return () => RemoveLinkEventTracker(linkTracker);
	}, []);

	const cardHeight = () => {
		if (!selectedCategory) {
			return 86 + 110 * Math.ceil(achievementCategories.length / 3);
		}

		if (selectedCategory.achievements.length <= 20) {
			return (
				262 + 60 * Math.ceil(selectedCategory.achievements.length / 6)
			);
		}
		return 501;
	};

	if (!isVisible) return null;

	return (
		<StarboCard
			onClose={() => setIsVisible(false)}
			width={389}
			height={cardHeight()}
			uniqueKey="achievements"
			resize="disabled"
			variant="primary"
		>
			<Header>{LocalizeText("inventory.achievements")}</Header>
			<Body>
				{!selectedCategory && (
					<Content>
						<AchievementsCategoryListView
							categories={achievementCategories}
							setSelectedCategoryCode={setSelectedCategoryCode}
						/>
						<div className="total-progress">
							<ProgressBar
								label={LocalizeText(
									"achievements.categories.totalprogress",
									["progress", "limit"],
									[
										getProgress.toString(),
										getMaxProgress.toString(),
									]
								)}
								progress={getProgress}
								maxProgress={getMaxProgress}
							/>
							<p>
								{LocalizeText(
									"achievements.categories.score",
									["score"],
									[achievementScore.toString()]
								)}
							</p>
						</div>
					</Content>
				)}
				{selectedCategory && (
					<>
						<Subheader
							width={"full"}
							color="rgb(136, 153, 162)"
							height={75}
						>
							<button
								className="back"
								onClick={() => setSelectedCategoryCode(null)}
							/>
							<div className="infomation">
								<h3 className="title">
									{LocalizeText(
										`quests.${selectedCategory.code}.name`
									)}
								</h3>
								<p className="progress">
									{LocalizeText(
										"achievements.details.categoryprogress",
										["progress", "limit"],
										[
											selectedCategory
												.getProgress()
												.toString(),
											selectedCategory
												.getMaxProgress()
												.toString(),
										]
									)}
								</p>
							</div>
							<img
								draggable="false"
								src={AchievementUtilities.getAchievementCategoryImageUrl(
									selectedCategory,
									null,
									true
								)}
								className="icon"
							/>
						</Subheader>
						<Content>
							<AchievementCategoryView
								category={selectedCategory}
							/>
						</Content>
					</>
				)}
			</Body>
		</StarboCard>
	);
};
