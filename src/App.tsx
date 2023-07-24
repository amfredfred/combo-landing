import Root from './Root/inexx'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { bscTestnet, bsc } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'



export default function App() {

  const { publicClient, webSocketPublicClient } = configureChains(
    [bsc, bscTestnet],
    [publicProvider()]
  )

  const wagmiConfig = createConfig({
    autoConnect: true,
    publicClient,
    webSocketPublicClient,
  })

  return (
    <>
      <WagmiConfig config={wagmiConfig} >
        <Root />
      </WagmiConfig>
      {/* <Web3Modal0
        projectId={projectId}
        ethereumClient={ethereumClient}
      /> */}
    </>
  )
}