import Svg, { Path } from "react-native-svg";
import { cn } from "../utils/cn";
import { View } from 'react-native';

interface IArcProps {
  percentage: number;
  color: string;
  radius: number;
  strokeWidth: number;
  baseStrokeColor?: string;
  className?: string;
}

export function Arc({
  percentage,
  color,
  radius,
  strokeWidth,
  className,
}: IArcProps) {
  const semiCircumference = Math.PI * radius;
  const arcLength = (percentage / 100) * semiCircumference;

  const arcDraw = `M ${strokeWidth / 2},${radius + strokeWidth / 2}
                   A ${radius},${radius} 0 0,1 ${radius * 2 + strokeWidth / 2},${radius + strokeWidth / 2}`;

  return (
    <View className={cn(className)}>
      <Svg width={radius * 2 + strokeWidth} height={radius + strokeWidth}>
        <Path
          d={arcDraw}
          fill="none"
          stroke="#E0E0E0"
          strokeWidth={strokeWidth}
          strokeDasharray={semiCircumference}
          strokeLinecap="round"
        />

        <Path
          d={arcDraw}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={[arcLength, semiCircumference]}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}
