import {
  Web5jsDevelopmentBrowserLogger,
  Web5jsDevelopmentLogger,
  Web5jsProductionLogger,
  Web5jsQuietLogger,
} from '../service/logger'
import { Web5jsConfig } from '../service/web5js'

export const LoggerUtils = {
  setLoggerForEnv: (config: Web5jsConfig, isDevelopment: boolean, isBrowser: boolean) => {
    if (config.quiet) config.logger = new Web5jsQuietLogger()
    config.logger ??= LoggerUtils.getDefaultLogger(isDevelopment, isBrowser)
  },

  // TODO: make this tree shakeable
  getDefaultLogger: (isDevelopment: boolean, isBrowser: boolean) => {
    if (!isDevelopment && !isBrowser) return new Web5jsProductionLogger()
    if (isBrowser) return new Web5jsDevelopmentBrowserLogger()
    return new Web5jsDevelopmentLogger()
  },
}
