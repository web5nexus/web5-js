import { AlgorandAlgod, Network, Web5jsSDK } from '../../../service'
import { e2eUtil } from '../../e2e.util'

const getAlgorandAlgodRpc = async (testnet?: boolean) =>
  await Web5jsSDK.init<AlgorandAlgod>(e2eUtil.initConfig(testnet ? Network.ALGORAND_ALGOD_TESTNET : Network.ALGORAND_ALGOD))

describe.each([false, true])('Algorand Algod', (testnet) => {
  describe(`${testnet ? 'Testnet' : 'Mainnet'}`, () => {
    let web5js: AlgorandAlgod

    beforeEach(async () => {
      web5js = await getAlgorandAlgodRpc(false)
    })

    afterEach(async () => {
      await web5js.destroy()
    })

    it('should correctly get ledger supply', async () => {
      const response = await web5js.rpc.getLedgerSupply()
      expect(response).toBeDefined()
    })

    it('should correctly get block hash', async () => {
      const response = await web5js.rpc.getBlockHash({ round: 10 })
      expect(response).toBeDefined()
    })

    it('should correctly get genesis', async () => {
      const response = await web5js.rpc.getGenesis()
      expect(response).toBeDefined()
    })

    it('should correctly check if node is healthy', async () => {
      await expect(web5js.rpc.isHealthy()).resolves.not.toThrow()
    })

    it('should correctly check if node is ready', async () => {
      await expect(web5js.rpc.isReady()).resolves.not.toThrow()
    })

    // TODO: once allowed remove skip
    it.skip('should correctly get tx params', async () => {
      const response = await web5js.rpc.getTransactionParams()
      expect(response).toBeDefined()
    })
  })
})
