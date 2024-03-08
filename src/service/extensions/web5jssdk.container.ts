import { ContainerInstance } from 'typedi'
import { CONFIG, LOGGER, Utils } from '../../util'
import { Logger } from '../logger/logger.types'
import { Web5jsConfig } from '../web5js'
import { ServiceConstructor } from './web5jssdk.extensions.dto'

export interface IWeb5jsSdkContainer {
  get<T>(type: ServiceConstructor<T>): T
  getRpc<T>(): T
  getConfig(): Web5jsConfig
  getLogger(): Logger
}

export class Web5jsSdkContainer implements IWeb5jsSdkContainer {
  constructor(private readonly containerInstance: ContainerInstance) {}

  get<T>(type: ServiceConstructor<T>): T {
    return this.containerInstance.get(type)
  }

  getRpc<T>(): T {
    return Utils.getRpc(this.containerInstance.id, this.containerInstance.get(CONFIG))
  }

  getConfig(): Web5jsConfig {
    return this.containerInstance.get(CONFIG)
  }

  getLogger(): Logger {
    return this.containerInstance.get(LOGGER)
  }
}
