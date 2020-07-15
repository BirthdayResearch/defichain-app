import React from 'react';
import { Button } from 'reactstrap';
import Copy from 'react-copy-to-clipboard';
import { MdContentCopy } from 'react-icons/md';

interface CopyToClipboardProps {
  value: string;
  size?: string;
  link?: string;
  class?: string;
  handleCopy: () => void;
}

const CopyToClipboard: React.FunctionComponent<CopyToClipboardProps> = (
  props: CopyToClipboardProps
) => {
  return (
    <Copy text={props.value!}>
      <Button
        color={props.link || 'link'}
        size={props.size || 'sm'}
        className={props.class || 'padless ml-2'}
        onClick={props.handleCopy}
      >
        <MdContentCopy />
      </Button>
    </Copy>
  );
};

export default CopyToClipboard;
