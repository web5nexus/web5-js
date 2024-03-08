import { Network } from '../dto'
import { Bitcoin, Web5jsSDK } from '../service'

describe('Web5js Init', () => {
  describe('IP auth', () => {
    it('Testnet', async () => {
      const web5js = await Web5jsSDK.init<Bitcoin>({
        network: Network.BITCOIN_TESTNET,
      })
      const { result } = await web5js.rpc.getBlockChainInfo()
      expect(result.chain).toBe('test')
      await web5js.destroy()
    })

    it('Mainnet', async () => {
      const web5js = await Web5jsSDK.init<Bitcoin>({
        network: Network.BITCOIN,
      })
      const { result } = await web5js.rpc.getBlockChainInfo()
      expect(result.chain).toBe('main')
      await web5js.destroy()
    })
  })

  describe('Multiple Instances', () => {
    it('IP auth', async () => {
      const mainnet = await Web5jsSDK.init<Bitcoin>({
        network: Network.BITCOIN,
      })
      const testnet = await Web5jsSDK.init<Bitcoin>({
        network: Network.BITCOIN_TESTNET,
      })

      const { result: resultMainnet } = await mainnet.rpc.getBlockChainInfo()
      expect(resultMainnet.chain).toBe('main')

      const { result: resultTestnet } = await testnet.rpc.getBlockChainInfo()
      expect(resultTestnet.chain).toBe('test')

      await testnet.destroy()
      await mainnet.destroy()
    })
  })
})
