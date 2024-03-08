import { Container, Service } from 'typedi'
import { Web5jsConnector } from '../../connector/web5js.connector'
import { ErrorUtils, ResponseDto } from '../../util'
import { Rate, RateBatchDto } from './rates.dto'

@Service({
  factory: (data: { id: string }) => {
    return new Rates(data.id)
  },
  transient: true,
})
export class Rates {
  private connector: Web5jsConnector

  constructor(private readonly id: string) {
    this.connector = Container.of(this.id).get(Web5jsConnector)
  }

  getCurrentRate(currency: string, basePair: string): Promise<ResponseDto<Rate>> {
    return ErrorUtils.tryFail(async () => {
      return this.connector.get<Rate>({
        path: `rate/${currency}`,
        params: { basePair },
      })
    })
  }

  getCurrentRateBatch(pairs: RateBatchDto[]): Promise<ResponseDto<Rate[]>> {
    pairs.forEach((pair) => {
      if (!pair.batchId) {
        pair.batchId = `${pair.currency}/${pair.basePair}`
      }
    })
    return ErrorUtils.tryFail(async () => {
      return this.connector.post<Rate[]>({
        path: `rate`,
        body: pairs,
      })
    })
  }
}
