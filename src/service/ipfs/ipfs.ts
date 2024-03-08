import { Container, Service } from 'typedi'
import { Web5jsConnector } from '../../connector/web5js.connector'
import { CONFIG, ErrorUtils, ResponseDto } from '../../util'
import { Web5jsConfig } from '../web5js'
import { GetFile, UploadFile } from './ipfs.dto'

@Service({
  factory: (data: { id: string }) => {
    return new Ipfs(data.id)
  },
  transient: true,
})
export class Ipfs {
  protected readonly connector: Web5jsConnector
  protected readonly config: Web5jsConfig

  constructor(private readonly id: string) {
    this.config = Container.of(this.id).get(CONFIG)
    this.connector = Container.of(this.id).get(Web5jsConnector)
  }

  /**
   * Upload file to the IPFS storage.
   * @param body Body of the request with file to be uploaded.
   * @returns ResponseDto<{txId: string}> IPFS hash id of the uploaded file.
   */
  async uploadFile(body: UploadFile): Promise<ResponseDto<{ ipfsHash: string }>> {
    return ErrorUtils.tryFail(() =>
      this.connector.uploadFile<{ ipfsHash: string }>({
        path: `ipfs`,
        body: body.file,
      }),
    )
  }

  /**
   * Get file binary data from the IPFS storage.
   * @param body Body of the request with file to be uploaded.
   * @returns Blob IPFS file binary data.
   * @returns ResponseDto<null> is error occurred.
   */
  async getFile(body: GetFile): Promise<Blob | ResponseDto<null>> {
    return ErrorUtils.tryFailBlob(() =>
      this.connector.getFile<Blob>({
        path: `ipfs/${body.id}`,
      }),
    )
  }
}
