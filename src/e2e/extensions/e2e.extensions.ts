import { EVM_BASED_NETWORKS } from '../../dto'
import {
  IWeb5jsSdkContainer,
  Network,
  Web5jsConfig,
  Web5jsSdkExtension,
  Web5jsSdkWalletProvider,
  TxId,
} from '../../service'

export class TestExtension extends Web5jsSdkExtension {
  private readonly sdkConfig: Web5jsConfig

  constructor(web5jsSdkContainer: IWeb5jsSdkContainer, private readonly mockTestExtension: any) {
    super(web5jsSdkContainer)
    this.sdkConfig = this.web5jsSdkContainer.getConfig()
  }

  async sayHello() {
    this.mockTestExtension.dummyMethod()
    this.mockTestExtension.network(this.sdkConfig.network)
  }

  init(): Promise<void> {
    this.mockTestExtension.init()
    return Promise.resolve(undefined)
  }

  destroy(): Promise<void> {
    this.mockTestExtension.destroy()
    return Promise.resolve(undefined)
  }

  supportedNetworks: Network[] = EVM_BASED_NETWORKS
}

export class TestWalletProvider extends Web5jsSdkWalletProvider<string, string> {
  private readonly sdkConfig: Web5jsConfig

  constructor(
    web5jsSdkContainer: IWeb5jsSdkContainer,
    private readonly mockTestExtension?: any,
    someOtherConfig?: { someConfigValue: boolean },
  ) {
    super(web5jsSdkContainer)
    this.sdkConfig = this.web5jsSdkContainer.getConfig()
    console.log('someOtherConfig', someOtherConfig)
    if (!mockTestExtension) {
      this.mockTestExtension = {
        dummyMethod: jest.fn(),
        init: jest.fn(),
        destroy: jest.fn(),
        network: jest.fn(),
      }
    }
  }

  async getWallet() {
    this.mockTestExtension.network(this.sdkConfig.network)
    this.mockTestExtension.dummyMethod()
    return 'connected'
  }

  init(): Promise<void> {
    this.mockTestExtension.init()
    return Promise.resolve(undefined)
  }

  destroy(): Promise<void> {
    this.mockTestExtension.destroy()
    return Promise.resolve(undefined)
  }

  signAndBroadcast(payload: string): Promise<TxId> {
    this.mockTestExtension.dummyMethod()
    return Promise.resolve(payload)
  }

  supportedNetworks: Network[] = EVM_BASED_NETWORKS
}
