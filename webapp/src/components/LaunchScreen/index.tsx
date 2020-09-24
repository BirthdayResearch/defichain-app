import React from 'react';
import style from './LaunchScreen.module.scss';
import Loader from '../Loader';
import LaunchLogo from '../Svg/Launch';
import { PACKAGE_VERSION, APP_TITLE } from '../../constants';

interface LaunchScreenProps {
  message?: string;
  isLoading?: boolean;
  isRestart?: boolean;
}

const LaunchScreen: React.FunctionComponent<LaunchScreenProps> = (
  props: LaunchScreenProps
) => {
  const { message, isLoading, isRestart } = props;
  return (
    <div className={style.launchWrapper}>
      <div className={style.launchView}>
        <LaunchLogo />
        <label className={style.appTitle}>{APP_TITLE}</label>
        <label className={style.subAppVersion}>{`v${PACKAGE_VERSION}`}</label>
        {!isRestart && <label>{message}</label>}
        {(isLoading || isRestart) && <Loader size={28} className='mt-5' />}
      </div>
    </div>
  );
};

export default LaunchScreen;
