import React, { useEffect, useState } from 'react';
import { TabPane, Row, Col, Form, FormGroup, Button } from 'reactstrap';
import { I18n } from 'react-redux-i18n';

import SettingsRowDropDown from '../SettingsRowDropDown';
import { SettingsTabs } from '../SettingsTabHeader';
import { NavLink } from 'react-router-dom';
import { SETTINGS_CHANGE_PASSPHRASE } from '../../../../constants';
import { TimeoutLockEnum } from '../../types';
import styles from './settingsTabSecurity.module.scss';
import { hasAnyMasternodeEnabled } from '../../../MasternodesPage/service';

const timeoutLabel = 'containers.settings.minutes';

const getMins = (time: number) => {
  return time / TimeoutLockEnum.ONE_MINUTE;
};

export const TimeoutLockList = [
  {
    label: I18n.t('containers.settings.minute', {
      time: getMins(TimeoutLockEnum.ONE_MINUTE),
    }),
    value: TimeoutLockEnum.ONE_MINUTE,
  },
  {
    label: I18n.t(timeoutLabel, {
      time: getMins(TimeoutLockEnum.THREE_MINUTES),
    }),
    value: TimeoutLockEnum.THREE_MINUTES,
  },
  {
    label: I18n.t(timeoutLabel, {
      time: getMins(TimeoutLockEnum.FIVE_MINUTES),
    }),
    value: TimeoutLockEnum.FIVE_MINUTES,
  },
  {
    label: I18n.t(timeoutLabel, {
      time: getMins(TimeoutLockEnum.TEN_MINUTES),
    }),
    value: TimeoutLockEnum.TEN_MINUTES,
  },
];

export const MaxTimeout = {
  label: I18n.t('containers.settings.years', {
    time: 3,
  }),
  value: TimeoutLockEnum.MAX_TIME,
};

interface SettingsTabSecurityProps {
  setTimeoutValue: (data: any) => void;
  setTimeoutLockList: (data: any) => void;
  setLockoutTimeList: (data: any) => void;
  setDefaultLockTimeout: (data: any) => void;
  myMasternodes: any;
  lockTimeoutList: any;
  timeoutLockList: any;
  timeoutValue: any;
}

const SettingsTabSecurity: React.FunctionComponent = (
  props: SettingsTabSecurityProps
) => {
  const {
    setTimeoutValue,
    myMasternodes,
    setTimeoutLockList,
    lockTimeoutList,
    setLockoutTimeList,
    timeoutLockList,
    timeoutValue,
    setDefaultLockTimeout,
  } = props;
  const handleDropDowns = (data: number) => {
    setTimeoutValue(data);
    setDefaultLockTimeout(data);
  };

  const hasMasterNodes = (): boolean => {
    return hasAnyMasternodeEnabled(myMasternodes);
  };

  useEffect(() => {
    if (hasMasterNodes()) {
      setTimeoutLockList([...TimeoutLockList, { ...MaxTimeout }]);
      setTimeoutValue(MaxTimeout.value);
    }
  }, [myMasternodes?.length]);

  useEffect(() => {
    setLockoutTimeList(lockTimeoutList);
  }, [lockTimeoutList.length]);

  return (
    <TabPane tabId={SettingsTabs.security}>
      <section>
        <Form>
          <Row>
            <Col md='12'>
              <FormGroup className='form-row align-items-center'>
                <Col md='4'></Col>
                <Col md='8'>
                  <Button
                    color='link'
                    to={SETTINGS_CHANGE_PASSPHRASE}
                    tag={NavLink}
                    className='text-uppercase pl-0'
                    size='md'
                  >
                    {I18n.t('containers.settings.changePassphrase')}
                  </Button>
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row className='mb-5'>
            <Col md='12'>
              <SettingsRowDropDown
                label={'containers.settings.autoLock'}
                data={timeoutLockList}
                field={timeoutValue}
                handleDropDowns={handleDropDowns}
                fieldName={'autoLock'}
                disabled={hasMasterNodes}
              />
            </Col>
            {hasMasterNodes() && (
              <>
                <Col md='4'></Col>
                <Col md='8' className={styles.smallText}>
                  <small>
                    {I18n.t('containers.settings.autoLockMNWarning')}
                  </small>
                </Col>
              </>
            )}
          </Row>
        </Form>
      </section>
    </TabPane>
  );
};

export default SettingsTabSecurity;
