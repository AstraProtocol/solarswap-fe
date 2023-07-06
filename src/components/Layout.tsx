import clsx from 'clsx'
import React, { ReactNode, Suspense, useEffect, useMemo } from 'react'
import { Footer, PageLoader, ToastWrapper, useMobileLayout } from '@astraprotocol/astra-ui'
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
import { getConnectorByLabel } from 'utils/web3React'
import { isAstraApp } from 'utils'
import { FooterLinks } from './FooterLinks'

type Props = {
	children: ReactNode
}

const Layout: React.FC<Props> = props => {
	const {isMobile} = useMobileLayout(960)
	const [onPresentWalletWrongNetworkModal] = useModal(<WalletWrongNetworkModal />)
	const [{ connectedChain }] = useSetChain()
	const _needToChangeNetwork = () => connectedChain && parseInt(connectedChain?.id, 16) !== parseInt(CHAIN_ID, 10)

	const [{ wallet }, connect] = useConnectWallet()
	const account = wallet?.accounts[0].address

	const { activate, active } = useWeb3React()

	const { resolvedTheme } = useTheme()
	const { t } = useTranslation()

	useEffect(() => {
		(async () => {
			if (account) {
				if (!active) {
					const connector = await getConnectorByLabel(wallet.label)
					activate(connector)
				}
			} else if (isAstraApp()) {
				connect({
					autoSelect: {
						label: 'Astra Inject',
						disableModals: true,
					},
				})
			}
		})()
	}, [account, wallet])

	useEffect(() => {
		if (_needToChangeNetwork()) {
			onPresentWalletWrongNetworkModal()
		}
	}, [connectedChain])

	return (
		<Suspense fallback={<PageLoader />}>
			<div
				className={clsx(`${resolvedTheme}--mode`, styles.layoutContainer)}
				style={{ alignContent: 'space-between' }}
			>
				<div>
					<Navbar />
					<div className={styles.layout}>{props.children}</div>
				</div>
				<div>
					<Footer
						logoTitle={process.env.NEXT_PUBLIC_TITLE}
						logoType="swap"
						footerLinks={isMobile ? FooterLinks: undefined}
						i18n={t}
						isVerifyByCertik={false}
						className={clsx(styles.footerBg, styles.footerLayout)}
					/>
					<div id="modal-root"></div>
					<ToastWrapper />
				</div>
			</div>
		</Suspense>
	)
}

export default Layout
