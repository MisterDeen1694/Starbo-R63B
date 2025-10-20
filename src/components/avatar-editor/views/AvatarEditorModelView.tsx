import {
	Dispatch,
	FC,
	SetStateAction,
	useCallback,
	useEffect,
	useState,
} from "react";
import clsx from "clsx";
import {
	CategoryData,
	FigureData,
	IAvatarEditorCategoryModel,
	LocalizeText,
} from "../../../api";
import { AvatarEditorFigureSetView } from "./figure-set/AvatarEditorFigureSetView";
import { AvatarEditorPaletteSetView } from "./palette-set/AvatarEditorPaletteSetView";

const CATEGORY_FOOTBALL_GATE = ["ch", "cp", "lg", "sh"];

export interface AvatarEditorModelViewProps {
	model: IAvatarEditorCategoryModel;
	gender: string;
	setGender: Dispatch<SetStateAction<string>>;
	isFromFootballGate?: boolean;
}

export const AvatarEditorModelView: FC<AvatarEditorModelViewProps> = (
	props
) => {
	const {
		model = null,
		gender = null,
		isFromFootballGate = false,
		setGender = null,
	} = props;
	const [activeCategory, setActiveCategory] = useState<CategoryData>(null);
	const [maxPaletteCount, setMaxPaletteCount] = useState(1);

	const selectCategory = useCallback(
		(name: string) => {
			const category = model.categories.get(name);

			if (!category) return;

			category.init();

			setActiveCategory(category);

			for (const part of category.parts) {
				if (!part || !part.isSelected) continue;

				setMaxPaletteCount(part.maxColorIndex || 1);

				break;
			}
		},
		[model]
	);

	useEffect(() => {
		model.init();

		for (const name of model.categories.keys()) {
			selectCategory(name);

			break;
		}
	}, [model, selectCategory]);

	if (!model || !activeCategory) return null;

	return (
		<div className="picker">
			<div className="categories">
				{model.canSetGender && (
					<>
						<div className="category">
							<button
								onClick={() => setGender(FigureData.MALE)}
								className={clsx(
									"boy",
									gender === FigureData.MALE && "selected"
								)}
							/>
							<p>{LocalizeText("avatareditor.generic.boy")}</p>
						</div>
						<div className="category">
							<button
								onClick={() => setGender(FigureData.FEMALE)}
								className={clsx(
									"girl",
									gender === FigureData.FEMALE && "selected"
								)}
							/>
							<p>{LocalizeText("avatareditor.generic.girl")}</p>
						</div>
					</>
				)}
				{!model.canSetGender &&
					model.categories &&
					model.categories.size > 0 &&
					Array.from(model.categories.keys()).map((name) => {
						const category = model.categories.get(name);

						return (
							<div key={name} className="category">
								{isFromFootballGate &&
									CATEGORY_FOOTBALL_GATE.includes(
										category.name
									) && (
										<button
											onClick={() => selectCategory(name)}
											className={clsx(
												name,
												activeCategory === category &&
													"selected"
											)}
										/>
									)}
								{!isFromFootballGate && (
									<button
										onClick={() => selectCategory(name)}
										className={clsx(
											name,
											activeCategory === category &&
												"selected"
										)}
									/>
								)}
							</div>
						);
					})}
			</div>
			<AvatarEditorFigureSetView
				model={model}
				category={activeCategory}
				isFromFootballGate={isFromFootballGate}
				setMaxPaletteCount={setMaxPaletteCount}
			/>
			<div className={clsx("colors", maxPaletteCount === 2 && "dual")}>
				{maxPaletteCount >= 1 && (
					<AvatarEditorPaletteSetView
						model={model}
						category={activeCategory}
						paletteSet={activeCategory.getPalette(0)}
						paletteIndex={0}
					/>
				)}
				{maxPaletteCount === 2 && (
					<AvatarEditorPaletteSetView
						model={model}
						category={activeCategory}
						paletteSet={activeCategory.getPalette(1)}
						paletteIndex={1}
					/>
				)}
			</div>
		</div>
	);
};
