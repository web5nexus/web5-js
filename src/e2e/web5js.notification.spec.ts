import { Network } from '../dto'
import { Ethereum, FullSdk, NotificationSubscription, Web5jsSDK } from '../service'
import { Status } from '../util'
import {
  AddressEventNetworks,
  ContractAddressLogEventNetworks,
  FailedTxPerBlockNetworks,
  FungibleTxNetworks,
  IncomingNativeTxNetworks,
  InternalTxNetworks,
  MultitokenNetworks,
  NftNetworks,
  OutgoingFailedNetworks,
  OutgoingNativeTxNetworks,
  PaidFeeNetworks,
  TestConst,
} from './e2e.constant'
import { e2eUtil } from './e2e.util'

// TODO pipeline dont work with API keys

describe('notification', () => {
  beforeAll(async () => {
    const web5js = await Web5jsSDK.init<Ethereum>(e2eUtil.initConfig(Network.ETHEREUM))
    const notifications = await web5js.notification.getAll()

    if (notifications?.data?.length > 0) {
      for (const notification of notifications.data as NotificationSubscription[]) {
        await web5js.notification.unsubscribe(notification.id)
      }
    }
  })
  describe('createSubscription', () => {
    describe('IP auth', () => {
      describe('Address Event', () => {
        it.each(Object.values(AddressEventNetworks))('OK %s', async (network: Network) => {
          const web5js = await Web5jsSDK.init<FullSdk>(e2eUtil.initConfig(network))
          await e2eUtil.subscriptions.testAddressBasedSubscription(
            web5js,
            e2eUtil.subscriptions.getAddress(network),
            web5js.notification.subscribe.addressEvent,
          )
        })
      })

      describe('Incoming Native Tx', () => {
        it.each(Object.values(IncomingNativeTxNetworks))('OK %s', async (network: Network) => {
          const web5js = await Web5jsSDK.init<Ethereum>(e2eUtil.initConfig(network))
          await e2eUtil.subscriptions.testAddressBasedSubscription(
            web5js,
            e2eUtil.subscriptions.getAddress(network),
            web5js.notification.subscribe.incomingNativeTx,
          )
        })
      })

      describe('Outgoing Native Tx', () => {
        it.each(Object.values(OutgoingNativeTxNetworks))('OK %s', async (network: Network) => {
          const web5js = await Web5jsSDK.init<Ethereum>(e2eUtil.initConfig(network))
          await e2eUtil.subscriptions.testAddressBasedSubscription(
            web5js,
            e2eUtil.subscriptions.getAddress(network),
            web5js.notification.subscribe.outgoingNativeTx,
          )
        })
      })

      describe('Outgoing Failed Tx', () => {
        it.each(Object.values(OutgoingFailedNetworks))('OK %s', async (network: Network) => {
          const web5js = await Web5jsSDK.init<Ethereum>(e2eUtil.initConfig(network))
          await e2eUtil.subscriptions.testAddressBasedSubscription(
            web5js,
            e2eUtil.subscriptions.getAddress(network),
            web5js.notification.subscribe.outgoingFailedTx,
          )
        })
      })

      describe('Paid Fee', () => {
        it.each(Object.values(PaidFeeNetworks))('OK %s', async (network: Network) => {
          const web5js = await Web5jsSDK.init<Ethereum>(e2eUtil.initConfig(network))
          await e2eUtil.subscriptions.testAddressBasedSubscription(
            web5js,
            e2eUtil.subscriptions.getAddress(network),
            web5js.notification.subscribe.paidFee,
          )
        })
      })

      describe('Incoming Internal Tx', () => {
        it.each(Object.values(InternalTxNetworks))('OK %s', async (network: Network) => {
          const web5js = await Web5jsSDK.init<Ethereum>(e2eUtil.initConfig(network))
          await e2eUtil.subscriptions.testAddressBasedSubscription(
            web5js,
            e2eUtil.subscriptions.getAddress(network),
            web5js.notification.subscribe.incomingInternalTx,
          )
        })
      })

      describe('Outgoing Internal Tx', () => {
        it.each(Object.values(InternalTxNetworks))('OK %s', async (network: Network) => {
          const web5js = await Web5jsSDK.init<Ethereum>(e2eUtil.initConfig(network))
          await e2eUtil.subscriptions.testAddressBasedSubscription(
            web5js,
            e2eUtil.subscriptions.getAddress(network),
            web5js.notification.subscribe.outgoingInternalTx,
          )
        })
      })

      describe('Incoming Fungible Tx', () => {
        it.each(Object.values(FungibleTxNetworks))('OK %s', async (network: Network) => {
          const web5js = await Web5jsSDK.init<Ethereum>(e2eUtil.initConfig(network))
          await e2eUtil.subscriptions.testAddressBasedSubscription(
            web5js,
            e2eUtil.subscriptions.getAddress(network),
            web5js.notification.subscribe.incomingFungibleTx,
          )
        })
      })

      describe('Outgoing Fungible Tx', () => {
        it.each(Object.values(FungibleTxNetworks))('OK %s', async (network: Network) => {
          const web5js = await Web5jsSDK.init<Ethereum>(e2eUtil.initConfig(network))
          await e2eUtil.subscriptions.testAddressBasedSubscription(
            web5js,
            e2eUtil.subscriptions.getAddress(network),
            web5js.notification.subscribe.outgoingFungibleTx,
          )
        })
      })

      describe('Incoming Nft Tx', () => {
        it.each(Object.values(NftNetworks))('OK %s', async (network: Network) => {
          const web5js = await Web5jsSDK.init<Ethereum>(e2eUtil.initConfig(network))
          await e2eUtil.subscriptions.testAddressBasedSubscription(
            web5js,
            e2eUtil.subscriptions.getAddress(network),
            web5js.notification.subscribe.incomingNftTx,
          )
        })
      })

      describe('Outgoing Nft Tx', () => {
        it.each(Object.values(NftNetworks))('OK %s', async (network: Network) => {
          const web5js = await Web5jsSDK.init<Ethereum>(e2eUtil.initConfig(network))
          await e2eUtil.subscriptions.testAddressBasedSubscription(
            web5js,
            e2eUtil.subscriptions.getAddress(network),
            web5js.notification.subscribe.outgoingNftTx,
          )
        })
      })

      describe('Incoming Multitoken Tx', () => {
        it.each(Object.values(MultitokenNetworks))('OK %s', async (network: Network) => {
          const web5js = await Web5jsSDK.init<Ethereum>(e2eUtil.initConfig(network))
          await e2eUtil.subscriptions.testAddressBasedSubscription(
            web5js,
            e2eUtil.subscriptions.getAddress(network),
            web5js.notification.subscribe.incomingMultitokenTx,
          )
        })
      })

      describe('Outgoing Multitoken Tx', () => {
        it.each(Object.values(MultitokenNetworks))('OK %s', async (network: Network) => {
          const web5js = await Web5jsSDK.init<Ethereum>(e2eUtil.initConfig(network))
          await e2eUtil.subscriptions.testAddressBasedSubscription(
            web5js,
            e2eUtil.subscriptions.getAddress(network),
            web5js.notification.subscribe.outgoingMultitokenTx,
          )
        })
      })

      describe('Failed Txs Per Block', () => {
        it.each(Object.values(FailedTxPerBlockNetworks))('OK %s', async (network: Network) => {
          const web5js = await Web5jsSDK.init<Ethereum>(e2eUtil.initConfig(network))
          await e2eUtil.subscriptions.testBlockBasedSubscription(
            web5js,
            web5js.notification.subscribe.failedTxsPerBlock,
          )
        })
      })

      describe('Contract Address Log Event', () => {
        it.each(Object.values(ContractAddressLogEventNetworks))('OK %s', async (network: Network) => {
          const web5js = await Web5jsSDK.init<Ethereum>(e2eUtil.initConfig(network))
          await e2eUtil.subscriptions.testContractBasedSubscription(
            web5js,
            e2eUtil.subscriptions.getAddress(network),
            web5js.notification.subscribe.contractAddressLogEvent,
          )
        })
      })
    })

    it('NOK - existing subscription ', async () => {
      const web5js = await Web5jsSDK.init<Ethereum>(e2eUtil.initConfig(Network.ETHEREUM))
      await web5js.notification.subscribe.addressEvent({
        url: 'https://web5js.com',
        address: TestConst.EXISTING_SUBSCRIPTION_ETH_ADDRESS,
      })

      const { status, error } = await web5js.notification.subscribe.addressEvent({
        url: 'https://web5js.io',
        address: TestConst.EXISTING_SUBSCRIPTION_ETH_ADDRESS,
      })

      expect(status).toEqual(Status.ERROR)
      expect(error?.message[0]).toMatch(
        /^Subscription for type ADDRESS_EVENT on the address id 0xbaf6dc2e647aeb6f510f9e318856a1bcd66c5e19 and currency ETH already exists./,
      )
      expect(error?.code).toEqual('subscription.exists.on.address-and-currency')
      await web5js.destroy()
    })

    it('NOK - invalid address', async () => {
      const web5js = await Web5jsSDK.init<Ethereum>(e2eUtil.initConfig(Network.ETHEREUM))

      const { status, error } = await web5js.notification.subscribe.addressEvent({
        url: 'https://web5js.io',
        address: TestConst.INVALID_ETH_ADDRESS,
      })
      expect(status).toEqual(Status.ERROR)
      expect(error?.message).toEqual([
        'address must be a valid ETH address. Address must start with 0x and must contain 40 hexadecimal characters after and have the correct checksum. ',
      ])
      expect(error?.code).toEqual('validation.failed')
      await web5js.destroy()
    })
  })

  describe('deleteSubscription', () => {
    it('OK', async () => {
      const web5js = await Web5jsSDK.init<Ethereum>(e2eUtil.initConfig(Network.ETHEREUM_SEPOLIA))
      const address = e2eUtil.subscriptions.getAddress(Network.ETHEREUM_SEPOLIA)
      const { data: subscribeData } = await web5js.notification.subscribe.addressEvent({
        url: 'https://web5js.io',
        address,
      })
      const { id } = subscribeData
      await web5js.notification.unsubscribe(id)
      const { data } = await web5js.notification.getAll()
      const subscriptions = data.find(
        (s) => s.network === Network.ETHEREUM && s.address?.toLowerCase() === address.toLowerCase(),
      ) as NotificationSubscription
      expect(subscriptions).toEqual(undefined)
      await web5js.destroy()
    })

    it('NOK - invalid subscription', async () => {
      const web5js = await Web5jsSDK.init<Ethereum>(e2eUtil.initConfig(Network.ETHEREUM_SEPOLIA))
      const { data, status, error } = await web5js.notification.unsubscribe('invalid-subscription-id')
      expect(data).toEqual(null)
      expect(status).toEqual(Status.ERROR)
      expect((error?.message as object[])[0]).toEqual(
        'id should be valid id and 24 characters long, e.g. 6398ded68bfa23a9709b1b17',
      )
      await web5js.destroy()
    })
  })

  it('getAll', async () => {
    const web5js = await Web5jsSDK.init<Ethereum>(e2eUtil.initConfig(Network.ETHEREUM))
    const { data } = await web5js.notification.getAll()
    expect(data).not.toHaveLength(0)
    expect(data[0].id).toBeDefined()
    expect(data[0].network).toBeDefined()
    expect(data[0].address).toBeDefined()
    expect(data[0].url).toBeDefined()
    expect(data[0].type).toBeDefined()
    expect(data.length).toBeGreaterThan(0)
    await web5js.destroy()
  })

  // TODO pipeline dont work with this test - IP auth
  it.skip('getAllExecutedWebhooks', async () => {
    const web5js = await Web5jsSDK.init<Ethereum>(e2eUtil.initConfig(Network.ETHEREUM_SEPOLIA))
    const { data } = await web5js.notification.getAllExecutedWebhooks()
    expect(data[0].type).toBeDefined()
    expect(data[0].id).toBeDefined()
    expect(data[0].subscriptionId).toBeDefined()
    expect(data[0].url).toBeDefined()
    expect(data[0].data).toBeDefined()
    expect(data[0].timestamp).toBeDefined()
    expect(data[0].failed).toBeDefined()
    expect(data[0].response).toBeDefined()
    await web5js.destroy()
  })
})
