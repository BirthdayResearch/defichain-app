import React, { useEffect, useState } from 'react';
import Console from 'react-console-component';
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchDataForQueryRequest, resetDataForQuery } from '../reducer';
import {
  CONSOLE_PROMPT_LABEL,
  BITCOIN_CLI_REGEX,
  DEFI_CLI_TEXT,
} from '../../../constants';
import './console.scss';

interface EchoConsoleProps {
  fetchDataForQueryRequest: (query: string) => void;
  resetDataForQuery: () => void;
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
    isLoading,
    result,
    isError,
  } = props;
  const [showConsoleResults, setShowConsoleResults] = useState(false);
  let currentRef: Console;
  const echo = (text: string) => {
    if (!!currentRef) {
      if (!showConsoleResults) setShowConsoleResults(true);
      fetchDataForQueryRequest(text);
    }
  };
  useEffect(() => {
    resetDataForQuery();
  }, []);

  const printToConsole = (text: string) => {
    if (!!currentRef && !!text && showConsoleResults) {
      const updatedText = text.replace(BITCOIN_CLI_REGEX, DEFI_CLI_TEXT);
      currentRef.log(updatedText);
      currentRef.return();
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
    cli: { isLoading, result, isError },
  } = state;
  return {
    isLoading,
    result,
    isError,
  };
};
const mapDispatchToProps = {
  fetchDataForQueryRequest: (query: string) =>
    fetchDataForQueryRequest({ query }),
  resetDataForQuery,
};

export default connect(mapStateToProps, mapDispatchToProps)(EchoConsole);
