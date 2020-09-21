import React from 'react';
import { MdInfo } from 'react-icons/md';
import { I18n } from 'react-redux-i18n';
import { Button, ButtonProps } from 'reactstrap';

interface BadgeProps extends ButtonProps {
  baseClass?: string;
  label: string;
}

const Badge: React.FunctionComponent<BadgeProps> = (props: BadgeProps) => {
  return (
    <div className={props.baseClass}>
      <Button className='badge' {...props}>
        <MdInfo />
        <span>{props.label}</span>
      </Button>
    </div>
  );
};

export default Badge;
