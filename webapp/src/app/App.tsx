import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { RouteComponentProps } from 'react-router-dom';
import './App.scss'; // INFO: do not move down, placed on purpose
import Sidebar from '../containers/Sidebar';
import { getRpcConfigsRequest } from '../containers/RpcConfiguration/reducer';
import ErrorModal from '../containers/PopOver/ErrorModal';
import routes from '../routes';
import LaunchScreen from '../components/LaunchScreen';
import ReIndexModel from '../containers/PopOver/ReIndexModel';
import BackupWalletWarningModel from '../containers/PopOver/BackupWalletWarningModel';
import Popover from '../containers/PopOver';

interface AppProps extends RouteComponentProps {
  isRunning: boolean;
  getRpcConfigsRequest: () => void;
  nodeError: string;
  isFetching: boolean;
  isRestart: boolean;
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
  const {
    location,
    getRpcConfigsRequest,
    isRunning,
    nodeError,
    isFetching,
    isRestart,
  } = props;

  const prevDepth = useRef(getPathDepth(location));

  useEffect(() => {
    getRpcConfigsRequest();
  }, []);

  useEffect(() => {
    prevDepth.current = getPathDepth(location);
  });

  const transition = determineTransition(location, prevDepth.current);

  return (
    <>
      {isRunning ? (
        <div id='app'>
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
              <CSSTransition timeout={300} key={location.key}>
                {routes(location)}
              </CSSTransition>
            </TransitionGroup>
          </main>
          <ErrorModal />
        </div>
      ) : (
        <LaunchScreen
          message={nodeError}
          isLoading={isFetching}
          isRestart={isRestart}
        />
      )}
      <ReIndexModel />
      <BackupWalletWarningModel/>
      <Popover />
    </>
  );
};

const mapStateToProps = ({ app, popover }) => ({
  isRunning: app.isRunning,
  nodeError: app.nodeError,
  isFetching: app.isFetching,
  isRestart: popover.isReIndexRestart,
});

const mapDispatchToProps = { getRpcConfigsRequest };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
