import React from 'react';

interface CustomIconProps {
  size: number;
  color: string;
  src: string;
}

const CustomIcon: React.FunctionComponent<CustomIconProps> = (
  props: CustomIconProps
) => {
  const { size, color, src } = props;

  return <img src={src} height={size} width={size} color={color} />;
};

export default CustomIcon;
