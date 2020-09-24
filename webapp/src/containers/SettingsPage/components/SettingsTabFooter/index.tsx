import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Button, Row, Col } from 'reactstrap';

interface SettingsTabsFooterProps {
  saveChanges: () => void;
  isUnsavedChanges: boolean;
}

const SettingsTabsFooter = (props: SettingsTabsFooterProps) => {
  const { saveChanges, isUnsavedChanges } = props;

  return (
    <footer className='footer-bar'>
      <Row className='justify-content-between align-items-center'>
        <Col className='col-auto'>
          {isUnsavedChanges && I18n.t('containers.settings.unsavedChanges')}
        </Col>
        <Col className='d-flex justify-content-end'>
          <Button
            disabled={!isUnsavedChanges}
            onClick={saveChanges}
            color='primary'
          >
            {I18n.t('containers.settings.saveSettings')}
          </Button>
        </Col>
      </Row>
    </footer>
  );
};

export default SettingsTabsFooter;
