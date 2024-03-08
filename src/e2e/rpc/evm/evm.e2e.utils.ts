import { BigNumber } from 'bignumber.js'
import { Network } from '../../../dto'
import { BaseEvm, Web5jsSDK } from '../../../service'
import { NetworkUtils } from '../../../util/network.utils'
import { e2eUtil } from '../../e2e.util'

interface EvmE2eI {
  network: Network
  apiKey?: string
  data?: {
    estimateGas?: any
  }
  skipEstimateGas?: boolean
}

export const EvmE2eUtils = {
  initWeb5js: async <T extends BaseEvm>(network: Network, apiKey?: string) =>
    Web5jsSDK.init<T>(e2eUtil.initConfig(network, apiKey)),
  e2e: (evmE2eI: EvmE2eI) => {
    const { network, data, skipEstimateGas, apiKey } = evmE2eI
    it('eth_blockNumber', async () => {
      const web5js = await EvmE2eUtils.initWeb5js(network, apiKey)
      const { result } = await web5js.rpc.blockNumber()

      await web5js.destroy()
      expect(result?.toNumber()).toBeGreaterThan(0)
    })

    it('eth_chainId', async () => {
      const web5js = await EvmE2eUtils.initWeb5js(network, apiKey)
      const { result } = await web5js.rpc.chainId()

      web5js.rpc.destroy()
      expect(result?.toNumber()).toBe(NetworkUtils.getChainId(network))
    })

    if (!skipEstimateGas) {
      it('eth_estimateGas', async () => {
        const web5js = await EvmE2eUtils.initWeb5js(network, apiKey)
        const estimateGas = data?.estimateGas ?? {
          from: '0xb4c9E4617a16Be36B92689b9e07e9F64757c1792',
          to: '0x4675C7e5BaAFBFFbca748158bEcBA61ef3b0a263',
          value: '0x0',
        }
        const { result } = await web5js.rpc.estimateGas(estimateGas)
        await web5js.destroy()
        expect(result?.toNumber()).toBeGreaterThanOrEqual(0)
      })
    }

    it('eth_gasPrice', async () => {
      const web5js = await EvmE2eUtils.initWeb5js(network, apiKey)
      const { result } = await web5js.rpc.gasPrice()

      await web5js.destroy()
      expect(result?.toNumber()).toBeGreaterThan(0)
    })

    it('web3_clientVersion', async () => {
      const web5js = await EvmE2eUtils.initWeb5js(network, apiKey)
      const { result } = await web5js.rpc.clientVersion()

      await web5js.destroy()
      expect(result).toBeTruthy()
    })

    it('eth_getBlockByNumber', async () => {
      const web5js = await EvmE2eUtils.initWeb5js(network, apiKey)
      const { result } = await web5js.rpc.blockNumber()
      const { result: block } = await web5js.rpc.getBlockByNumber((result as BigNumber).toNumber() - 1000)
      await web5js.destroy()
      expect(block.timestamp).toBeDefined()
      expect(block.size).toBeDefined()
    })
  },
}
