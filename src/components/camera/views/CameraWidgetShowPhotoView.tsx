import {
	RoomObjectCategory,
	RoomObjectVariable,
} from "@nitrots/nitro-renderer";
import { FC, useEffect, useState } from "react";
import {
	GetRoomEngine,
	GetUserProfile,
	IPhotoData,
	LocalizeText,
} from "../../../api";
import { DraggableWindow, DraggableWindowPosition } from "../../../common";

export interface CameraWidgetShowPhotoViewProps {
	currentIndex: number;
	currentPhotos: IPhotoData[];
	onClose?: () => void;
	onReport?: () => void;
}

export const CameraWidgetShowPhotoView: FC<CameraWidgetShowPhotoViewProps> = (
	props
) => {
	const {
		currentIndex = -1,
		currentPhotos = null,
		onClose = null,
		onReport = null,
	} = props;
	const [imageIndex, setImageIndex] = useState(0);
	const currentImage =
		currentPhotos && currentPhotos.length
			? currentPhotos[imageIndex]
			: null;

	const next = () => {
		setImageIndex((prevValue) => {
			let newIndex = prevValue + 1;
			if (newIndex >= currentPhotos.length) newIndex = 0;
			return newIndex;
		});
	};

	const previous = () => {
		setImageIndex((prevValue) => {
			let newIndex = prevValue - 1;
			if (newIndex < 0) newIndex = currentPhotos.length - 1;
			return newIndex;
		});
	};

	const getUserData = (
		roomId: number,
		objectId: number,
		type: string
	): number | string => {
		const roomObject = GetRoomEngine().getRoomObject(
			roomId,
			objectId,
			RoomObjectCategory.WALL
		);
		if (!roomObject) return;
		return type == "username"
			? roomObject.model.getValue<number>(
					RoomObjectVariable.FURNITURE_OWNER_NAME
			  )
			: roomObject.model.getValue<number>(
					RoomObjectVariable.FURNITURE_OWNER_ID
			  );
	};

	useEffect(() => {
		setImageIndex(currentIndex);
	}, [currentIndex]);

	if (!currentImage) return null;
	return (
		<DraggableWindow
			uniqueKey="camera-photo"
			handleSelector=".drag-handler"
			windowPosition={DraggableWindowPosition.CENTER}
		>
			<div className="drag-handler camera-photo">
				<div className="actions">
					<button onClick={onReport} className="report" />
					<button onClick={onClose} className="close" />
				</div>
				<div className="photo">
					{currentImage.w ? (
						<img draggable="false" src={currentImage.w} />
					) : (
						<div className="loading">
							<p>{LocalizeText("camera.loading")}</p>
						</div>
					)}
					<div className="details">
						<p>
							{new Date(currentImage.t * 1000).toLocaleDateString(
								"NL-nl",
								{
									day: "numeric",
									month: "numeric",
									year: "numeric",
								}
							)}
						</p>
						<button
							onClick={() =>
								GetUserProfile(
									Number(
										getUserData(
											currentImage.s,
											Number(currentImage.u),
											"id"
										)
									)
								)
							}
						>
							{getUserData(
								currentImage.s,
								Number(currentImage.u),
								"username"
							)}
						</button>
					</div>
				</div>
				{currentPhotos.length > 1 && (
					<div className="skip">
						<button className="previous" onClick={previous} />
						<button onClick={next} />
					</div>
				)}
			</div>
		</DraggableWindow>
	);
};
