import ReactSlider from "react-slider";
import type { ReactSliderProps } from "react-slider";
import { FC } from "react";

export const Slider: FC<ReactSliderProps> = (props) => {
	const { max, min, value, onChange, ...rest } = props;
	const ReactSliderTyped = ReactSlider as unknown as FC<ReactSliderProps>;

	return (
		<ReactSliderTyped
			className="starbo-slider"
			max={max}
			min={min}
			value={value}
			onChange={onChange}
			{...rest}
		/>
	);
};
