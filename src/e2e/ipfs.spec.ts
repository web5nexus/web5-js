import fs from 'fs'
import { Network } from '../dto'
import { EvmE2eUtils } from './rpc/evm/evm.e2e.utils'

describe.skip('IPFS', () => {
  it('should upload file to IPFS', async () => {
    const web5js = await EvmE2eUtils.initWeb5js(Network.ETHEREUM, process.env.V4_API_KEY_MAINNET)
    const fileData = fs.readFileSync('./test.txt') // Adjust the path to your file
    const response = await web5js.ipfs.uploadFile({ file: fileData })
    expect(response.status).toBe('SUCCESS')
    expect(response.data.ipfsHash).toBeDefined()
  })
})
