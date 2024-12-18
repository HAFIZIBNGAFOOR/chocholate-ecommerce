/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import * as Log4js from 'log4js';
import safeStringify from 'fast-safe-stringify';

const config = {
  appenders: {
    access: {
      type: 'dateFile',
      filename: 'logs/access/access.json',
      layout: { type: 'json', separator: ',' },
    },
    error: {
      type: 'dateFile',
      filename: 'logs/error/error.json',
      layout: { type: 'json', separator: ',' },
    },
    system: {
      type: 'dateFile',
      filename: 'logs/system/system.json',
      layout: { type: 'json', separator: ',' },
    },
    console: {
      type: 'console',
    },
    stdout: {
      type: 'stdout',
    },
  },
  categories: {
    default: {
      appenders: ['access', 'console'],
      level: 'INFO',
      enableCallStack: true,
    },
    access: {
      appenders: ['access', 'console'],
      level: 'INFO',
      enableCallStack: true,
    },
    system: {
      appenders: ['system', 'console'],
      level: 'ALL',
      enableCallStack: true,
    },
    error: {
      appenders: ['error', 'console'],
      level: 'WARN',
      enableCallStack: true,
    },
  },
};

export class Logger {
  public static initialize() {
    Log4js.addLayout('json', (config) => {
      return (logEvent) => safeStringify(logEvent) + config.separator;
    });
    Log4js.configure(config);
  }

  public static access() {
    const logger = Log4js.getLogger('access');

    return Log4js.connectLogger(logger, {});
  }

  public static info(message: any) {
    const logger = Log4js.getLogger('system');
    console.info(message);
  }

  public static warn(message: any) {
    const logger = Log4js.getLogger('warn');
    console.warn(message);
  }

  public static error(message: any) {
    const logger = Log4js.getLogger('error');
    console.error(message);
  }
}
