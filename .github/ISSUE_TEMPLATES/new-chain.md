### :bookmark_tabs: Overview
We're thrilled to announce that the Web5js JS SDK now includes support for additional network: **Ethereum** :tada:.
Users can now make RPC calls to this network directly from the SDK.

### :wrench: Changes
- :heavy_plus_sign: Added RPC methods for Ethereum network

### :computer: How to Use
To make RPC calls to this new network, you'll need to specify the network type when initializing your Web5js SDK instance. Here's an example based on your provided code:
```typescript
import { Web5jsSDK, Network, Ethereum } from '@web5nexus/web5js'

const web5js = await Web5jsSDK.init<Ethereum>({ network: Network.ETHEREUM })

const { result } = await web5js.rpc.getBalance('your-address-here')
console.log(`Balance: ${result}`)

// Destroy Web5js SDK - needed for stopping background jobs
web5js.destroy()
```

### :loudspeaker: Feedback
Your input is crucial as we continue to develop and refine this feature. If you encounter any issues or have suggestions for improvement, please leave a comment on this issue or open a new one. :speech_balloon:
