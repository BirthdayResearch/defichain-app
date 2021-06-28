import { program } from 'commander';
import { LogLevelDesc } from 'loglevel';

interface Options {
  debug: boolean;
  logLevel: LogLevelDesc;
}

function parseOptions(): Options {
  program
    .option('-l, --logLevel <level>', 'Log level (debug, silent.. etc)', 'info')
    .option('-d, --debug <boolean>', 'Debug flag', false)
    .parse(process.argv);
  return program.opts() as Options;
}

export { Options, parseOptions };
