import Script from 'next/script'
import dynamic from 'next/dynamic'
import BigNumber from 'bignumber.js'
import { NextPage } from 'next'
// import GlobalCheckClaimStatus from "components/GlobalCheckClaimStatus";
// import FixedSubgraphHealthIndicator from "components/SubgraphHealthIndicator";
// import useEagerConnect from "hooks/useEagerConnect";
import { useInactiveListener } from 'hooks/useInactiveListener'
import useSentryUser from 'hooks/useSentryUser'
// import useUserAgent from "hooks/useUserAgent";
import type { AppProps } from 'next/app'
import { init, Web3OnboardProvider } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'
import Head from 'next/head'
import { Fragment } from 'react'
import { PersistGate } from 'redux-persist/integration/react'
import { useStore, persistor } from 'state'
import { usePollBlockNumber } from 'state/block/hooks'
import { usePollCoreFarmData } from 'state/farms/hooks'
import astraConnectModule from 'libs/astrawallet'
import '@astraprotocol/astra-ui/lib/shared/style.css'
import { Blocklist, Updaters } from '..'
import ErrorBoundary from '../components/ErrorBoundary'
// import Menu from '../components/Menu'
import Providers from '../Providers'
// import GlobalStyle from '../style/Global'
import '../../style.scss'
import Layout from 'components/Layout'
import { CHAIN_ID } from 'config/constants/networks'
import getNodeUrl from 'utils/getRpcUrl'
import { WalletHelper } from 'utils/wallet'
import 'react-toastify/dist/ReactToastify.css'
import useEagerConnect from 'hooks/useEagerConnect'
import { AppState } from '../state'
import { PageLoader } from '@astraprotocol/astra-ui'
// const EasterEgg = dynamic(() => import('components/EasterEgg'), { ssr: false })

// This config is required for number formatting
BigNumber.config({
	EXPONENTIAL_AT: 1000,
	DECIMAL_PLACES: 80,
})

console.log('CHAIN_ID', process.env.NEXT_PUBLIC_CHAIN_ID)
const chainId = parseInt(CHAIN_ID || '11115')

function GlobalHooks() {
	usePollBlockNumber()
	usePollCoreFarmData()
	useEagerConnect()
	// useUserAgent()
	useInactiveListener()
	useSentryUser()
	return null
}

const walletConnect = walletConnectModule({
	qrcodeModalOptions: {
		mobileLinks: ['metamask', 'trust'],
	},
	connectFirstChainId: true,
})

const astraWallet = astraConnectModule({
	icon: '/images/logo/asa.svg',
	chainId,
	rpcUrl: getNodeUrl(),
	onAppDisconnect: () => WalletHelper.removeCacheConnect(),
	metadata: {
		description: process.env.NEXT_PUBLIC_TITLE,
		name: process.env.NEXT_PUBLIC_TITLE,
		url: typeof window !== 'undefined' ? window.location.origin : '',
		icons: [''],
	},
})
const wallets = [injectedModule(), walletConnect, astraWallet]

const web3Onboard = init({
	wallets,
	chains: [
		{
			id: `0x${chainId.toString(16)}`,
			token: 'ASA',
			label: 'Astra testnet',
			rpcUrl: getNodeUrl(),
			icon: '/images/logo/transparent_logo.svg',
			blockExplorerUrl: process.env.NEXT_PUBLIC_EXPLORER,
		},
	],
	appMetadata: {
		name: 'Solarswap',
		icon: '/images/logo/asa.svg',
		description: 'Solarswap',
	},
	notify: {
		desktop: {
			enabled: false,
			transactionHandler: () => {},
		},
		mobile: {
			enabled: false,
			transactionHandler: () => {},
		},
	},
	accountCenter: {
		desktop: {
			enabled: false,
		},
		mobile: {
			enabled: false,
		},
	},
})

interface AppPropsExtends extends AppProps {
	pageProps: {
		[key: string]: any
		initialReduxState: AppState
	}
}

function MyApp(props: AppPropsExtends) {
	const { pageProps } = props
	const store = useStore(pageProps.initialReduxState)

	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1, viewport-fit=cover"
				/>
				<meta
					name="description"
					content="Swap, earn and win ASA through yield farming on the first DEFI exchange for Astra token."
				/>
				<meta name="theme-color" content="#1FC7D4" />
				<meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_HOST}/images/preview.png`} />
				<meta
					name="twitter:description"
					content="Swap, earn and win ASA through yield farming on the first DEFI exchange for Astra token."
				/>
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="SolarSwap - A DEFI exchange on Astra Blockchain" />
				<title>SolarSwap</title>
			</Head>
			<Web3OnboardProvider web3Onboard={web3Onboard}>
				<Providers store={store}>
					<Blocklist>
						<GlobalHooks />
						<Updaters />
						{/* <GlobalStyle /> */}
						{/* <GlobalCheckClaimStatus excludeLocations={[]} /> */}
						<PersistGate loading={<PageLoader />} persistor={persistor}>
							<App {...props} />
						</PersistGate>
					</Blocklist>
				</Providers>
			</Web3OnboardProvider>
		</>
	)
}

type NextPageWithLayout = NextPage & {
	Layout?: React.FC
}

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout
}

const ProductionErrorBoundary = process.env.NODE_ENV === 'production' ? ErrorBoundary : Fragment

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
	// Use the layout defined at the page level, if available
	const ComponentLayout = Component.Layout || Fragment
	return (
		<ProductionErrorBoundary>
			{/* <Menu> */}
			<Layout>
				<ComponentLayout>
					<Component {...pageProps} />
				</ComponentLayout>
			</Layout>
			{/* </Menu> */}
			{/* <EasterEgg iterations={2} /> */}
			{/* <FixedSubgraphHealthIndicator /> */}
		</ProductionErrorBoundary>
	)
}

export default MyApp
