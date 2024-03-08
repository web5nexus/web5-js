import { ApiVersion, Bitcoin, Ethereum, Network, Web5jsSDK } from '../service'
import { Status } from '../util'

describe('Fee', () => {
  it('should return fee for eth testnet', async () => {
    const web5js = await Web5jsSDK.init<Ethereum>({
      network: Network.ETHEREUM_SEPOLIA,
      retryDelay: 1000,
      retryCount: 2,
      version: ApiVersion.V3,
    })

    try {
      const { data, status } = await web5js.fee.getCurrentFee()

      expect(status).toBe(Status.SUCCESS)
      expect(data.gasPrice.fast).toBeDefined()
    } finally {
      await web5js.destroy()
    }
  })

  it('should return fee for btc testnet', async () => {
    const web5js = await Web5jsSDK.init<Bitcoin>({
      network: Network.BITCOIN_TESTNET,
      retryDelay: 1000,
      retryCount: 2,
      version: ApiVersion.V3,
    })

    try {
      const { data, status } = await web5js.fee.getCurrentFee()
      await web5js.destroy()
      expect(status).toBe(Status.SUCCESS)
      expect(data.fast).toBeDefined()
    } finally {
      await web5js.destroy()
    }
  })
})
