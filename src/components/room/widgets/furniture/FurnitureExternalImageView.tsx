import { FC } from "react";
import {
	GetSessionDataManager,
	LocalizeText,
	ReportType,
} from "../../../../api";
import {
	NitroCardContentView,
	NitroCardHeaderView,
	NitroCardView,
} from "../../../../common";
import { useFurnitureExternalImageWidget, useHelp } from "../../../../hooks";
import { CameraWidgetShowPhotoView } from "../../../camera/views/CameraWidgetShowPhotoView";

export const FurnitureExternalImageView: FC<{}> = (props) => {
	const {
		objectId = -1,
		currentPhotoIndex = -1,
		currentPhotos = null,
		onClose = null,
	} = useFurnitureExternalImageWidget();
	const { report = null } = useHelp();

	if (objectId === -1 || currentPhotoIndex === -1) return null;

	return (
		<CameraWidgetShowPhotoView
			onReport={() =>
				report(ReportType.PHOTO, {
					extraData: currentPhotos[currentPhotoIndex].w,
					roomId: currentPhotos[currentPhotoIndex].s,
					reportedUserId: GetSessionDataManager().userId,
					roomObjectId: Number(currentPhotos[currentPhotoIndex].u),
				})
			}
			onClose={onClose}
			currentIndex={currentPhotoIndex}
			currentPhotos={currentPhotos}
		/>
	);
};
