import { Container, Service } from 'typedi'
import { CONFIG } from '../../../util'
import { Web5jsConfig } from '../../web5js'
import { AbstractBatchRpc } from './AbstractBatchRpc'

@Service({
  factory: (data: { id: string }) => {
    return new GenericRpc(data.id)
  },
  transient: true,
})
export class GenericRpc extends AbstractBatchRpc {
  protected readonly config: Web5jsConfig

  constructor(id: string) {
    super(id)
    this.config = Container.of(id).get(CONFIG)
  }
}
