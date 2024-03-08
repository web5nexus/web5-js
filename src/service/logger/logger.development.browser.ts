import { EnvUtils } from '../../util/env'
import { LogLevel, Logger } from './logger.types'

interface Web5jsDevelopmentBrowserLoggerOptions {
  welcome: boolean
  level: LogLevel
}

type BrowserFormattedMessage = [template: string, ...styles: string[]]

export class Web5jsDevelopmentBrowserLogger implements Logger {
  private static readonly DISABLE_WELCOME = '__TTM_DISABLE_WELCOME__'
  private static isWelcomeDisabled(): boolean {
    if (!EnvUtils.isBrowser()) return false
    const anyWindow = window as unknown as { __TTM_DISABLE_WELCOME__: boolean }
    return anyWindow[Web5jsDevelopmentBrowserLogger.DISABLE_WELCOME]
  }

  private static disableWelcome(): void {
    if (!EnvUtils.isBrowser()) return
    const anyWindow = window as unknown as { __TTM_DISABLE_WELCOME__: boolean }
    anyWindow[Web5jsDevelopmentBrowserLogger.DISABLE_WELCOME] = true
  }

  private readonly options: Web5jsDevelopmentBrowserLoggerOptions
  private readonly logger = console

  private readonly _DEBUG: BrowserFormattedMessage = ['%c Debug %c ', bgGray, initial]
  private readonly _INFO: BrowserFormattedMessage = ['%c Info %c ', bgBlue, initial]
  private readonly _WARN: BrowserFormattedMessage = ['%c Warn %c ', bgYellowStrong, initial]
  private readonly _ERROR: BrowserFormattedMessage = ['%c Error %c ', bgRedStrong, initial]
  private readonly _WEB5JS: BrowserFormattedMessage = ['%c Web5js %c ', bgGradient, initial]

  constructor(options: Partial<Web5jsDevelopmentBrowserLoggerOptions> = {}) {
    const defaultOptions: Web5jsDevelopmentBrowserLoggerOptions = {
      welcome: EnvUtils.isDevelopment() && !Web5jsDevelopmentBrowserLogger.isWelcomeDisabled(),
      level: LogLevel.INFO,
    }

    this.options = { ...defaultOptions, ...options }

    if (this.options.welcome) {
      this.welcome()
      Web5jsDevelopmentBrowserLogger.disableWelcome()
    }
  }

  private join(...messages: BrowserFormattedMessage[]): BrowserFormattedMessage {
    return messages.reduce(
      (acc, curr) => {
        acc[0] += curr[0]
        acc.push(...curr.slice(1))
        return acc
      },
      [''],
    )
  }

  private welcome(): void {
    this.logger.log(
      ...this.join(this._WEB5JS, WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)]),
    )
  }

  trace(...args: unknown[]): void {
    if (this.options.level > LogLevel.TRACE) return
    this.logger.trace(...args)
  }

  debug(...args: unknown[]): void {
    if (this.options.level > LogLevel.DEBUG) return
    this.logger.debug(...this._DEBUG, ...args)
  }

  info(...args: unknown[]): void {
    if (this.options.level > LogLevel.INFO) return
    this.logger.info(...this._INFO, ...args)
  }

  warn(...args: unknown[]): void {
    if (this.options.level > LogLevel.WARN) return
    this.logger.warn(...this._WARN, ...args)
  }

  error(...args: unknown[]): void {
    if (this.options.level > LogLevel.ERROR) return
    this.logger.error(...this._ERROR, ...args)
  }
}

const bgGradient =
  'color: white; font-weight: bold; background-image: linear-gradient(126deg,#513bff 9%,#89ffca 97%);'

const initial = 'color: inherit; font-weight: inherit;'
const initialStrong = 'color: inherit; font-weight: bold;'
const green = 'color: rgb(137, 255, 202);'

const bgRedStrong = 'color: white; background-color: rgb(238, 52, 52); font-weight: bold;'
const bgYellowStrong = 'color: white; background-color: rgb(255, 140, 0); font-weight: bold;'
const bgBlue = 'color: white; background-color: rgb(81, 59, 255);'
const bgGray = 'color: white; background-color: rgb(158, 158, 158);'

const WELCOME = 'Hi! 👋 Welcome to Web5js, the Javascript SDK for Web3.'

const BOLD = [initialStrong, initial]

const WELCOME_MESSAGES: BrowserFormattedMessage[] = [
  [
    `%c${WELCOME}%c\nVisit our docs to see how Web5js will help you launch projects fast: https://docs.web5.nexus`,
    ...BOLD,
  ],
  [`%c${WELCOME}%c\nKick start by making your first RPC call: https://docs.web5.nexus`, ...BOLD],
  [`%c${WELCOME}%c\nSee what apps you can build with Web5js: https://docs.web5.nexus`, ...BOLD],
  [
    `%c${WELCOME}%c\n%cFREE Testnet Tokens%c: Explore %cWeb5js Faucets%c available for over 5 chains: https://docs.web5.nexus`,
    ...BOLD,
    ...BOLD,
    green,
    initial,
  ],
]
