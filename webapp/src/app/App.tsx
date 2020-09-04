import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { RouteComponentProps } from 'react-router-dom';
import errorModelStyles from '../containers/ErrorModal/errorModal.module.scss';
import './App.scss'; // INFO: do not move down, placed on purpose
import Sidebar from '../containers/Sidebar';
import { getRpcConfigsRequest } from '../containers/RpcConfiguration/reducer';
import ErrorModal from '../containers/ErrorModal';
import { Modal, ModalBody } from 'reactstrap';
import routes from '../routes';
import LaunchScreen from '../components/LaunchScreen';

interface AppProps extends RouteComponentProps {
  isRunning: boolean;
  getRpcConfigsRequest: () => void;
  isErrorModalOpen: boolean;
  nodeError: string;
  isFetching: boolean;
}

const getPathDepth = (location: any): number => {
  return (location || {}).pathname.split('/').length;
};

const determineTransition = (location, prevDepth) => {
  const depth = getPathDepth(location) - prevDepth;

  if (depth < 0) {
    return ['transit-pop', 300];
  } else if (depth > 0) {
    return ['transit-push', 300];
  } else {
    return ['transit-fade', 30];
  }
};

const App: React.FunctionComponent<AppProps> = (props: AppProps) => {
  const prevDepth = useRef(getPathDepth(props.location));

  useEffect(() => {
    props.getRpcConfigsRequest();
  }, []);

  useEffect(() => {
    prevDepth.current = getPathDepth(props.location);
  });

  const transition = determineTransition(props.location, prevDepth.current);

  return props.isRunning ? (
    <div
      id='app'
      className={props.isErrorModalOpen ? errorModelStyles.openErrorModal : ''}
    >
      <Helmet>
        <title>DeFi Blockchain Client</title>
      </Helmet>
      <Sidebar />
      <main>
        <TransitionGroup
          className='transition-group'
          childFactory={(child) =>
            React.cloneElement(child, {
              classNames: transition[0],
              timeout: transition[1],
            })
          }
        >
          <CSSTransition timeout={300} key={props.location.key}>
            {routes(props.location)}
          </CSSTransition>
        </TransitionGroup>
      </main>
      <Modal
        isOpen={props.isErrorModalOpen}
        centered
        contentClassName={errorModelStyles.onContentModal}
      >
        <ModalBody>
          <ErrorModal />
        </ModalBody>
      </Modal>
    </div>
  ) : (
    <LaunchScreen message={props.nodeError} isLoading={props.isFetching} />
  );
};

const mapStateToProps = ({ app, errorModal }) => ({
  isRunning: app.isRunning,
  nodeError: app.nodeError,
  isErrorModalOpen: errorModal.isOpen,
  isFetching: app.isFetching,
});

const mapDispatchToProps = { getRpcConfigsRequest };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
