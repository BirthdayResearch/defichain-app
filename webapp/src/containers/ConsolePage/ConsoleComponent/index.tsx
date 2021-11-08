import React, { useEffect, useState } from 'react';
import Console from 'react-console-component';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import { connect, useSelector } from 'react-redux';
import {
  fetchDataForQueryRequest,
  resetDataForQuery,
  storeCliLog,
} from '../reducer';
import {
  CONSOLE_PROMPT_LABEL,
  BITCOIN_CLI_REGEX,
  DEFI_CLI_TEXT,
} from '../../../constants';
import './console.scss';
import { WalletMap } from '@defi_types/walletMap';
import { RootState } from '../../../app/rootTypes';

interface EchoConsoleProps {
  fetchDataForQueryRequest: (query: string) => void;
  resetDataForQuery: () => void;
  storeCliLog: (logState: any) => void;
  cliLog: any;
  isLoading: boolean;
  result: string | number | any[];
  isError: string;
  walletMap: WalletMap;
}

const EchoConsole: React.FunctionComponent<EchoConsoleProps> = (
  props: EchoConsoleProps
) => {
  const {
    fetchDataForQueryRequest,
    resetDataForQuery,
    storeCliLog,
    isLoading,
    result,
    isError,
    cliLog,
    walletMap,
  } = props;
  const { nodeVersion } = useSelector((state: RootState) => state.app);
  const [showConsoleResults, setShowConsoleResults] = useState(false);
  let currentRef: Console;
  const echo = (text: string) => {
    if (!!currentRef) {
      if (text === 'clear') {
        currentRef.setState({
          acceptInput: true,
          log: [],
        });
        return storeCliLog(
          cloneDeep({
            history: currentRef.state.history,
          })
        );
      }
      if (!showConsoleResults) setShowConsoleResults(true);
      return fetchDataForQueryRequest(text);
    }
  };
  useEffect(() => {
    resetDataForQuery();
    if (currentRef.state && !isEmpty(cliLog)) {
      const updatedState = {
        log: [],
        history: [],
      };

      if (Array.isArray(cliLog.log) && cliLog.log.length > 0) {
        updatedState.log = cloneDeep(cliLog.log);
      }

      if (Array.isArray(cliLog.history) && cliLog.history.length > 0) {
        updatedState.history = cloneDeep(cliLog.history);
      }

      currentRef.setState(updatedState);
      if (cliLog.scrollSemaphore) {
        currentRef.scrollSemaphore = cliLog.scrollSemaphore;
      }
    }
  }, []);

  const printToConsole = (text: string) => {
    if (!!currentRef && !!text && showConsoleResults) {
      const updatedText = text.replace(BITCOIN_CLI_REGEX, DEFI_CLI_TEXT);
      currentRef.log(updatedText);
      currentRef.return();
      const { log, history } = currentRef.state;
      const updatedState = cloneDeep({
        log,
        history,
        scrollSemaphore: currentRef.scrollSemaphore,
      });
      storeCliLog(updatedState);
    }
  };

  const onPasteHandler = (e) => {
    if (!!currentRef) {
      currentRef.paste(e);
    }
  };

  useEffect(() => {
    let toPrintData;
    if (!isLoading) {
      if (!isError) {
        if (result !== undefined) {
          toPrintData = JSON.stringify(result, null, 2);
          if (typeof result === 'string') {
            toPrintData = result;
          }
        }
      } else {
        toPrintData = isError;
      }
      printToConsole(toPrintData);
    }
  }, [isLoading, result, isError]);

  const onFocusHandler = () => {
    return !!currentRef && currentRef.focus();
  };

  const onScrollHandler = () => {
    return !!currentRef && currentRef.scrollIfBottom();
  };

  const nv = nodeVersion ?? (walletMap?.nodeVersion ? `${walletMap.nodeVersion}` : '')

  return (
    <div
      onPaste={onPasteHandler}
      onFocus={onFocusHandler}
      onScroll={onScrollHandler}
    >
      <Console
        ref={(ref: Console) => (currentRef = ref)}
        handler={echo}
        promptLabel=''
        welcomeMessage={`${CONSOLE_PROMPT_LABEL}${
          nv
        }`}
        autofocus={true}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  const {
    cli: { isLoading, result, isError, cliLog },
    wallet: { walletMap },
  } = state;
  return {
    isLoading,
    result,
    isError,
    cliLog,
    walletMap,
  };
};
const mapDispatchToProps = {
  fetchDataForQueryRequest: (query: string) =>
    fetchDataForQueryRequest({ query }),
  resetDataForQuery,
  storeCliLog: (logState: any) => storeCliLog(logState),
};

export default connect(mapStateToProps, mapDispatchToProps)(EchoConsole);
