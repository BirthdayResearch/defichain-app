import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { RouteComponentProps } from 'react-router-dom';
import SyncStatus from '../components/SyncStatus/SyncStatus';
import Sidebar from '../containers/Sidebar';
import { getRpcConfigsRequest } from '../containers/RpcConfiguration/reducer';
import initMenuIpcRenderers from './menu.ipcRenderer';
import isElectron from 'is-electron';
import routes from '../routes';
import './App.scss';

interface AppState {
  prevDepth: number;
}

interface AppProps extends RouteComponentProps {
  isRunning: boolean;
  getRpcConfigsRequest: () => void;
}

class App extends Component<AppProps, AppState> {
  constructor(props: Readonly<AppProps>) {
    super(props);
    props.getRpcConfigsRequest();
    if (isElectron()) {
      initMenuIpcRenderers();
    }
  }

  getPathDepth = (location: any): number => {
    return (location || {}).pathname.split('/').length;
  };

  state = {
    prevDepth: this.getPathDepth(this.props.location),
  };

  determineTransition = () => {
    const depth = this.getPathDepth(this.props.location) - this.state.prevDepth;

    if (depth < 0) {
      return ['transit-pop', 300];
    } else if (depth > 0) {
      return ['transit-push', 300];
    } else {
      return ['transit-fade', 30];
    }
  };

  componentWillReceiveProps() {
    this.setState({
      prevDepth: this.getPathDepth(this.props.location),
    });
  }

  render() {
    const { isRunning } = this.props;

    if (!isRunning) {
      return <div>Wait for loading node</div>;
    }

    return (
      <div id='app'>
        <Helmet>
          <title>DeFi Blockchain Client</title>
        </Helmet>
        <Sidebar />
        <main>
          <SyncStatus />
          <TransitionGroup
            className='transition-group'
            childFactory={child =>
              React.cloneElement(child, {
                classNames: this.determineTransition()[0],
                timeout: this.determineTransition()[1],
              })
            }
          >
            <CSSTransition timeout={300} key={this.props.location.key}>
              {routes(this.props.location)}
            </CSSTransition>
          </TransitionGroup>
        </main>
      </div>
    );
  }
}

const mapStateToProps = ({ app }) => ({
  isRunning: app.isRunning,
});

const mapDispatchToProps = { getRpcConfigsRequest };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
