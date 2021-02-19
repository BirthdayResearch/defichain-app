import React, { useEffect } from 'react';
import { TabPane, Row, Col, Form, FormGroup, Button } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import { useDispatch, useSelector } from 'react-redux';

import SettingsRowDropDown from '../SettingsRowDropDown';
import { SettingsTabs } from '../SettingsTabHeader';
import { NavLink } from 'react-router-dom';
import { SETTINGS_CHANGE_PASSPHRASE } from '../../../../constants';
import {
  setDefaultLockTimeout,
  setLockoutTimeList,
  TimeoutLockEnum,
} from '../../reducer';

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

const SettingsTabSecurity: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { lockTimeoutList, defaultLockTimeout } = useSelector(
    (state: any) => state.settings
  );

  const handleDropDowns = (data: number) => {
    dispatch(setDefaultLockTimeout(data));
  };

  useEffect(() => {
    dispatch(setLockoutTimeList(TimeoutLockList));
  }, []);

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
                data={lockTimeoutList}
                field={defaultLockTimeout}
                handleDropDowns={handleDropDowns}
                fieldName={'autoLock'}
              />
            </Col>
          </Row>
        </Form>
      </section>
    </TabPane>
  );
};

export default SettingsTabSecurity;
