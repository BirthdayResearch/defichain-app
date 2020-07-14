import React, { useEffect, useState } from 'react';
import Console from 'react-console-component';
import _ from 'lodash';
import { connect } from 'react-redux';
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

interface EchoConsoleProps {
  fetchDataForQueryRequest: (query: string) => void;
  resetDataForQuery: () => void;
  storeCliLog: (logState: any) => void;
  cliLog: any;
  isLoading: boolean;
  result: object | string | number | any[];
  isError: string;
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
  } = props;
  const [showConsoleResults, setShowConsoleResults] = useState(false);
  let currentRef: Console;
  const echo = (text: string) => {
    if (!!currentRef) {
      if (text === 'clear') {
        return currentRef.setState({
          acceptInput: true,
          log: [],
        });
      }
      if (!showConsoleResults) setShowConsoleResults(true);
      return fetchDataForQueryRequest(text);
    }
  };
  useEffect(() => {
    resetDataForQuery();
    if (currentRef.state && !_.isEmpty(cliLog)) {
      currentRef.setState({
        log: [...cliLog.log],
        history: [...cliLog.history],
      });
      currentRef.scrollSemaphore = cliLog.scrollSemaphore;
    }
  }, []);

  const printToConsole = (text: string) => {
    if (!!currentRef && !!text && showConsoleResults) {
      const updatedText = text.replace(BITCOIN_CLI_REGEX, DEFI_CLI_TEXT);
      currentRef.log(updatedText);
      currentRef.return();
      const { log, history } = currentRef.state;
      const updatedState = _.cloneDeep({
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
        welcomeMessage={CONSOLE_PROMPT_LABEL}
        autofocus={true}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  const {
    cli: { isLoading, result, isError, cliLog },
  } = state;
  return {
    isLoading,
    result,
    isError,
    cliLog,
  };
};
const mapDispatchToProps = {
  fetchDataForQueryRequest: (query: string) =>
    fetchDataForQueryRequest({ query }),
  resetDataForQuery,
  storeCliLog: (logState: any) => storeCliLog(logState),
};

export default connect(mapStateToProps, mapDispatchToProps)(EchoConsole);
