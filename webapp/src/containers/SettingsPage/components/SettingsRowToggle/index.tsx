import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import classnames from 'classnames';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';

const SettingsRowToggle = (props) => {
  const { field, fieldName, label, handleToggles, hideMinimized } = props;

  return (
    <FormGroup
      className={`${classnames({
        'd-none': hideMinimized,
      })}`}
    >
      <FormGroup check>
        <Label check className='switch'>
          <Input
            type='checkbox'
            checked={field || false}
            onChange={() => handleToggles(`${fieldName}`)}
          />
          &nbsp;
          {I18n.t(`containers.settings.${label}`)}
        </Label>
      </FormGroup>
    </FormGroup>
  );
};

const mapStateToProps = (state) => {
  const { locale } = state.i18n;
  return {
    locale,
  };
};

export default connect(mapStateToProps)(SettingsRowToggle);
