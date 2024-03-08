import { Token } from 'typedi'
import { Logger } from '../service/logger/logger.types'
import { Web5jsConfig } from '../service/web5js/web5js.dto'

export const CONFIG = new Token<Web5jsConfig>('WEB5JS_CONFIG')
export const LOGGER = new Token<Logger>('WEB5JS_LOGGER')
