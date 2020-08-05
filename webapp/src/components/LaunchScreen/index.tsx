import React from 'react';
import style from './LaunchScreen.module.scss';
import Loader from '../Loader';
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
        <Loader size={28} className='mt-5' />
      </div>
    </div>
  );
};

export default LaunchScreen;
