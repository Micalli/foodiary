import React from "react";
import { View } from "react-native";
import Svg, { Rect } from "react-native-svg";

interface IBarProps {
  width: number;
  height: number;
  segments: { value: number; color: string }[];
  radius?: number;
}

export function MacroBar({ width, height, segments}: IBarProps) {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);
  let offset = 0;

  return (
    <View>
      <Svg width={width} height={height}>
        {segments.map((seg, index) => {
          const segmentWidth = (seg.value / total) * width;
          const rect = (
            <Rect
              key={index}
              x={offset}
              y={0}
              width={segmentWidth}
              height={height}
              fill={seg.color}
            />
          );
          offset += segmentWidth;
          return rect;
        })}
      </Svg>
    </View>
  );
}
