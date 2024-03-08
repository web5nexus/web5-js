import { BigNumber } from 'bignumber.js'
import { Klaytn, Network } from '../../../service'
import { EvmE2eUtils } from './evm.e2e.utils'

const run = async (network: Network, chainId: number) => {
  describe('klay prefix', () => {
    it('klay_blockNumber', async () => {
      const web5js = await EvmE2eUtils.initWeb5js<Klaytn>(network)
      const { result } = await web5js.rpc.blockNumber(true)

      await web5js.destroy()
      expect(result?.toNumber()).toBeGreaterThan(0)
    })

    it('klay_chainId', async () => {
      const web5js = await EvmE2eUtils.initWeb5js<Klaytn>(network)
      const result = await web5js.rpc.chainId(true)

      await web5js.destroy()
      expect(result?.result?.toNumber()).toBe(chainId)
    })

    it('klay_gasPrice', async () => {
      const web5js = await EvmE2eUtils.initWeb5js<Klaytn>(network)
      const { result } = await web5js.rpc.gasPrice(true)

      await web5js.destroy()
      expect(result?.toNumber()).toBeGreaterThan(0)
    })

    it('klay_getBlockByNumber', async () => {
      const web5js = await EvmE2eUtils.initWeb5js<Klaytn>(network)
      const { result } = await web5js.rpc.blockNumber(true)
      const { result: block } = await web5js.rpc.getBlockByNumber(
        (result as BigNumber).toNumber() - 1000,
        false,
        true,
      )
      await web5js.destroy()
      expect(block.timestamp).toBeDefined()
      expect(block.size).toBeDefined()
    })

    it('web3_clientVersion', async () => {
      const web5js = await EvmE2eUtils.initWeb5js<Klaytn>(network)
      const { result } = await web5js.rpc.clientVersion()

      await web5js.destroy()
      expect(result).toBeDefined()
    })
  })
}

describe.each([
  { network: Network.KLAYTN, expected: { chainId: 8217 } },
  { network: Network.KLAYTN_BAOBAB, expected: { chainId: 1001 } },
])('RPC Klaytn', (network) => {
  const { network: networkName, expected } = network
  describe(networkName, () => {
    run(networkName, expected.chainId)
  })
})
