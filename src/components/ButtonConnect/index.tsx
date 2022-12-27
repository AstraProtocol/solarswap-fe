import { Col, NormalButton, Row } from '@astraprotocol/astra-ui'
import { useConnectWallet } from '@web3-onboard/react'
import { ConnectorNames } from 'config/constants'
import { useTranslation } from 'contexts/Localization'
import useAuth from 'hooks/useAuth'
import { isEmpty } from 'lodash'
import { useCallback } from 'react'
import { WalletHelper } from 'utils/wallet'

export default function ButtonConnect() {
	const [{ wallet }, connect] = useConnectWallet()
	const { t } = useTranslation()
	const { login, logout } = useAuth()

	const _connectWallet = useCallback(async () => {
		const connectedWallets = await connect()
		if (!isEmpty(connectedWallets)) {
			const connectedWalletsLabelArray = connectedWallets.map(({ label }) => label)
			WalletHelper.saveCacheConnect(connectedWalletsLabelArray)
			if (connectedWalletsLabelArray[0] == 'MetaMask') {
				login(ConnectorNames.Injected)
				localStorage.setItem('wallet', 'Metamask')
				localStorage.setItem('connectorIdv2', ConnectorNames.Injected)
			}
		} else {
		}
	}, [connect, login])
	if (wallet) return null
	return (
		<NormalButton
			classes={{
				other: 'text-base text-bold',
				color: 'contrast-color-100',
				background: 'primary-bg-color-normal',
				boxShadowHoverColor: 'rgb(227 17 80 / 42%)'
			}}
			onClick={_connectWallet}
		>
			{t('Connect Wallet')}
		</NormalButton>
	)
}

ButtonConnect.messages = ['Wallet']
