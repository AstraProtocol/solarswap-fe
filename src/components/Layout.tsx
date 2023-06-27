import clsx from 'clsx'
import React, { ReactNode, Suspense, useEffect, useMemo } from 'react'
import { Footer, PageLoader, ToastWrapper } from '@astraprotocol/astra-ui'
import { FooterColumnLink } from '@astraprotocol/astra-ui/lib/es/components/Footer/FooterLink'
import styles from './Layout.module.scss'
import { useTheme } from 'next-themes'
import Navbar from './Navbar'
import useModal from './Modal/useModal'
import WalletWrongNetworkModal from './Wallet/WalletWrongNetworkModal'
import { useConnectWallet, useSetChain } from '@web3-onboard/react'
import { useTranslation } from 'contexts/Localization'
import useMatchBreakpoints from 'hooks/useMatchBreakpoints'
import { CHAIN_ID } from 'config/constants/networks'
import { useWeb3React } from '@web3-react/core'
import { connectorsByName } from 'utils/web3React'
import { ConnectorNames } from 'config/constants'

type Props = {
	children: ReactNode
}

const Layout: React.FC<Props> = props => {
	const { isMobile } = useMatchBreakpoints()
	const [onPresentWalletWrongNetworkModal] = useModal(<WalletWrongNetworkModal />)
	const [{ connectedChain }] = useSetChain()
	const _needToChangeNetwork = () => connectedChain && parseInt(connectedChain?.id, 16) !== parseInt(CHAIN_ID, 10)

	const [{ wallet }] = useConnectWallet()
	const account = wallet?.accounts[0].address

	const { activate, active } = useWeb3React()

	const { resolvedTheme } = useTheme()
	const { t, currentLanguage } = useTranslation()

	const footerLinks: FooterColumnLink[] = useMemo(
		() => [
			[
				{ label: t('About us'), link: 'https://astranaut.io' },
				{ label: t('Explorer'), link: 'https://explorer.astranaut.io' },
				{ label: t('Bridge'), link: 'https://bridge.astranaut.io' },
				{ label: t('DEX'), link: 'https://solarswap.io' },
			],
			[
				{ label: t('Documents'), link: 'https://docs.astranaut.io' },
				{ label: t('Whitepaper'), link: 'https://astranaut.io' },
			],
			[
				{ label: t('Privacy and Policy'), link: 'https://astranaut.io/' },
				{ label: t('Term and Services'), link: 'https://astranaut.io/' },
				{ label: t('FAQs'), link: 'https://astranaut.io/' },
				{ label: t('Live Support'), link: 'https://astranaut.io/' },
			],
		],
		[currentLanguage],
	)

	useEffect(() => {
		if (account) {
			if (!active) {
				activate(connectorsByName[ConnectorNames.Injected])
			}
		}
	}, [account])

	useEffect(() => {
		if (_needToChangeNetwork()) {
			onPresentWalletWrongNetworkModal()
		}
	}, [connectedChain])

	return (
		<Suspense fallback={<PageLoader />}>
			<div className={clsx(`${resolvedTheme}--mode`, styles.layoutContainer)}>
				<Navbar />
				<div className={styles.layout}>{props.children}</div>
				{!isMobile && (
					<Footer
						footerSocialTitle={t('Connect with us')}
						footerLinks={footerLinks}
						logoTitle={process.env.NEXT_PUBLIC_TITLE}
					/>
				)}
				<div id="modal-root"></div>
				<ToastWrapper />
			</div>
		</Suspense>
	)
}

export default Layout
