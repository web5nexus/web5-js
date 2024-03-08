import { Commitment, Encoding } from '../../../dto'
import { Network, Solana, Web5jsSDK } from '../../../service'
import { e2eUtil } from '../../e2e.util'

const getClient = async (testnet?: boolean): Promise<Solana> =>
  await Web5jsSDK.init<Solana>({
    network: testnet ? Network.SOLANA_DEVNET : Network.SOLANA,
    retryCount: 1,
    retryDelay: 2000,
    verbose: e2eUtil.isVerbose,
  })

const blockNumber = 203046000

// TODO: Too unstable
describe.skip('Solana', () => {
  describe('mainnet', () => {
    describe('getAccountInfo', () => {
      it('should return account info', async () => {
        const web5js = await getClient()
        const publicKey = '8Ew6iQXcTRHAUNNu3X9VBn1g1bJkXEZJ9gFD2AGKtdPB'
        const { result } = await web5js.rpc.getAccountInfo(publicKey)
        await web5js.destroy()
        expect(result?.context.slot).toBeGreaterThan(0)
        expect(result?.value?.lamports).toBeGreaterThan(0)
      })
    })
    describe('getBalance', () => {
      it('should return the balance of a public key', async () => {
        const web5js = await getClient()
        const publicKey = '8Ew6iQXcTRHAUNNu3X9VBn1g1bJkXEZJ9gFD2AGKtdPB'

        const { result } = await web5js.rpc.getBalance(publicKey)

        await web5js.destroy()
        const balance = result?.value
        expect(typeof balance).toBe('number')
        expect(balance).toBeGreaterThan(0)

        expect(result?.context.slot).toBeGreaterThan(0)
      })

      it('should return error if an invalid public key is provided', async () => {
        const web5js = await getClient()
        const publicKey = 'invalid-public-key'

        const { error } = await web5js.rpc.getBalance(publicKey)
        await web5js.destroy()
        expect(error?.message).toBe('Invalid param: Invalid')
      })
    })

    describe('getBlockHeight', () => {
      it('should return the current block height', async () => {
        const web5js = await getClient()
        const { result } = await web5js.rpc.getBlockHeight()
        await web5js.destroy()
        expect(typeof result).toBe('number')
        expect(result).toBeGreaterThan(0)
      })
    })

    describe('getBlockProduction', () => {
      it('should return block production information', async () => {
        const web5js = await getClient()
        const { result } = await web5js.rpc.getBlockProduction()
        await web5js.destroy()
        expect(result?.context.slot).toBeGreaterThan(0)
        expect(result).toHaveProperty('value.byIdentity')
        expect(result).toHaveProperty('value.range.firstSlot')
      })
    })

    describe('getBlockCommitment', () => {
      it('should return block commitment information', async () => {
        const web5js = await getClient()
        const { result } = await web5js.rpc.getBlockCommitment(blockNumber)
        await web5js.destroy()
        expect(result).toHaveProperty('commitment')
        expect(result?.totalStake).toBeGreaterThan(0)
      })
    })

    describe('getBlocks', () => {
      it('should return an array of block numbers between two slots', async () => {
        const web5js = await getClient()
        const startSlot = 193167060
        const endSlot = 193167070
        const { result } = await web5js.rpc.getBlocks(endSlot, startSlot)
        await web5js.destroy()
        expect(Array.isArray(result)).toBe(true)
      })

      // Sometimes this test fails, so we skip it for now
      it.skip('should return an array of block numbers between two slots, passing only endSlot', async () => {
        const web5js = await getClient()
        const { result } = await web5js.rpc.getBlocks(blockNumber)
        await web5js.destroy()
        expect(Array.isArray(result)).toBe(true)
      }, 9000000)

      it('should return an array of confirmed block numbers between two slots', async () => {
        const web5js = await getClient()
        const startSlot = 193167060
        const endSlot = 193167070
        const { result } = await web5js.rpc.getBlocks(endSlot, startSlot, {
          commitment: Commitment.Confirmed,
        })
        await web5js.destroy()
        expect(Array.isArray(result)).toBe(true)
      })
    })

    describe('getBlockTime', () => {
      it('should return block time ', async () => {
        const web5js = await getClient()
        const { result: slot } = await web5js.rpc.getSlot()
        const { result } = await web5js.rpc.getBlockTime(slot || 0)
        await web5js.destroy()
        expect(typeof result).toBe('number')
        expect(result).toBeGreaterThan(0)
      })
    })

    describe('getClusterNodes', () => {
      it('should return cluster nodes info ', async () => {
        const web5js = await getClient()
        const { result } = await web5js.rpc.getClusterNodes()
        await web5js.destroy()
        expect(Array.isArray(result)).toBe(true)
      })
    })

    describe('getEpochInfo', () => {
      it('should return epoch info ', async () => {
        const web5js = await getClient()
        const { result } = await web5js.rpc.getEpochInfo()
        await web5js.destroy()
        expect(result?.epoch).toBeGreaterThan(0)
      })
    })

    describe('getEpochSchedule', () => {
      it('should return epoch schedule ', async () => {
        const web5js = await getClient()
        const { result } = await web5js.rpc.getEpochSchedule()
        await web5js.destroy()
        expect(result?.slotsPerEpoch).toBeGreaterThan(0)
      })
    })

    describe('getFirstAvailableBlock', () => {
      it('should return first available block', async () => {
        const web5js = await getClient()
        const { result } = await web5js.rpc.getFirstAvailableBlock()
        await web5js.destroy()
        expect(result).toBeGreaterThan(0)
      })
    })

    describe('getGenesisHash', () => {
      it('should return genesis hash', async () => {
        const web5js = await getClient()
        const { result } = await web5js.rpc.getGenesisHash()
        await web5js.destroy()
        expect(result).toBeTruthy()
      })
    })

    describe('getHealth', () => {
      it('should return health status', async () => {
        const web5js = await getClient()
        const { result } = await web5js.rpc.getHealth()
        await web5js.destroy()
        expect(result).toEqual('ok')
      })
    })

    describe('getHighestSnapshotSlot', () => {
      it('should return highest snapshot slot', async () => {
        const web5js = await getClient()
        const { result } = await web5js.rpc.getHighestSnapshotSlot()
        await web5js.destroy()
        expect(result?.full).toBeGreaterThan(0)
      })
    })

    describe('getIdentity', () => {
      it('should return identity', async () => {
        const web5js = await getClient()
        const { result } = await web5js.rpc.getIdentity()
        await web5js.destroy()
        expect(result).toBeTruthy()
      })
    })

    describe('getInflationGovernor', () => {
      it('should return inflation governor info', async () => {
        const web5js = await getClient()
        const { result } = await web5js.rpc.getInflationGovernor()
        await web5js.destroy()
        expect(result?.terminal).toBeGreaterThan(0)
      })
    })

    describe('getInflationRate', () => {
      it('should return inflation rate', async () => {
        const web5js = await getClient()
        const { result } = await web5js.rpc.getInflationRate()
        await web5js.destroy()
        expect(result?.total).toBeGreaterThan(0)
        expect(result?.epoch).toBeGreaterThan(0)
      })
    })

    describe('getInflationReward', () => {
      it.skip('should return inflation reward', async () => {
        const web5js = await getClient()
        const { result } = await web5js.rpc.getInflationReward([
          'GUP3BG93X9EoDor3bDarTqv8n653u1Bkr2NbQqRqBZwF',
        ])
        const item = result![0]
        await web5js.destroy()
        expect(item.epoch).toBeGreaterThan(0)
      })
    })

    //takes long time to finish
    describe('getLargestAccounts', () => {
      it.skip('should return largest accounts', async () => {
        const web5js = await getClient()
        const { result } = await web5js.rpc.getLargestAccounts()
        await web5js.destroy()
        expect(result?.context.slot).toBeGreaterThan(0)
        expect(result?.value.length).toBeGreaterThan(0)
      })
    })

    describe('getLatestBlockhash', () => {
      it('should return latest blockhash', async () => {
        const web5js = await getClient()
        const { result } = await web5js.rpc.getLatestBlockhash()
        await web5js.destroy()
        expect(result?.context.slot).toBeGreaterThan(0)
        expect(result?.value.blockhash).toBeTruthy()
        expect(result?.value.lastValidBlockHeight).toBeGreaterThan(0)
      })
    })

    describe('getLeaderSchedule', () => {
      it('should return leader schedule', async () => {
        const web5js = await getClient()
        const { result } = await web5js.rpc.getLeaderSchedule()
        await web5js.destroy()
        //binance validator
        expect(result?.DRpbCBMxVnDK7maPM5tGv6MvB3v1sRMC86PZ8okm21hy.length).toBeGreaterThan(0)
      })
    })

    describe('getMultipleAccounts', () => {
      it('should return account info', async () => {
        const web5js = await getClient()
        //binance validator
        const { result } = await web5js.rpc.getMultipleAccounts([
          'DRpbCBMxVnDK7maPM5tGv6MvB3v1sRMC86PZ8okm21hy',
        ])
        await web5js.destroy()
        expect(result?.context.slot).toBeGreaterThan(0)
        expect(result?.value[0]?.lamports).toBeGreaterThan(0)
      })
    })

    describe('getSlot', () => {
      it('should return slot number', async () => {
        const web5js = await getClient()

        const { result } = await web5js.rpc.getSlot()
        await web5js.destroy()
        expect(result).toBeGreaterThan(0)
      })
    })

    describe('getSlotLeaders', () => {
      it('should return slot leader info', async () => {
        const web5js = await getClient()

        const { result } = await web5js.rpc.getSlotLeader()
        await web5js.destroy()
        expect(result).toBeTruthy()
      })
    })

    describe('getTokenAccountBalance', () => {
      it('should return token account balance', async () => {
        const web5js = await getClient()

        const { result } = await web5js.rpc.getTokenAccountBalance(
          'DhzDoryP2a4rMK2bcWwJxrE2uW6ir81ES8ZwJJPPpxDN',
        )
        await web5js.destroy()
        expect(result?.context.slot).toBeGreaterThan(0)
        expect(result?.value.amount).toBeTruthy()
      })
    })

    describe('getTokenAccountsByOwner', () => {
      it('should return token accounts by owner', async () => {
        const web5js = await getClient()

        const { result } = await web5js.rpc.getTokenAccountsByOwner(
          'GgPpTKg78vmzgDtP1DNn72CHAYjRdKY7AV6zgszoHCSa',
          {
            mint: '1YDQ35V8g68FGvcT85haHwAXv1U7XMzuc4mZeEXfrjE',
          },
          { encoding: Encoding.JsonParsed },
        )
        await web5js.destroy()
        expect(result?.context.slot).toBeGreaterThan(0)
        expect(result?.value.length).toBeGreaterThan(0)
      })
    })

    describe('getTransaction', () => {
      it.skip('should return transaction data', async () => {
        const web5js = await getClient()

        const { result: slot } = await web5js.rpc.getSlot()
        const { result: blockResponse } = await web5js.rpc.getBlock(slot || 0, {
          encoding: Encoding.JsonParsed,
          maxSupportedTransactionVersion: 0,
        })

        const { result } = await web5js.rpc.getTransaction(
          blockResponse?.transactions[0].transaction.signatures[0],
        )
        await web5js.destroy()
        expect(result?.slot).toBeGreaterThan(0)
        expect(result?.transaction).toBeTruthy()
      })
    })

    //takes too long to finish
    describe('getProgramAccount', () => {
      it.skip('should return account data', async () => {
        const web5js = await getClient(true)

        const { result } = await web5js.rpc.getProgramAccounts(
          'FriELggez2Dy3phZeHHAdpcoEXkKQVkv6tx3zDtCVP8T',
          {
            filters: [
              {
                dataSize: 165, // number of bytes
              },
            ],
          },
        )
        await web5js.destroy()
        expect(result).toBeTruthy()
      })
    })
  })

  describe('devnet', () => {
    describe('getBlockHeight', () => {
      it('should return the current block height', async () => {
        const web5js = await getClient(true)
        const { result } = await web5js.rpc.getBlockHeight()
        await web5js.destroy()
        expect(typeof result).toBe('number')
        expect(result).toBeGreaterThan(0)
      })
    })

    describe('getBlockProduction', () => {
      it('should return block production information', async () => {
        const web5js = await getClient()
        const { result } = await web5js.rpc.getBlockProduction()
        await web5js.destroy()
        expect(result?.context.slot).toBeGreaterThan(0)
        expect(result).toHaveProperty('value.byIdentity')
        expect(result).toHaveProperty('value.range.firstSlot')
      })
    })

    describe('getBlockCommitment', () => {
      it('should return block commitment information', async () => {
        const web5js = await getClient()
        const { result } = await web5js.rpc.getBlockCommitment(blockNumber)
        await web5js.destroy()
        expect(result).toHaveProperty('commitment')
        expect(result?.totalStake).toBeGreaterThan(0)
      })
    })

    describe('getBlock', () => {
      it('should return a recent block', async () => {
        const web5js = await getClient(true)
        const { result: slot } = await web5js.rpc.getSlot()
        const { result } = await web5js.rpc.getBlock(slot || 0, {
          encoding: Encoding.JsonParsed,
          maxSupportedTransactionVersion: 0,
        })
        await web5js.destroy()
        expect(result).toHaveProperty('blockhash')
        expect(result?.blockhash).toBeTruthy()
        expect(result?.previousBlockhash).toBeTruthy()
        expect(result?.blockHeight).toBeGreaterThan(0)
        expect(result?.parentSlot).toBeGreaterThan(0)
        expect(result?.blockTime).toBeGreaterThan(0)
        expect(Array.isArray(result?.transactions)).toBe(true)
      })
    })
  })
})
