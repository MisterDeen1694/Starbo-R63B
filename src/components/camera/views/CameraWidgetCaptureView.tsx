import { NitroRectangle, TextureUtils } from "@nitrots/nitro-renderer";
import { FC, useRef } from "react";
import {
	CameraPicture,
	CreateLinkEvent,
	GetRoomEngine,
	GetRoomSession,
	LocalizeText,
	PlaySound,
	SoundNames,
} from "../../../api";
import { Button, DraggableWindowCamera } from "../../../common";
import { useCamera, useNotification } from "../../../hooks";
import clsx from "clsx";

export interface CameraWidgetCaptureViewProps {
	onClose: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

const CAMERA_ROLL_LIMIT: number = 5;

export const CameraWidgetCaptureView: FC<CameraWidgetCaptureViewProps> = (
	props
) => {
	const { onClose = null, onEdit = null, onDelete = null } = props;
	const {
		cameraRoll = null,
		setCameraRoll = null,
		selectedPictureIndex = -1,
		setSelectedPictureIndex = null,
	} = useCamera();
	const { simpleAlert = null } = useNotification();
	const elementRef = useRef<HTMLDivElement>();

	const selectedPicture =
		selectedPictureIndex > -1 ? cameraRoll[selectedPictureIndex] : null;

	const getCameraBounds = () => {
		if (!elementRef || !elementRef.current) return null;

		const frameBounds = elementRef.current.getBoundingClientRect();

		return new NitroRectangle(
			Math.floor(frameBounds.x),
			Math.floor(frameBounds.y),
			Math.floor(frameBounds.width),
			Math.floor(frameBounds.height)
		);
	};

	const takePicture = () => {
		if (selectedPictureIndex > -1) {
			setSelectedPictureIndex(-1);
			return;
		}

		const texture = GetRoomEngine().createTextureFromRoom(
			GetRoomSession().roomId,
			1,
			getCameraBounds()
		);

		const clone = [...cameraRoll];

		if (clone.length >= CAMERA_ROLL_LIMIT) {
			simpleAlert(
				LocalizeText("camera.full.body"),
				null,
				null,
				null,
				LocalizeText("camera.full.header")
			);

			clone.shift();
		}

		PlaySound(SoundNames.CAMERA_SHUTTER);
		clone.push(
			new CameraPicture(texture, TextureUtils.generateImageUrl(texture))
		);

		setCameraRoll(clone);
	};
	const deletePicture = () => {
		onDelete();
		setTimeout(() => setSelectedPictureIndex(-1), 0);
	};

	return (
		<DraggableWindowCamera uniqueKey="camera-capture">
			{selectedPicture && (
				<img className="preview" src={selectedPicture.imageUrl} />
			)}
			<div className="card  drag-handler">
				<div className="header">
					<h2>{LocalizeText("camera.interface.title")}</h2>
					<div className="actions">
						<div className="actions">
							<button
								onClick={() =>
									CreateLinkEvent("habbopages/help/camera")
								}
								className="info"
							></button>
							<button
								onClick={onClose}
								className="close"
							></button>
						</div>
					</div>
				</div>
				{!selectedPicture && (
					<div className="lens-active" ref={elementRef}></div>
				)}
				{selectedPicture && (
					<div className="lens">
						<div className="actions">
							<Button
								title={LocalizeText(
									"camera.editor.button.tooltip"
								)}
								variant="primary"
								color="secondary"
								outline
								width={49}
								height={35}
								onClick={onEdit}
							>
								{LocalizeText("camera.editor.button.text")}
							</Button>
						</div>
					</div>
				)}
				<button
					title={LocalizeText("camera.take.photo.button.tooltip")}
					className="capture"
					onClick={takePicture}
				/>
				<div className="gallery">
					{[...Array(5)].map((_, index) => (
						<div
							key={index}
							className={clsx(
								"photo",
								index === selectedPictureIndex && "selected"
							)}
							onClick={() =>
								cameraRoll[index] &&
								setSelectedPictureIndex(index)
							}
						>
							{cameraRoll[index] && (
								<img alt="" src={cameraRoll[index].imageUrl} />
							)}
							{index === selectedPictureIndex && (
								<button
									onClick={deletePicture}
									className="delete"
								/>
							)}
						</div>
					))}
				</div>
			</div>
		</DraggableWindowCamera>
	);
};
