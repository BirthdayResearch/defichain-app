import React from 'react';
import { connect } from 'react-redux';
import { Button, Row, Col } from 'reactstrap';
import {
  closeUpdateApp,
  closePostUpdate,
  closeUpdateAvailable,
} from '../reducer';
import { UPDATE_MODAL_CLOSE_TIMEOUT } from '../../../constants';
import ErrorComponent from './ErrorComponent';
import ShowUpdateAvailableComponent from './ShowUpdateAvailable';
import PostUpdateComponent from './PostUpdateComponent';
import DownloadProgressComponent from './DownloadProgressComponent';

interface UpdateModalProps {
  isUpdateError: string;
  postUpdateFlag: boolean;
  showUpdateAvailable: boolean;
  isUpdateStarted: boolean;
  closeUpdateApp: () => void;
}

const UpdateModal: React.FunctionComponent<UpdateModalProps> = (
  props: UpdateModalProps
) => {
  const {
    showUpdateAvailable,
    postUpdateFlag,
    isUpdateStarted,
    isUpdateError,
    closeUpdateApp,
  } = props;

  const closeModal = (fn) => {
    closeUpdateApp();
    setTimeout(fn, UPDATE_MODAL_CLOSE_TIMEOUT);
  };

  const loadHtml = () => {
    if (isUpdateError) return <ErrorComponent />;

    if (showUpdateAvailable)
      return <ShowUpdateAvailableComponent closeModal={closeModal} />;

    if (postUpdateFlag) return <PostUpdateComponent closeModal={closeModal} />;

    if (isUpdateStarted) return <DownloadProgressComponent />;

    return <div />;
  };
  return (
    <Row>
      {isUpdateStarted && (
        <Col xs={12}>
          <div className='float-right'>
            <Button size='xs' onClick={closeUpdateApp} color='link'>
              _
            </Button>
          </div>
        </Col>
      )}
      <Col xs={12}>{loadHtml()}</Col>
    </Row>
  );
};

const mapStateToProps = (state) => {
  const {
    isUpdateError,
    updateAppinfo,
    postUpdateFlag,
    showUpdateAvailable,
    isUpdateStarted,
  } = state.popover;
  return {
    isUpdateError,
    postUpdateFlag,
    showUpdateAvailable,
    isUpdateStarted,
  };
};

const mapDispatchToProps = {
  closeUpdateApp,
  closePostUpdate,
  closeUpdateAvailable,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateModal);
