import { Container, Service } from 'typedi'
import { IWeb5jsSdkContainer, Web5jsSdkWalletProvider } from '../extensions'

@Service({
  factory: (data: { id: string }) => {
    return new WalletProvider(data.id)
  },
  transient: true,
})
export class WalletProvider {
  constructor(private readonly id: string) {}

  /**
   * Works are an entrypoint to interact with wallet providers of choice.
   * @param type - Wallet Provider type imported to the SDK instance
   */
  use<T, P, E extends Web5jsSdkWalletProvider<T, P>>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: new (web5jsSdkContainer: IWeb5jsSdkContainer, ...args: any[]) => E,
  ): E {
    return Container.of(this.id).get(type)
  }
}
