import { IRoomCameraWidgetEffect } from "@nitrots/nitro-renderer";
import { FC } from "react";
import { LocalizeText } from "../../../../../api";
import clsx from "clsx";

export interface CameraWidgetEffectListItemViewProps {
	effect: IRoomCameraWidgetEffect;
	thumbnailUrl: string;
	isActive: boolean;
	isLocked: boolean;
	selectEffect: () => void;
	removeEffect: () => void;
}

export const CameraWidgetEffectListItemView: FC<
	CameraWidgetEffectListItemViewProps
> = (props) => {
	const {
		effect = null,
		thumbnailUrl = null,
		isActive = false,
		isLocked = false,
		selectEffect = null,
		removeEffect = null,
	} = props;

	return (
		<button
			title={
				isLocked
					? LocalizeText("camera.effect.required.level") +
					  effect.minLevel
					: LocalizeText(`camera.effect.name.${effect.name}`)
			}
			className={clsx(
				"effect",
				isLocked && "locked",
				isActive && "selected"
			)}
			onClick={() => !isActive && !isLocked && selectEffect()}
		>
			{!isLocked && thumbnailUrl && thumbnailUrl.length > 0 && (
				<img alt="" src={thumbnailUrl} />
			)}
			{isActive && <button onClick={removeEffect} className="delete" />}
		</button>
	);
};
