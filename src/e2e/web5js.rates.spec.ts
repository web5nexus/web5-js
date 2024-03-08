import { ApiVersion, Ethereum, Network, Web5jsSDK } from '../service'

describe('Rates', () => {
  let web5js: Ethereum

  beforeEach(async () => {
    web5js = await Web5jsSDK.init<Ethereum>({
      network: Network.ETHEREUM_SEPOLIA,
      retryDelay: 1000,
      retryCount: 2,
      version: ApiVersion.V4,
    })
  })

  afterEach(() => {
    web5js.destroy()
  })

  it('get ETH/EUR', async () => {
    const res = await web5js.rates.getCurrentRate('BTC', 'EUR')
    expect(res.data.value).toBeDefined()
  })
  it('get batch', async () => {
    const res = await web5js.rates.getCurrentRateBatch([
      { currency: 'BTC', basePair: 'EUR' },
      { currency: 'ETH', basePair: 'EUR' },
    ])
    expect(res.data[1].value).toBeDefined()
  })
})
