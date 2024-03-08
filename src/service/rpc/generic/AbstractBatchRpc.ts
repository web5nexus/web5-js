/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container } from 'typedi'
import { Web5jsConnector } from '../../../connector/web5js.connector'
import { JsonRpcCall, JsonRpcResponse } from '../../../dto'
import { AbstractRpcInterface } from '../../../dto/rpc/AbstractJsonRpcInterface'
import { CONFIG, Utils } from '../../../util'
import { Web5jsConfig } from '../../web5js'

export abstract class AbstractBatchRpc implements AbstractRpcInterface {
  protected readonly connector: Web5jsConnector
  protected readonly config: Web5jsConfig

  protected constructor(private readonly id: string) {
    this.connector = Container.of(this.id).get(Web5jsConnector)
    this.config = Container.of(this.id).get(CONFIG)
  }

  getRpcNodeUrl(subPath?: string): string {
    return Utils.getV3RpcUrl(this.config, subPath)
  }

  rawRpcCall(body: JsonRpcCall): Promise<JsonRpcResponse<any>> {
    return this.connector.rpcCall(this.getRpcNodeUrl(), body)
  }

  rawBatchRpcCall(body: JsonRpcCall[]): Promise<JsonRpcResponse<any>[] | JsonRpcResponse<any>> {
    return this.connector.rpcCall(this.getRpcNodeUrl(), body)
  }

  destroy(): void {
    // do nothing
  }
}
