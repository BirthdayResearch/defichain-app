import React from 'react';
import style from './LaunchScreen.module.scss';
import LaunchLogo from '../Svg/Launch';

interface LaunchScreenProps {
  message?: string;
}

const LaunchScreen: React.FunctionComponent<LaunchScreenProps> = (
  props: LaunchScreenProps
) => {
  return (
    <div className={style.launchWrapper}>
      <div className={style.launchView}>
        <LaunchLogo />
        <label>{props.message}</label>
      </div>
    </div>
  );
};

export default LaunchScreen;
