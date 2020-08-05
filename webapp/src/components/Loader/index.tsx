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
      singleColor={color || '#6c6b6d'}
      borderSize={borderSize || 6}
    />
  </div>
);

export default Loader;
