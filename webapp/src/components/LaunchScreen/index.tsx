import React from 'react';
import style from './LaunchScreen.module.scss';
import { RiLoader4Line } from 'react-icons/ri';
import LaunchLogo from '../Svg/Launch';
import { PACKAGE_VERSION, APP_TITLE } from '../../constants';

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
        <label className={style.appTitle}>{APP_TITLE}</label>
        <label className={style.subAppVersion}>{`v${PACKAGE_VERSION}`}</label>
        <label>{props.message}</label>
        <div className={style.rotationconAnimation}>
          <RiLoader4Line />
        </div>
      </div>
    </div>
  );
};

export default LaunchScreen;
