import { LogLevel, Logger } from './logger.types'

interface Web5jsProductionLoggerOptions {
  level: LogLevel
}

const DEFAULT_PRODUCTION_OPTIONS: Web5jsProductionLoggerOptions = {
  level: LogLevel.INFO,
}

export class Web5jsProductionLogger implements Logger {
  private readonly logger = console
  private readonly options: Web5jsProductionLoggerOptions

  constructor(options: Partial<Web5jsProductionLoggerOptions> = {}) {
    this.options = { ...DEFAULT_PRODUCTION_OPTIONS, ...options }
  }

  trace(...args: unknown[]): void {
    if (this.options.level > LogLevel.TRACE) return
    this.logger.trace(...args)
  }

  debug(...args: unknown[]): void {
    if (this.options.level > LogLevel.DEBUG) return
    this.logger.debug(...args)
  }

  info(...args: unknown[]): void {
    if (this.options.level > LogLevel.INFO) return
    this.logger.info(...args)
  }

  warn(...args: unknown[]): void {
    if (this.options.level > LogLevel.WARN) return
    this.logger.warn(...args)
  }

  error(...args: unknown[]): void {
    if (this.options.level > LogLevel.ERROR) return
    this.logger.error(...args)
  }
}
