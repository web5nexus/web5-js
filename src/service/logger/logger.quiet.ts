import { Logger } from './logger.types'

export class Web5jsQuietLogger implements Logger {
  trace(...args: unknown[]): void {
    void args
  }

  debug(...args: unknown[]): void {
    void args
  }

  info(...args: unknown[]): void {
    void args
  }

  warn(...args: unknown[]): void {
    void args
  }

  error(...args: unknown[]): void {
    void args
  }
}
