import React from 'react';
import { getIcon } from '../../utils/utility';
import Avatar from 'react-avatar';
interface TokenAvatar {
  symbol?: any;
  size?: string;
  textSizeRatio?: number;
}

const TokenAvatar = (props: TokenAvatar) => {
  const { symbol, size, textSizeRatio} = props;
  const data = getIcon(symbol);
  return (
    <Avatar
      name={symbol}
      maxInitials={2}
      round
      src={data || ''}
      size={size || '24px'}
      textSizeRatio={textSizeRatio || 3}
    />
  );
};
export default TokenAvatar;
