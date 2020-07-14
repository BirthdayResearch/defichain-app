import React, { useState } from 'react';
import { Button, Popover, PopoverBody } from 'reactstrap';
import QRCode from 'qrcode.react';
import { AiOutlineQrcode } from 'react-icons/ai';

interface QrCodeProps {
  value: string | undefined;
  uid: string;
  qrClass: string;
}

const QrCode: React.FunctionComponent<QrCodeProps> = (props: QrCodeProps) => {
  const [qrOpen, toggleQR] = useState(false);

  return (
    <>
      <Button
        color='link'
        size='sm'
        className='padless ml-2'
        id={props.uid}
        onClick={e => e.currentTarget.focus()} // Need for Popover trigger="focus" to work
      >
        <AiOutlineQrcode />
      </Button>
      <Popover
        placement='auto'
        isOpen={qrOpen}
        target={props.uid}
        toggle={() => toggleQR(!qrOpen)}
        trigger='focus'
      >
        <PopoverBody>
          <QRCode value={props.value} size={240} className={props.qrClass} />
        </PopoverBody>
      </Popover>
    </>
  );
};

export default QrCode;
