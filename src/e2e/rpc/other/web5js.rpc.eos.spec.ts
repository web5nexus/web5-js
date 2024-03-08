import * as process from 'process'
import { ApiVersion, Eos, Network, Web5jsSDK } from '../../../service'
import { e2eUtil } from '../../e2e.util'

const getEosRpc = async (testnet?: boolean) =>
  await Web5jsSDK.init<Eos>({
    network: testnet ? Network.EOS_TESTNET : Network.EOS,
    apiKey: {
      v4: testnet ? process.env.V3_API_KEY_TESTNET : process.env.V4_API_KEY_MAINNET,
    },
    version: ApiVersion.V3,
    retryCount: 1,
    retryDelay: 2000,
    verbose: e2eUtil.isVerbose,
  })

// Too unstable
describe.skip('eos', () => {
  describe('mainnet', () => {
    it('getInfo', async () => {
      const web5js = await getEosRpc()
      const result = await web5js.rpc.getInfo()
      expect(result).toBeDefined()
      expect(result).toHaveProperty('server_version')
      expect(result).toHaveProperty('chain_id')
      expect(result).toHaveProperty('head_block_num')
      expect(result).toHaveProperty('last_irreversible_block_num')
      expect(result).toHaveProperty('last_irreversible_block_id')
    })

    it('getAccount', async () => {
      const web5js = await getEosRpc()
      const result = await web5js.rpc.getAccount({ accountName: 'eosasia11111' })
      expect(result).toBeDefined()
      expect(result).toHaveProperty('account_name')
      expect(result).toHaveProperty('head_block_num')
      expect(result).toHaveProperty('head_block_time')
      expect(result).toHaveProperty('cpu_limit.used')
      expect(result).toHaveProperty('permissions')
      expect(result).toHaveProperty('total_resources.net_weight')
      expect(result).toHaveProperty('voter_info.owner')
    })

    it('getCurrencyStats', async () => {
      const web5js = await getEosRpc()
      const result = await web5js.rpc.getCurrencyStats({ code: 'eosio.token', symbol: 'EOS' })
      expect(result).toBeDefined()
      expect(result).toHaveProperty('EOS.max_supply')
      expect(result).toHaveProperty('EOS.issuer')
    })

    it('getCurrencyBalance', async () => {
      const web5js = await getEosRpc()
      const result = await web5js.rpc.getCurrencyBalance({
        code: 'eosio.token',
        symbol: 'EOS',
        account: 'eosio',
      })
      expect(result).toBeDefined()
      expect(result).toHaveLength(1)
    })

    it('getTableRows', async () => {
      const web5js = await getEosRpc()
      const result = await web5js.rpc.getTableRows({
        code: 'eosio',
        table: 'voters',
        scope: 'eosio',
        keyType: 'name',
        limit: 100,
        reverse: false,
        showPayer: false,
      })
      expect(result).toBeDefined()
    })
  })

  describe('testnet', () => {
    it('getNowBlock', async () => {
      const web5js = await getEosRpc(true)
      const result = await web5js.rpc.getInfo()
      expect(result).toBeDefined()
      expect(result).toHaveProperty('server_version')
      expect(result).toHaveProperty('chain_id')
      expect(result).toHaveProperty('head_block_num')
      expect(result).toHaveProperty('last_irreversible_block_num')
      expect(result).toHaveProperty('last_irreversible_block_id')
    })

    it('getCurrencyStats', async () => {
      const web5js = await getEosRpc(true)
      const result = await web5js.rpc.getCurrencyStats({ code: 'eosio.token', symbol: 'EOS' })
      expect(result).toBeDefined()
      expect(result).toHaveProperty('EOS.max_supply')
      expect(result).toHaveProperty('EOS.issuer')
    })

    it('getCurrencyBalance', async () => {
      const web5js = await getEosRpc(true)
      const result = await web5js.rpc.getCurrencyBalance({
        code: 'eosio.token',
        symbol: 'EOS',
        account: 'eosio',
      })
      expect(result).toBeDefined()
      expect(result).toHaveLength(1)
    })

    it('getTableRows', async () => {
      const web5js = await getEosRpc(true)
      const result = await web5js.rpc.getTableRows({
        code: 'eosio',
        table: 'voters',
        scope: 'eosio',
        keyType: 'name',
        limit: 100,
        reverse: false,
        showPayer: false,
      })
      expect(result).toBeDefined()
    })
  })
})
