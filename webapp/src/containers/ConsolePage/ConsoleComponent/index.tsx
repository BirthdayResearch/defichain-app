import React from 'react';
import Console from 'react-console-emulator';
import { CONSOLE_PROMPT_LABEL } from '../../../constants';
import './console.scss';

const EchoConsole: React.FunctionComponent = () => {
  const commands = {
    echo: {
      fn: (...args) => args.join(' '),
    },
    help: {
      fn: (...args) => 'Help!!',
    },
  };
  return (
    <Console
      commands={commands}
      promptLabel='>'
      welcomeMessage={CONSOLE_PROMPT_LABEL}
      noDefaults={true}
    />
  );
};

export default EchoConsole;
