import { Ethereum, Network, Web5jsSDK } from '../../service'
import { TestExtension, TestWalletProvider } from './e2e.extensions'

const mockTestExtension = {
  dummyMethod: jest.fn(),
  init: jest.fn(),
  destroy: jest.fn(),
  network: jest.fn(),
}

describe('Web5js Extension Ecosystem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  describe('General Extension', () => {
    it('should work after being registered', async () => {
      const web5js = await Web5jsSDK.init<Ethereum>({
        network: Network.ETHEREUM_SEPOLIA,
        configureExtensions: [{ type: TestExtension, config: mockTestExtension }],
      })

      await web5js.extension(TestExtension).sayHello()

      await web5js.destroy()

      expect(mockTestExtension.dummyMethod).toHaveBeenCalled()
      expect(mockTestExtension.init).toHaveBeenCalled()
      expect(mockTestExtension.destroy).toHaveBeenCalled()
      expect(mockTestExtension.network).toBeCalledWith(Network.ETHEREUM_SEPOLIA)
    })
    it('should fail if network not supported', async () => {
      try {
        const web5js = await Web5jsSDK.init<Ethereum>({
          network: Network.BITCOIN,
          configureExtensions: [TestExtension],
        })

        expect(true).toBe(false)

        await web5js.destroy()
      } catch (e) {
        if (e instanceof Error) {
          expect(e.message).toBe('Extension TestExtension is not supported on bitcoin-mainnet network.')
        } else {
          expect(true).toBe(false)
        }
      }
    })
  })

  describe('Wallet Extension', () => {
    it('should work after being registered', async () => {
      const web5js = await Web5jsSDK.init<Ethereum>({
        network: Network.ETHEREUM_SEPOLIA,
        configureWalletProviders: [{ type: TestWalletProvider, config: mockTestExtension }],
      })

      const result = await web5js.walletProvider.use(TestWalletProvider).getWallet()

      await web5js.walletProvider.use(TestWalletProvider).signAndBroadcast('payload')

      await web5js.destroy()

      expect(result).toBe('connected')
      expect(mockTestExtension.init).toHaveBeenCalled()
      expect(mockTestExtension.destroy).toHaveBeenCalled()
      expect(mockTestExtension.network).toBeCalledWith(Network.ETHEREUM_SEPOLIA)
      expect(mockTestExtension.dummyMethod).toBeCalledTimes(2)
    })
  })
  describe('Configurable Wallet Extension', () => {
    it('should work after being registered without config if optional', async () => {
      const web5js = await Web5jsSDK.init<Ethereum>({
        network: Network.ETHEREUM_SEPOLIA,
        configureWalletProviders: [TestWalletProvider],
      })

      const result = await web5js.walletProvider.use(TestWalletProvider).getWallet()

      await web5js.walletProvider.use(TestWalletProvider).signAndBroadcast('payload')

      await web5js.destroy()

      expect(result).toBe('connected')
    })
  })
})
