import { CSSProperties } from 'react'
import { Token } from '@solarswap/sdk'
// import { Button, Text, CheckmarkCircleIcon, useMatchBreakpoints } from '@solarswap/uikit'
// import { AutoRow, RowFixed } from 'components/Layout/Row'
// import { AutoColumn } from 'components/Layout/Column'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { ListLogo } from 'components/Logo'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCombinedInactiveList } from 'state/lists/hooks'

import { useIsUserAddedToken, useIsTokenActive } from 'hooks/Tokens'
import { useTranslation } from 'contexts/Localization'
import { Icon, IconEnum, NormalButton, Row } from '@astraprotocol/astra-ui'
import styles from './styles.module.scss'
import useMatchBreakpoints from 'hooks/useMatchBreakpoints'
import clsx from 'clsx'

export default function ImportRow({
	token,
	style,
	dim,
	showImportView,
	setImportToken,
}: {
	token: Token
	style?: CSSProperties
	dim?: boolean
	showImportView: () => void
	setImportToken: (token: Token) => void
}) {
	// globals
	const { chainId } = useActiveWeb3React()
	const { isMobile } = useMatchBreakpoints()

	const { t } = useTranslation()

	// check if token comes from list
	const inactiveTokenList = useCombinedInactiveList()
	const list = chainId && inactiveTokenList?.[chainId]?.[token.address]?.list

	// check if already active on list or local storage tokens
	const isAdded = useIsUserAddedToken(token)
	const isActive = useIsTokenActive(token)

	return (
		<div className={styles.tokenSection} style={style}>
			<CurrencyLogo currency={token} size={isMobile ? 20 : 24} style={{ opacity: dim ? '0.6' : '1' }} />
			<div style={{ opacity: dim ? '0.6' : '1' }}>
				<Row style={{ alignItems: 'center' }}>
					<span className="text text-base">{token.symbol}</span>
					<span
						className={clsx(styles.nameOverflow, 'text text-sm contrast-color-50 margin-left-xs')}
						title={token.name}
					>
						{token.name}
					</span>
				</Row>
				{list && list.logoURI && (
					<Row>
						<span className="text text-sm">
							{t('via')} {list.name}
						</span>
						<ListLogo logoURI={list.logoURI} size="12px" />
					</Row>
				)}
			</div>
			{!isActive && !isAdded ? (
				<NormalButton
					classes={{ other: 'token-search-import-button' }}
					onClick={() => {
						if (setImportToken) {
							setImportToken(token)
						}
						showImportView()
					}}
				>
					<span className="text text-base">{t('Import')}</span>
				</NormalButton>
			) : (
				<Row style={{ minWidth: 'fit-content' }}>
					<Icon icon={IconEnum.ICON_CHECKED} />
					<span color="success">Active</span>
				</Row>
			)}
		</div>
	)
}
