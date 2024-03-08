import { BitcoinCash, Network } from '../../../service'
import { UtxoE2eUtils, UtxoNetworkType } from './utxo.e2e.utils'

describe('Bitcoin Cash', () => {
  describe('mainnet', () => {
    it('estimatefee', async () => {
      const web5js = await UtxoE2eUtils.initWeb5js<BitcoinCash>({
        network: Network.BITCOIN_CASH,
        type: UtxoNetworkType.MAIN,
      })
      const result = await web5js.rpc.estimateFee()
      await web5js.destroy()
      expect(result.result).not.toBeNull()
    })
  })

  describe('testnet', () => {
    it('estimatefee', async () => {
      const web5js = await UtxoE2eUtils.initWeb5js<BitcoinCash>({
        network: Network.BITCOIN_CASH,
        type: UtxoNetworkType.TEST,
      })
      const result = await web5js.rpc.estimateFee()
      await web5js.destroy()
      expect(result.result).not.toBeNull()
    })
  })
})
