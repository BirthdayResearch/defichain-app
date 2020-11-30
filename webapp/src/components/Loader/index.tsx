import React from 'react';
import MDSpinner from 'react-md-spinner';

interface LoaderProps {
  size?: number;
  color?: string;
  className?: string;
  borderSize?: number;
}

const Loader: React.FunctionComponent<LoaderProps> = ({
  size,
  color,
  className,
  borderSize,
}) => (
  <div className={`${className || ''}`}>
    <MDSpinner
      size={size || 28}
      singleColor={color || '#666666'}
      borderSize={borderSize || 4}
    />
  </div>
);

export default Loader;
