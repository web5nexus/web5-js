import { Network } from '../../../../dto'
import { Ethereum } from '../../../../service'
import { EvmE2eUtils } from '../evm.e2e.utils'

describe('Beacon', () => {
  describe('v1', () => {
    const networks = [Network.ETHEREUM_HOLESKY, Network.ETHEREUM_SEPOLIA, Network.ETHEREUM]

    describe.each(networks)('%s', (network) => {
      it('should get genesis', async () => {
        const web5js = await EvmE2eUtils.initWeb5js<Ethereum>(network, process.env.V4_API_KEY_TESTNET)
        const { data } = await web5js.rpc.beacon.v1.getGenesis()
        await web5js.destroy()
        expect(data).toBeDefined()
      })

      it('should get state root', async () => {
        const web5js = await EvmE2eUtils.initWeb5js<Ethereum>(network, process.env.V4_API_KEY_TESTNET)
        const { data } = await web5js.rpc.beacon.v1.getStateRoot({ stateId: 'head' })
        await web5js.destroy()
        expect(data).toBeDefined()
      })

      it('should get block headers', async () => {
        const web5js = await EvmE2eUtils.initWeb5js<Ethereum>(network, process.env.V4_API_KEY_TESTNET)
        const { data } = await web5js.rpc.beacon.v1.getBlockHeaders({ slot: '1000' })
        await web5js.destroy()
        expect(data).toBeDefined()
      })

      it('should get block root', async () => {
        const web5js = await EvmE2eUtils.initWeb5js<Ethereum>(network, process.env.V4_API_KEY_TESTNET)
        const { data } = await web5js.rpc.beacon.v1.getBlockRoot({ blockId: 'head' })
        await web5js.destroy()
        expect(data).toBeDefined()
      })

      it('should get state committees', async () => {
        const web5js = await EvmE2eUtils.initWeb5js<Ethereum>(network, process.env.V4_API_KEY_TESTNET)
        const { data } = await web5js.rpc.beacon.v1.getStateCommittees({ stateId: 'head' })
        await web5js.destroy()
        expect(data).toBeDefined()
      })

      it('should get state finality checkpoints', async () => {
        const web5js = await EvmE2eUtils.initWeb5js<Ethereum>(network, process.env.V4_API_KEY_TESTNET)
        const { data } = await web5js.rpc.beacon.v1.getStateFinalityCheckpoints({ stateId: 'head' })
        await web5js.destroy()
        expect(data).toBeDefined()
      })

      it('should get state fork', async () => {
        const web5js = await EvmE2eUtils.initWeb5js<Ethereum>(network, process.env.V4_API_KEY_TESTNET)
        const { data } = await web5js.rpc.beacon.v1.getStateFork({ stateId: 'head' })
        await web5js.destroy()
        expect(data).toBeDefined()
      })

      it('should get state sync committees', async () => {
        const web5js = await EvmE2eUtils.initWeb5js<Ethereum>(network, process.env.V4_API_KEY_TESTNET)
        const { data } = await web5js.rpc.beacon.v1.getStateSyncCommittees({ stateId: 'head' })
        await web5js.destroy()
        expect(data).toBeDefined()
      })
    })
  })
})
