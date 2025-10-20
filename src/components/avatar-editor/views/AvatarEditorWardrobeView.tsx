import {
	HabboClubLevelEnum,
	IAvatarFigureContainer,
	SaveWardrobeOutfitMessageComposer,
} from "@nitrots/nitro-renderer";
import { Dispatch, FC, SetStateAction, useCallback, useMemo } from "react";
import {
	CreateLinkEvent,
	FigureData,
	GetAvatarRenderManager,
	GetConfiguration,
	GetSessionDataManager,
	LocalizeText,
	SendMessageComposer,
} from "../../../api";
import { LayoutAvatarImageView } from "../../../common";
export interface AvatarEditorWardrobeViewProps {
	figureData: FigureData;
	savedFigures: [IAvatarFigureContainer, string][];
	setSavedFigures: Dispatch<
		SetStateAction<[IAvatarFigureContainer, string][]>
	>;
	loadAvatarInEditor: (
		figure: string,
		gender: string,
		reset?: boolean
	) => void;
}

export const AvatarEditorWardrobeView: FC<AvatarEditorWardrobeViewProps> = (
	props
) => {
	const {
		figureData = null,
		savedFigures = [],
		setSavedFigures = null,
		loadAvatarInEditor = null,
	} = props;

	const hcDisabled = GetConfiguration<boolean>("hc.disabled", false);

	const wearFigureAtIndex = useCallback(
		(index: number) => {
			if (index >= savedFigures.length || index < 0) return;

			const [figure, gender] = savedFigures[index];

			loadAvatarInEditor(figure.getFigureString(), gender);
		},
		[savedFigures, loadAvatarInEditor]
	);

	const saveFigureAtWardrobeIndex = useCallback(
		(index: number) => {
			if (!figureData || index >= savedFigures.length || index < 0)
				return;

			if (
				GetSessionDataManager().clubLevel === HabboClubLevelEnum.NO_CLUB
			)
				return CreateLinkEvent("habboUI/open/hccenter");

			const newFigures = [...savedFigures];

			const figure = figureData.getFigureString();
			const gender = figureData.gender;

			newFigures[index] = [
				GetAvatarRenderManager().createFigureContainer(figure),
				gender,
			];

			setSavedFigures(newFigures);
			SendMessageComposer(
				new SaveWardrobeOutfitMessageComposer(index + 1, figure, gender)
			);
		},
		[figureData, savedFigures, setSavedFigures]
	);

	const getClubLevel = useCallback(() => {
		let highestClubLevel = 0;

		savedFigures.forEach(([figureContainer, gender]) => {
			if (figureContainer) {
				const clubLevel = GetAvatarRenderManager().getFigureClubLevel(
					figureContainer,
					gender
				);
				highestClubLevel = Math.max(highestClubLevel, clubLevel);
			}
		});

		return highestClubLevel;
	}, [savedFigures]);

	const figures = useMemo(() => {
		if (!savedFigures || !savedFigures.length) return [];

		const items: JSX.Element[] = [];

		savedFigures.forEach(([figureContainer, gender], index) => {
			let clubLevel = 0;

			if (figureContainer)
				clubLevel = GetAvatarRenderManager().getFigureClubLevel(
					figureContainer,
					gender
				);

			items.push(
				<div className="look" key={index}>
					<div className="buttons">
						<button
							className="save"
							onClick={() => saveFigureAtWardrobeIndex(index)}
						></button>
						<button
							className="use"
							onClick={() => {
								figureContainer && wearFigureAtIndex(index);
							}}
						></button>
					</div>
					<div className="avatar-container">
						{figureContainer && (
							<LayoutAvatarImageView
								className="avatar-figure"
								figure={figureContainer.getFigureString()}
								gender={gender}
								direction={4}
							/>
						)}
					</div>
				</div>
			);
		});

		return items;
	}, [savedFigures, saveFigureAtWardrobeIndex, wearFigureAtIndex]);

	return (
		<>
			<div className="title">
				<h3>{LocalizeText("avatareditor.wardrobe.title")}</h3>
				<i className="starbo-club"></i>
			</div>
			<div className="wardrobe">{figures}</div>
		</>
	);
};
