import { Network } from '../dto'
import { Ethereum, Web5jsSDK } from '../service'
import { Logger } from '../service/logger/logger.types'

describe('Logger', () => {
  let logger: Logger

  beforeEach(() => {
    logger = {
      trace: jest.fn(),
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
    }
  })

  it('should warn on missing API key', async () => {
    const web5js = await Web5jsSDK.init<Ethereum>({
      network: Network.ETHEREUM_SEPOLIA,
      logger,
    })
    await web5js.destroy()

    expect(logger.warn).toHaveBeenCalledWith(
      'API key not provided - only a subset of SDK features will be enabled. Generate an API Key by accessing your Dashboard: https://co.web5js.io/signup',
    )
  })
})
