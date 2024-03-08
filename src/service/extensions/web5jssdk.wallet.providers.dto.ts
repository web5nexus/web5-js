import { IWeb5jsSdkContainer } from './web5jssdk.container'
import { Web5jsSdkExtension } from './web5jssdk.extensions.dto'

export type TxId = string

/**
 * Web5jsSdkWalletProvider serves as the base class for all wallet providers.
 *
 * @template T Represents the wallet type (e.g., accountId for MetaMask, mnemonic and xpub for local wallets).
 * @template P Represents the transaction payload type specific to a blockchain or transaction.
 *
 * @method getWallet Fetches or initializes the wallet of type T.
 * @method signAndBroadcast Signs a transaction based on the provided payload of type P and broadcasts it to the network.
 */
export abstract class Web5jsSdkWalletProvider<T, P> extends Web5jsSdkExtension {
  abstract getWallet(): Promise<T>
  abstract signAndBroadcast(payload: P): Promise<TxId>
}

export type WalletProviderConstructor = new (
  web5jsSdkContainer: IWeb5jsSdkContainer,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
Web5jsSdkWalletProvider<any, any>

export type WalletProviderWithConfig = {
  type: WalletProviderConstructor
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any
}

export type WalletProviderConstructorOrConfig = WalletProviderConstructor | WalletProviderWithConfig
