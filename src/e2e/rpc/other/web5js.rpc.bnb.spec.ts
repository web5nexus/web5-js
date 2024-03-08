import { Bnb, Network, Web5jsSDK } from '../../../service'
import { e2eUtil } from '../../e2e.util'

const getBnbRpc = async () =>
  await Web5jsSDK.init<Bnb>(e2eUtil.initConfig(Network.BNB))

// Testnet is not available
describe('Bnb', () => {
  describe('mainnet', () => {
    it('block', async () => {
      const web5js = await getBnbRpc()
      const { result } = await web5js.rpc.block()
      await web5js.destroy()
      expect(result).toBeDefined()
    })

    it('abciInfo', async () => {
      const web5js = await getBnbRpc()
      const { result } = await web5js.rpc.abciInfo()
      await web5js.destroy()
      expect(result).toBeDefined()
    })

    it('blockchain', async () => {
      const web5js = await getBnbRpc()
      const { result } = await web5js.rpc.blockchain()
      await web5js.destroy()
      expect(result).toBeDefined()
    })

    it('health', async () => {
      const web5js = await getBnbRpc()
      const { result } = await web5js.rpc.health()
      await web5js.destroy()
      expect(result).toBeDefined()
    })

    it('genesis', async () => {
      const web5js = await getBnbRpc()
      const { result } = await web5js.rpc.genesis()
      await web5js.destroy()
      expect(result).toBeDefined()
    })

    it('validators', async () => {
      const web5js = await getBnbRpc()
      const { result } = await web5js.rpc.validators()
      await web5js.destroy()
      expect(result).toBeDefined()
    })

    it('unconfirmedTxs', async () => {
      const web5js = await getBnbRpc()
      const { result } = await web5js.rpc.unconfirmedTxs({ limit: '1' })
      await web5js.destroy()
      expect(result).toBeDefined()
    })

    it('raw rpc call', async () => {
      const web5js = await getBnbRpc()
      const { result } = await web5js.rpc.rawRpcCall({ method: 'block', id: 1, jsonrpc: '2.0', params: {} })
      await web5js.destroy()
      expect(result).toBeDefined()
    })
  })
})
