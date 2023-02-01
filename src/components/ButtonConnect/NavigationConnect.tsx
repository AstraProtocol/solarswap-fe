import { CryptoIcon, ellipseBetweenText, Icon, IconEnum, Row } from '@astraprotocol/astra-ui'
import { useConnectWallet } from '@web3-onboard/react'
import clsx from 'clsx'

import { useTranslation } from 'contexts/Localization'
import useAuth from 'hooks/useAuth'
import useMatchBreakpoints from 'hooks/useMatchBreakpoints'
import { useCallback } from 'react'
import { WalletHelper } from 'utils/wallet'

import ButtonConnect from '.'
import styles from './styles.module.scss'

export default function NavigationConnect({ classes = '' }) {
	const [{ wallet }, connect, disconnect] = useConnectWallet()
	const { logout } = useAuth()
	const { t } = useTranslation()
	const { isMobile } = useMatchBreakpoints()

	const onDisconnect = useCallback(() => {
		disconnect(wallet)
		logout()
		WalletHelper.removeCacheConnect()
	}, [wallet])

	if (wallet) {
		const account = wallet.accounts[0]
		return (
			<div
				className={clsx(styles.item, 'radius-lg block-center', {
					['margin-left-lg']: !isMobile,
				})}
			>
				<div className="flex row flex-align-center text-base text-bold">
					<CryptoIcon name="asa" />
					<span className="text text-base margin-left-sm  margin-right-2xs">
						{ellipseBetweenText(account.address, 6, 6)}
					</span>
					<Icon icon={IconEnum.ICON_DROPDOWN} />
				</div>
				<div className={clsx(styles.subItem, 'radius-lg col block-center')}>
					<div
						onClick={onDisconnect}
						className="flex link row flex-align-center width-100 padding-top-sm padding-bottom-sm flex-justify-center"
					>
						<Icon icon={IconEnum.ICON_SETTING} className="icon-setting text-xl" />
						<span className="text text-base margin-left-sm">{t('Disconnect Wallet')}</span>
					</div>
				</div>
			</div>
		)
	}
	return <ButtonConnect classes={isMobile ? 'width-100' : 'margin-left-lg'} />
}
