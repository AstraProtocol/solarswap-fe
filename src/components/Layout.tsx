import clsx from 'clsx'
import React, { ReactNode, Suspense, useEffect } from 'react'
import { Footer, PageLoader, ToastWrapper, NormalButton } from '@astraprotocol/astra-ui'
import styles from './Layout.module.scss'
import { useTheme } from 'next-themes'
import Navbar from './Navbar'
import useModal from './Modal/useModal'
import WalletWrongNetworkModal from './Wallet/WalletWrongNetworkModal'
import { useSetChain } from '@web3-onboard/react'
import { setupNetwork, registerToken } from 'utils/wallet'

type Props = {
	children: ReactNode
}

const Layout: React.FC<Props> = props => {
	const [onPresentWalletWrongNetworkModal] = useModal(<WalletWrongNetworkModal />)
	const [{ connectedChain }, setChain] = useSetChain()
	const _needToChangeNetwork = () =>
		connectedChain && parseInt(connectedChain?.id, 16) !== parseInt(process.env.NEXT_PUBLIC_CHAIN_ID, 10)

	const { resolvedTheme } = useTheme()

	useEffect(() => {
		if (_needToChangeNetwork()) {
			console.log('Change network')
			onPresentWalletWrongNetworkModal()
		}
	}, [connectedChain])

	return (
		<Suspense fallback={<PageLoader />}>
			<div className={clsx(`${resolvedTheme}--mode`, styles.layoutContainer)}>
				<Navbar />
				<div className={styles.layout}>{props.children}</div>
				<Footer logoTitle={process.env.NEXT_PUBLIC_TITLE} />
				<div id="modal-root"></div>
				<ToastWrapper />
				{/* <NormalButton onClick={() => registerToken('0x2AC90Bd2deE4841b99887623f982D72131Ca52F5', 'XUSD', 18)}>
					Register Token
				</NormalButton> */}
			</div>
		</Suspense>
	)
}

export default Layout
