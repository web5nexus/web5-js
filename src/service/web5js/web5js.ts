import { Container, Service } from 'typedi'
import { isLoadBalancerNetwork } from '../../dto'
import { CONFIG, Constant, EnvUtils, LOGGER, LoggerUtils, Utils } from '../../util'
import {
  ExtensionConstructor,
  ExtensionConstructorOrConfig,
  IWeb5jsSdkContainer,
  Web5jsSdkContainer,
  Web5jsSdkExtension,
} from '../extensions'
import { LoadBalancer } from '../rpc/generic/LoadBalancer'
import { MetaMask, WalletProvider } from '../walletProvider'
import { ApiVersion, Web5jsConfig } from './web5js.dto'

/**
 * Works as an entrypoint to interact with extension of choice.
 * @param type - Extension type imported to the SDK instance
 */
export interface IWeb5jsSdkChain {
  extension<T extends Web5jsSdkExtension>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: new (web5jsSdkContainer: IWeb5jsSdkContainer, ...args: any[]) => T,
  ): T
}

export abstract class Web5jsSdkChain implements IWeb5jsSdkChain {
  walletProvider: WalletProvider

  protected constructor(readonly id: string) {
    this.walletProvider = Container.of(id).get(WalletProvider)
  }

  extension<T extends Web5jsSdkExtension>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: new (web5jsSdkContainer: IWeb5jsSdkContainer, ...args: any[]) => T,
  ): T {
    return Container.of(this.id).get(type)
  }

  async destroy(): Promise<void> {
    const config = Container.of(this.id).get(CONFIG)
    for (const extensionConfig of config?.configureExtensions ?? []) {
      await this.destroyExtension(extensionConfig, this.id)
    }

    for (const walletProviderConfig of config?.configureWalletProviders ?? []) {
      await this.destroyExtension(walletProviderConfig, this.id)
    }

    // calls destroy on load balancer
    Container.of(this.id).remove(LoadBalancer)
  }

  private async destroyExtension(extensionConfig: ExtensionConstructorOrConfig, id: string) {
    let type: new (container: IWeb5jsSdkContainer, ...args: unknown[]) => Web5jsSdkExtension

    if ('type' in extensionConfig) {
      type = extensionConfig.type
    } else {
      type = extensionConfig
    }

    await Container.of(id).get(type)?.destroy()
  }
}

@Service({ transient: true })
export class Web5jsSDK {
  /**
   * Initialize Web5js SDK. This method must be called before any other method.
   * Default configuration is used if no configuration is provided.
   * @param config
   */
  public static async init<T extends IWeb5jsSdkChain>(config: Web5jsConfig): Promise<T> {
    const defaultConfig: Partial<Web5jsConfig> = {
      version: ApiVersion.V4,
      retryCount: 1,
      retryDelay: 1000,
      rpc: {
        oneTimeLoadBalancing: false,
        allowedBlocksBehind: Constant.OPEN_RPC.ALLOWED_BLOCKS_BEHIND,
      },
    }

    const mergedConfig = Utils.deepMerge(defaultConfig, config) as Web5jsConfig

    LoggerUtils.setLoggerForEnv(mergedConfig, EnvUtils.isDevelopment(), EnvUtils.isBrowser())

    // TODO: check when rpc is customized if there is allowedBlocksBehind if not throw error or set default
    // TODO: Check if rpc works for other chains and all configurations are set correctly

    const id = Web5jsSDK.generateRandomString()
    Container.of(id).set(CONFIG, mergedConfig)
    Container.of(id).set(LOGGER, mergedConfig.logger)

    if (!mergedConfig.apiKey?.v3 && !mergedConfig.apiKey?.v4) {
      mergedConfig.logger?.warn(
        'API key not provided - only a subset of SDK features will be enabled. Generate an API Key by accessing your Dashboard: https://dashboard.web5.nexus',
      )
    }

    if (isLoadBalancerNetwork(mergedConfig.network)) {
      const loadBalancer = Container.of(id).get(LoadBalancer)
      await loadBalancer.init()
    }

    const containerInstance = new Web5jsSdkContainer(Container.of(id))

    await this.configureExtensions(config, id, containerInstance)
    await this.addBuiltInExtensions(id, containerInstance)

    return Utils.getClient<T>(id, mergedConfig.network)
  }

  private static builtInExtensions: ExtensionConstructor[] = [MetaMask]

  private static async addBuiltInExtensions(id: string, containerInstance: Web5jsSdkContainer) {
    for (const extension of this.builtInExtensions) {
      const instance = new extension(containerInstance)

      if (instance.supportedNetworks.includes(Container.of(id).get(CONFIG).network)) {
        await instance.init()
        Container.of(id).set(extension, instance)
      }
    }
  }

  private static async configureExtensions(
    config: Web5jsConfig,
    id: string,
    containerInstance: Web5jsSdkContainer,
  ) {
    for (const extensionConfig of config?.configureExtensions ?? []) {
      await this.addExtension(extensionConfig, id, containerInstance)
    }

    for (const walletProviderConfig of config?.configureWalletProviders ?? []) {
      await this.addExtension(walletProviderConfig, id, containerInstance)
    }
  }

  private static async addExtension(
    extensionConfig: ExtensionConstructorOrConfig,
    id: string,
    containerInstance: Web5jsSdkContainer,
  ) {
    let type: new (container: IWeb5jsSdkContainer, ...args: unknown[]) => Web5jsSdkExtension
    const args: unknown[] = []

    if ('type' in extensionConfig) {
      type = extensionConfig.type
      args.push(extensionConfig.config)
    } else {
      type = extensionConfig
    }

    const instance = new type(containerInstance, ...args)

    this.checkIfNetworkSupportedInExtension(instance, id, type)

    await instance.init()
    Container.of(id).set(type, instance)
  }

  private static checkIfNetworkSupportedInExtension(
    instance: Web5jsSdkExtension,
    id: string,
    type: { new (container: IWeb5jsSdkContainer, ...args: unknown[]): Web5jsSdkExtension },
  ) {
    if (!instance.supportedNetworks.includes(Container.of(id).get(CONFIG).network)) {
      throw new Error(
        `Extension ${type.name} is not supported on ${Container.of(id).get(CONFIG).network} network.`,
      )
    }
  }

  private static generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 60; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }
}
