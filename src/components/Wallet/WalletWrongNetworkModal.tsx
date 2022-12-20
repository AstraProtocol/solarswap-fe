import { Modal } from 'components/Modal'
import React, { useEffect } from 'react'
import { Col, CryptoIcon, NormalButton, Row } from '@astraprotocol/astra-ui'
import { init, useSetChain } from '@web3-onboard/react'
import { useTranslation } from 'contexts/Localization'
import { InjectedProps } from '../Modal/types'
import decimalToHex from '../../utils/numberHelper'

const WalletWrongNetworkModal: React.FC<InjectedProps> = ({ onDismiss }) => {
	const { t } = useTranslation()
	const [{ chains, connectedChain }, setChain] = useSetChain()
	var chainId: string = process.env.NEXT_PUBLIC_CHAIN_ID || '11115'
	const _changeChain = () => {
		setChain({
			chainId: decimalToHex(parseInt(chainId)),
			chainNamespace: 'evm'
		})
	}

	useEffect(() => {
		if (parseInt(connectedChain?.id, 16) == parseInt(process.env.NEXT_PUBLIC_CHAIN_ID, 10)) {
			onDismiss()
		}
	}, [connectedChain])

	return (
		<Modal title={t('You’re connected to the wrong network.')} onDismiss={onDismiss}>
			<NormalButton onClick={_changeChain}>{t('Switch Network')}</NormalButton>
		</Modal>
	)
}

export default WalletWrongNetworkModal
