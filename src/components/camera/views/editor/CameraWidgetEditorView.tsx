import {
	IRoomCameraWidgetEffect,
	IRoomCameraWidgetSelectedEffect,
	RoomCameraWidgetSelectedEffect,
} from "@nitrots/nitro-renderer";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
	CameraEditorTabs,
	CameraPicture,
	CameraPictureThumbnail,
	CreateLinkEvent,
	GetRoomCameraWidgetManager,
	LocalizeText,
} from "../../../../api";
import { Button, Slider, StarboCard } from "../../../../common";
import { CameraWidgetEffectListView } from "./effect-list/CameraWidgetEffectListView";
const { Header, Body, Column, Subheader, Tabs, Tab, Content } = StarboCard;

export interface CameraWidgetEditorViewProps {
	picture: CameraPicture;
	availableEffects: IRoomCameraWidgetEffect[];
	myLevel: number;
	onClose: () => void;
	onCancel: () => void;
	onCheckout: (pictureUrl: string) => void;
}

const TABS: string[] = [
	CameraEditorTabs.COLORMATRIX,
	CameraEditorTabs.COMPOSITE,
];

export const CameraWidgetEditorView: FC<CameraWidgetEditorViewProps> = (
	props
) => {
	const {
		picture = null,
		availableEffects = null,
		myLevel = 1,
		onClose = null,
		onCancel = null,
		onCheckout = null,
	} = props;
	const [currentTab, setCurrentTab] = useState(TABS[0]);
	const [selectedEffectName, setSelectedEffectName] = useState<string>(null);
	const [selectedEffects, setSelectedEffects] = useState<
		IRoomCameraWidgetSelectedEffect[]
	>([]);
	const [effectsThumbnails, setEffectsThumbnails] = useState<
		CameraPictureThumbnail[]
	>([]);
	const [isZoomed, setIsZoomed] = useState(false);

	const getColorMatrixEffects = useMemo(() => {
		return availableEffects.filter((effect) => effect.colorMatrix);
	}, [availableEffects]);

	const getCompositeEffects = useMemo(() => {
		return availableEffects.filter((effect) => effect.texture);
	}, [availableEffects]);

	const getEffectList = useCallback(() => {
		if (currentTab === CameraEditorTabs.COLORMATRIX) {
			return getColorMatrixEffects;
		}

		return getCompositeEffects;
	}, [currentTab, getColorMatrixEffects, getCompositeEffects]);

	const getSelectedEffectIndex = useCallback(
		(name: string) => {
			if (
				!name ||
				!name.length ||
				!selectedEffects ||
				!selectedEffects.length
			)
				return -1;

			return selectedEffects.findIndex(
				(effect) => effect.effect.name === name
			);
		},
		[selectedEffects]
	);

	const getCurrentEffectIndex = useMemo(() => {
		return getSelectedEffectIndex(selectedEffectName);
	}, [selectedEffectName, getSelectedEffectIndex]);

	const getCurrentEffect = useMemo(() => {
		if (!selectedEffectName) return null;

		return selectedEffects[getCurrentEffectIndex] || null;
	}, [selectedEffectName, getCurrentEffectIndex, selectedEffects]);

	const setSelectedEffectAlpha = useCallback(
		(alpha: number) => {
			const index = getCurrentEffectIndex;

			if (index === -1) return;

			setSelectedEffects((prevValue) => {
				const clone = [...prevValue];
				const currentEffect = clone[index];

				clone[getCurrentEffectIndex] =
					new RoomCameraWidgetSelectedEffect(
						currentEffect.effect,
						alpha
					);

				return clone;
			});
		},
		[getCurrentEffectIndex, setSelectedEffects]
	);

	const getCurrentPictureUrl = useMemo(() => {
		return GetRoomCameraWidgetManager().applyEffects(
			picture.texture,
			selectedEffects,
			isZoomed
		).src;
	}, [picture, selectedEffects, isZoomed]);

	const processAction = useCallback(
		(type: string, effectName: string = null, event: any = null) => {
			switch (type) {
				case "close":
					onClose();
					return;
				case "cancel":
					onCancel();
					return;
				case "checkout":
					onCheckout(getCurrentPictureUrl);
					return;
				case "change_tab":
					setCurrentTab(String(effectName));
					return;
				case "select_effect": {
					let existingIndex = getSelectedEffectIndex(effectName);

					if (existingIndex >= 0) return;

					const effect = availableEffects.find(
						(effect) => effect.name === effectName
					);

					if (!effect) return;

					setSelectedEffects((prevValue) => {
						return [
							...prevValue,
							new RoomCameraWidgetSelectedEffect(effect, 1),
						];
					});

					setSelectedEffectName(effect.name);
					return;
				}
				case "remove_effect": {
					let existingIndex = getSelectedEffectIndex(effectName);

					if (existingIndex === -1) return;

					setSelectedEffects((prevValue) => {
						const clone = [...prevValue];

						clone.splice(existingIndex, 1);

						return clone;
					});

					if (selectedEffectName === effectName)
						setSelectedEffectName(null);
					return;
				}
				case "clear_effects":
					setSelectedEffectName(null);
					setSelectedEffects([]);
					return;
				case "download": {
					const image = new Image();

					image.src = getCurrentPictureUrl;

					const newWindow = window.open("");
					newWindow.document.write(image.outerHTML);
					return;
				}
				case "zoom":
					setIsZoomed(!isZoomed);
					return;
			}
		},
		[
			isZoomed,
			availableEffects,
			selectedEffectName,
			getCurrentPictureUrl,
			getSelectedEffectIndex,
			onCancel,
			onCheckout,
			onClose,
			setIsZoomed,
			setSelectedEffects,
		]
	);

	useEffect(() => {
		const thumbnails: CameraPictureThumbnail[] = [];

		for (const effect of availableEffects) {
			thumbnails.push(
				new CameraPictureThumbnail(
					effect.name,
					GetRoomCameraWidgetManager().applyEffects(
						picture.texture,
						[new RoomCameraWidgetSelectedEffect(effect, 1)],
						false
					).src
				)
			);
		}

		setEffectsThumbnails(thumbnails);
	}, [picture, availableEffects]);

	return (
		<StarboCard
			uniqueKey="camera-editor"
			width={584}
			height={514}
			onClose={() => processAction("close")}
			onInfo={() => CreateLinkEvent("habbopages/help/camera")}
			resize="disabled"
		>
			<Header color="quaternary">
				{LocalizeText("camera.editor.button.text")}
			</Header>

			<Body columns>
				<Column side="left" width={230}>
					<Subheader width={232} height={54}>
						<Tabs>
							{TABS.map((tab) => {
								return (
									<Tab
										key={tab}
										isActive={currentTab === tab}
										onClick={() =>
											processAction("change_tab", tab)
										}
									>
										<div className={`icon ${tab}`}></div>
									</Tab>
								);
							})}
						</Tabs>
					</Subheader>
					<Content>
						<div className="effects">
							<CameraWidgetEffectListView
								myLevel={myLevel}
								selectedEffects={selectedEffects}
								effects={getEffectList()}
								thumbnails={effectsThumbnails}
								processAction={processAction}
							/>
						</div>
					</Content>
				</Column>
				<Column side="right" width={320}>
					<Content>
						<div className="preview">
							<img src={getCurrentPictureUrl} />
							{selectedEffectName && (
								<div className="effect-slider">
									<p>
										{LocalizeText(
											"camera.effect.name." +
												selectedEffectName
										)}{" "}
										{Math.round(
											(getCurrentEffect.alpha / 1) * 100
										)}
										%
									</p>
									<Slider
										min={0}
										max={1}
										step={0.01}
										value={getCurrentEffect.alpha}
										onChange={(event) =>
											setSelectedEffectAlpha(event)
										}
									/>
								</div>
							)}
						</div>
						<div className="actions-top">
							{getCurrentPictureUrl && (
								<button
									className="save"
									onClick={() => processAction("download")}
								>
									{LocalizeText("save")}
								</button>
							)}
							<button
								className="zoom"
								onClick={() => processAction("zoom")}
							>
								{LocalizeText("room.zoom.button.text")}
							</button>
						</div>
						<div className="actions-bottom">
							<Button
								onClick={() => processAction("cancel")}
								width="full"
								variant="primary"
								color="quinary"
							>
								{LocalizeText("generic.cancel")}
							</Button>
							<Button
								onClick={() => processAction("checkout")}
								width="full"
								variant="primary"
								color="secondary"
								shadow
								outline
							>
								{LocalizeText("camera.preview.button.text")}
							</Button>
						</div>
					</Content>
				</Column>
			</Body>
		</StarboCard>
	);
};
