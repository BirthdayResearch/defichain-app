import React from 'react';
import style from './LaunchScreen.module.scss';
import Loader from '../Loader';
import LaunchLogo from '../Svg/Launch';
import { PACKAGE_VERSION, APP_TITLE } from '../../constants';
import { I18n } from 'react-redux-i18n';

interface LaunchScreenProps {
  message?: string;
  isLoading?: boolean;
  isRestart?: boolean;
  isAppClosing?: boolean;
}

const LaunchScreen: React.FunctionComponent<LaunchScreenProps> = (
  props: LaunchScreenProps
) => {
  const { message, isLoading, isRestart, isAppClosing } = props;
  return (
    <div className={style.launchWrapper}>
      <div className={style.launchView}>
        <LaunchLogo />
        {isAppClosing ? (
          <>
            <label className={style.appTitle}>
              <div>{I18n.t('general.quitingApp')}</div>
              <div>{I18n.t('general.doNotCloseWindow')}</div>
            </label>
          </>
        ) : (
          <>
            <label className={style.appTitle}>{APP_TITLE}</label>
            <label
              className={style.subAppVersion}
            >{`v${PACKAGE_VERSION}`}</label>
            {!isRestart && <label>{message}</label>}
          </>
        )}
        {(isLoading || isRestart) && <Loader size={28} className='mt-5' />}
      </div>
    </div>
  );
};

export default LaunchScreen;
