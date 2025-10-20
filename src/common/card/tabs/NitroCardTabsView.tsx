import { FC, useMemo } from "react";
import { Flex, FlexProps } from "../..";
/** @deprecated use StarboCard element instead */
export const NitroCardTabsView: FC<FlexProps> = (props) => {
	const {
		justifyContent = "start",
		gap = 0,
		classNames = [],
		children = null,
		...rest
	} = props;

	const getClassNames = useMemo(() => {
		const newClassNames: string[] = [
			"container-fluid",
			"nitro-card-tabs",
			"pt-1",
			"position-relative",
		];

		if (classNames.length) newClassNames.push(...classNames);

		return newClassNames;
	}, [classNames]);

	return (
		<Flex
			justifyContent={justifyContent}
			gap={gap}
			classNames={getClassNames}
			{...rest}
		>
			{children}
		</Flex>
	);
};
