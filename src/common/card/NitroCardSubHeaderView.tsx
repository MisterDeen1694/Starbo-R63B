import { FC, useMemo } from "react";
import { Flex, FlexProps } from "..";

interface NitroCardSubHeaderProps extends FlexProps {}
/** @deprecated use StarboCard element instead */
export const NitroCardSubHeaderView: FC<NitroCardSubHeaderProps> = (props) => {
	const { justifyContent = "center", classNames = [], ...rest } = props;

	const getClassNames = useMemo(() => {
		const newClassNames: string[] = ["container-fluid"];

		if (classNames.length) newClassNames.push(...classNames);

		return newClassNames;
	}, [classNames]);

	return (
		<Flex
			justifyContent={justifyContent}
			classNames={getClassNames}
			{...rest}
		/>
	);
};
