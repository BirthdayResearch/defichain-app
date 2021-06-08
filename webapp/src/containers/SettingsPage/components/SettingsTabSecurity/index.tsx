import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TabPane, Row, Col, Form, FormGroup, Button } from 'reactstrap';
import { I18n } from 'react-redux-i18n';

import SettingsRowDropDown from '../SettingsRowDropDown';
import { SettingsTabs } from '../SettingsTabHeader';
import { NavLink } from 'react-router-dom';
import { SETTINGS_CHANGE_PASSPHRASE } from '../../../../constants';
import { TimeoutLabel, TimeoutLockEnum } from '../../types';
import styles from './settingsTabSecurity.module.scss';
import { hasAnyMasternodeEnabled } from '../../../MasternodesPage/service';
import { setLockoutTimeList } from '../../reducer';
import { RootState } from 'src/app/rootTypes';

const getMins = (time: number) => {
  return time / TimeoutLockEnum.ONE_MINUTE;
};

export const getTimeoutLockList = (): TimeoutLabel[] => {
  return Object.keys(TimeoutLockEnum)
    .filter((x) => TimeoutLockEnum[x] <= TimeoutLockEnum.ONE_HOUR)
    .map((x) => {
      const value = TimeoutLockEnum[x];
      const i18nKey = 'containers.settings.minute' + (value === 60 ? '' : 's');
      const label = I18n.t(i18nKey, { time: getMins(value) });
      return {
        label,
        value,
      };
    });
};

export const MaxTimeout = {
  label: I18n.t('containers.settings.years', {
    time: 3,
  }),
  value: TimeoutLockEnum.MAX_TIME,
};

interface SettingsTabSecurityProps {
  setTimeoutValue: (data: any) => void;
  timeoutValue: number;
}

const SettingsTabSecurity: React.FunctionComponent<SettingsTabSecurityProps> = (
  props: SettingsTabSecurityProps
) => {
  const { setTimeoutValue, timeoutValue } = props;
  const dispatch = useDispatch();
  const { lockTimeoutList } = useSelector((state: RootState) => state.settings);
  const { myMasternodes } = useSelector(
    (state: RootState) => state.masterNodes
  );
  const { locale } = useSelector(
    (state: any) => state.i18n
  );
  const [timeoutLockList, setTimeoutLockList] = useState<TimeoutLabel[]>([]);

  const [timeOutCloneValue, setTimeOutCloneValue] = useState(timeoutValue);
  const handleDropDowns = (data: number) => {
    setTimeoutValue(data);
    setTimeOutCloneValue(data);
  };

  const hasMasterNodes = (): boolean => {
    return hasAnyMasternodeEnabled(myMasternodes);
  };

  useEffect(() => {
    setTimeoutLockList([...getTimeoutLockList()]);
  }, [locale]);

  useEffect(() => {
    if (hasMasterNodes()) {
      setTimeoutLockList([...getTimeoutLockList(), { ...MaxTimeout }]);
      setTimeOutCloneValue(MaxTimeout.value);
    }
  }, [myMasternodes]);

  useEffect(() => {
    dispatch(setLockoutTimeList(lockTimeoutList));
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
                field={timeOutCloneValue}
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
