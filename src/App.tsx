import Root from './Root/inexx'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { bscTestnet, bsc } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { Web3Modal } from '@web3modal/react'
import { EthereumClient, w3mConnectors } from '@web3modal/ethereum'


export default function App() {

  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [bsc],
    [publicProvider()],
  )

  const projectId = "30b906aa0e142ee096405a1716b9063f"

  const wagmiConfig = createConfig({
    autoConnect: true,
    publicClient,
    webSocketPublicClient,
    connectors: [
      ...w3mConnectors({ projectId, chains })
    ],
  })

  const ethereumClient = new EthereumClient(wagmiConfig, chains)

  return (
    <>
      <WagmiConfig config={wagmiConfig} >
        <Root />
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      </WagmiConfig>
    </>
  )
}