import {
	CameraPublishStatusMessageEvent,
	CameraPurchaseOKMessageEvent,
	CameraStorageUrlMessageEvent,
	NotEnoughBalanceMessageEvent,
	PublishPhotoMessageComposer,
	PurchasePhotoMessageComposer,
} from "@nitrots/nitro-renderer";
import { FC, useEffect, useMemo, useState } from "react";
import {
	CreateLinkEvent,
	GetConfiguration,
	GetRoomEngine,
	LocalizeText,
	SendMessageComposer,
} from "../../../api";
import { Button, StarboCard } from "../../../common";
const { Header, Body, Content } = StarboCard;
import { useMessageEvent, useNotification } from "../../../hooks";
import clsx from "clsx";

export interface CameraWidgetCheckoutViewProps {
	base64Url: string;
	onCloseClick: () => void;
	onCancelClick: () => void;
	price: { credits: number; duckets: number; publishDucketPrice: number };
}

export const CameraWidgetCheckoutView: FC<CameraWidgetCheckoutViewProps> = (
	props
) => {
	const {
		base64Url = null,
		onCloseClick = null,
		onCancelClick = null,
		price = null,
	} = props;
	const [pictureUrl, setPictureUrl] = useState<string>(null);
	const [publishUrl, setPublishUrl] = useState<string>(null);
	const [picturesBought, setPicturesBought] = useState(0);
	const [wasPicturePublished, setWasPicturePublished] = useState(false);
	const [isWaiting, setIsWaiting] = useState(false);
	const [publishCooldown, setPublishCooldown] = useState(0);
	const { simpleAlert } = useNotification();

	const publishDisabled = useMemo(
		() => GetConfiguration<boolean>("camera.publish.disabled", false),
		[]
	);

	useMessageEvent<CameraPurchaseOKMessageEvent>(
		CameraPurchaseOKMessageEvent,
		(event) => {
			setPicturesBought((value) => value + 1);
			setIsWaiting(false);
		}
	);

	useMessageEvent<CameraPublishStatusMessageEvent>(
		CameraPublishStatusMessageEvent,
		(event) => {
			const parser = event.getParser();

			if (!parser.ok)
				simpleAlert(
					LocalizeText(
						"camera.publish.wait",
						["minutes"],
						[
							Math.floor(parser.secondsToWait / 60)
								.toString()
								.replace("-", ""),
						]
					),
					null,
					null,
					null,
					LocalizeText("camera.purchase.pleasewait")
				);

			setPublishUrl(parser.extraDataId);
			setPublishCooldown(parser.secondsToWait);
			setWasPicturePublished(parser.ok);
			setIsWaiting(false);
		}
	);

	useMessageEvent<CameraStorageUrlMessageEvent>(
		CameraStorageUrlMessageEvent,
		(event) => {
			const parser = event.getParser();

			setPictureUrl(
				GetConfiguration<string>("camera.url") + "/" + parser.url
			);
		}
	);

	useMessageEvent<NotEnoughBalanceMessageEvent>(
		NotEnoughBalanceMessageEvent,
		(event) => {
			const parser = event.getParser();

			if (!parser) return null;

			if (parser.notEnoughCredits && !parser.notEnoughActivityPoints)
				simpleAlert(
					LocalizeText("catalog.alert.notenough.credits.description"),
					null,
					null,
					null,
					LocalizeText("catalog.alert.notenough.title")
				);

			if (!parser.notEnoughCredits && parser.notEnoughActivityPoints)
				simpleAlert(
					LocalizeText(
						`catalog.alert.notenough.activitypoints.description.${parser.activityPointType}`
					),
					null,
					null,
					null,
					LocalizeText(
						`catalog.alert.notenough.activitypoints.title.${parser.activityPointType}`
					)
				);

			setIsWaiting(false);
		}
	);

	const processAction = (type: string, value: string | number = null) => {
		switch (type) {
			case "close":
				onCloseClick();
				return;
			case "buy":
				if (isWaiting) return;

				setIsWaiting(true);
				SendMessageComposer(new PurchasePhotoMessageComposer(""));
				return;
			case "publish":
				if (isWaiting) return;

				setIsWaiting(true);
				SendMessageComposer(new PublishPhotoMessageComposer());
				return;
			case "cancel":
				onCancelClick();
				return;
		}
	};

	useEffect(() => {
		if (!base64Url) return;

		GetRoomEngine().saveBase64AsScreenshot(base64Url);
	}, [base64Url]);

	if (!price) return null;
	const isLoading = !pictureUrl || !pictureUrl.length;
	return (
		<StarboCard
			width={338}
			uniqueKey="camera-checkout"
			onClose={() => processAction("close")}
		>
			<Header color="quaternary">
				{LocalizeText("camera.confirm_phase.title")}
			</Header>
			<Body>
				<Content>
					<div className={clsx("preview", isLoading && "loading")}>
						{isLoading ? (
							<p>{LocalizeText("camera.loading")}</p>
						) : (
							<img src={pictureUrl} />
						)}
					</div>
					<p className="ready-text">
						{LocalizeText(
							(!isLoading &&
								picturesBought > 0 &&
								"camera.purchase.successful") ||
								(!isLoading &&
									!wasPicturePublished &&
									"camera.confirm_phase.info") ||
								(!isLoading &&
									wasPicturePublished &&
									"camera.publish.successful") ||
								(isLoading && "camera.purchase.pleasewait")
						)}
					</p>
					<div className="action-box">
						<div>
							<h3>{LocalizeText("camera.purchase.header")}</h3>
							<p>
								{LocalizeText(
									"catalog.purchase.confirmation.dialog.cost"
								) + " "}
								<span
									className={clsx(
										price.credits > 0 && "credits",
										price.duckets > 0 && "duckets"
									)}
								>
									{(price.credits > 0 && price.credits) ||
										(price.duckets > 0 && price.duckets)}
								</span>
							</p>
						</div>
						<Button
							color="secondary"
							onClick={() => processAction("buy")}
							width={106}
							height={22}
						>
							{LocalizeText(
								!picturesBought
									? "buy"
									: "camera.buy.another.button.text"
							)}
						</Button>
						{picturesBought > 0 && (
							<p className="bought">
								{LocalizeText("camera.purchase.count.info")}{" "}
								<span>{picturesBought}</span>{" "}
								<u
									onClick={() =>
										CreateLinkEvent("inventory/toggle")
									}
								>
									{LocalizeText("camera.open.inventory")}
								</u>
							</p>
						)}
					</div>
					<div className="action-box">
						{!wasPicturePublished && (
							<>
								<div>
									<h3>
										{LocalizeText(
											"camera.publish.explanation"
										)}
									</h3>
									<p>
										{LocalizeText(
											"camera.publish.detailed.explanation"
										)}
									</p>
									<p>
										{LocalizeText(
											"catalog.purchase.confirmation.dialog.cost"
										)}{" "}
										<span
											className={clsx(
												price.credits > 0 && "credits",
												price.duckets > 0 && "duckets"
											)}
										>
											{(price.credits > 0 &&
												price.credits) ||
												(price.duckets > 0 &&
													price.duckets)}
										</span>
									</p>
								</div>
								<Button
									color="secondary"
									onClick={() => processAction("publish")}
									width={106}
									height={22}
								>
									{LocalizeText("camera.publish.button.text")}
								</Button>
							</>
						)}
						{wasPicturePublished && (
							<>
								<div>
									<h3>
										{LocalizeText(
											"camera.publish.successful"
										)}
									</h3>
									<p>
										{LocalizeText(
											"camera.publish.success.short.info"
										)}
									</p>
									<a href={publishUrl} target="_blank">
										{LocalizeText(
											"camera.link.to.published"
										)}
									</a>
								</div>
							</>
						)}
					</div>
					<p className="disclaimer">
						{LocalizeText("camera.warning.disclaimer")}
					</p>
					<Button
						width={106}
						height={22}
						onClick={() => processAction("cancel")}
					>
						{LocalizeText(
							picturesBought < 1 && !wasPicturePublished
								? "generic.cancel"
								: "generic.close"
						)}
					</Button>
				</Content>
			</Body>
		</StarboCard>
	);
};
