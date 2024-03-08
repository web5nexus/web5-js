import { Network } from '../../../dto'
import { BaseUtxo, Web5jsSDK, Dogecoin } from '../../../service'
import { e2eUtil } from '../../e2e.util'

export enum UtxoNetworkType {
  MAIN = 'main',
  TEST = 'test',
}

interface Web5jsBtcUtils {
  type: UtxoNetworkType
  network: Network
  apiKey?: string
  skipEstimateSmartFee?: boolean
}

export const UtxoE2eUtils = {
  initWeb5js: async <T extends BaseUtxo | Dogecoin>(params: Web5jsBtcUtils) =>
    Web5jsSDK.init<T>(e2eUtil.initConfig(params.network, params.apiKey)),
  e2e: (params: Web5jsBtcUtils) => {
    const { type } = params
    it('chain info', async () => {
      const web5js = await UtxoE2eUtils.initWeb5js(params)
      const { result } = await web5js.rpc.getBlockChainInfo()

      await web5js.destroy()
      expect(result.chain).toBe(type)
    })

    it('chain info raw call', async () => {
      const web5js = await UtxoE2eUtils.initWeb5js(params)
      const info = await web5js.rpc.rawRpcCall({
        method: 'getblockchaininfo',
        id: '1',
        jsonrpc: '2.0',
      })
      await web5js.destroy()
      expect(info.result.chain).toBe(type)
    })

    it('best block hash', async () => {
      const web5js = await UtxoE2eUtils.initWeb5js(params)
      const { result } = await web5js.rpc.getBestBlockHash()

      await web5js.destroy()
      expect(result).toBeTruthy()
    })

    it('block count', async () => {
      const web5js = await UtxoE2eUtils.initWeb5js(params)
      const { result } = await web5js.rpc.getBlockCount()

      await web5js.destroy()
      expect(result).toBeGreaterThan(0)
    })

    it('difficulty', async () => {
      const web5js = await UtxoE2eUtils.initWeb5js(params)
      const { result } = await web5js.rpc.getDifficulty()

      await web5js.destroy()
      expect(result).toBeGreaterThan(0)
    })

    it('mempool info', async () => {
      const web5js = await UtxoE2eUtils.initWeb5js(params)
      const { result } = await web5js.rpc.getMempoolInfo()

      await web5js.destroy()
      expect(result).toBeDefined()
    })

    if (!params.skipEstimateSmartFee) {
      it('estimatesmartfee', async () => {
        const web5js = await UtxoE2eUtils.initWeb5js(params)
        const result = await web5js.rpc.estimateSmartFee(6)

        await web5js.destroy()
        expect(result.result).not.toBeNull()
      })
    }
  },
}
