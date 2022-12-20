import { CSSProperties } from 'react'
import { Token } from '@solarswap/sdk'
// import { Button, Text, CheckmarkCircleIcon, useMatchBreakpoints } from '@solarswap/uikit'
// import { AutoRow, RowFixed } from 'components/Layout/Row'
// import { AutoColumn } from 'components/Layout/Column'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { ListLogo } from 'components/Logo'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCombinedInactiveList } from 'state/lists/hooks'
// import styled from 'styled-components'
import { useIsUserAddedToken, useIsTokenActive } from 'hooks/Tokens'
import { useTranslation } from 'contexts/Localization'
import { Icon, IconEnum, NormalButton, Row } from '@astraprotocol/astra-ui'
import styles from './styles.module.scss';
import useMatchBreakpoints from 'hooks/useMatchBreakpoints'

// const TokenSection = styled.div<{ dim?: boolean }>`
// 	padding: 4px 20px;
// 	height: 56px;
// 	display: grid;
// 	grid-template-columns: auto minmax(auto, 1fr) auto;
// 	grid-gap: 10px;
// 	align-items: center;

// 	opacity: ${({ dim }) => (dim ? '0.4' : '1')};

// 	${({ theme }) => theme.mediaQueries.md} {
// 		grid-gap: 16px;
// 	}
// `

// const CheckIcon = styled(CheckmarkCircleIcon)`
//   height: 16px;
//   width: 16px;
//   margin-right: 6px;
//   stroke: ${({ theme }) => theme.colors.success};
// `

// const NameOverflow = styled.div`
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   max-width: 140px;
//   font-size: 12px;
// `

export default function ImportRow({
	token,
	style,
	dim,
	showImportView,
	setImportToken
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
			<CurrencyLogo  currency={token} size={isMobile ? '20px' : '24px'} style={{ opacity: dim ? '0.6' : '1' }} />
			<div style={{ opacity: dim ? '0.6' : '1' }}>
				<Row>
					<span mr="8px">{token.symbol}</span>
					<span color="textDisabled">
						<div className={styles.nameOverflow} title={token.name}>{token.name}</NameOverflow>
					</span>
				</Row>
				{list && list.logoURI && (
					<Row>
						<span fontSize={isMobile ? '10px' : '14px'} mr="4px" color="textSubtle">
							{t('via')} {list.name}
						</span>
						<ListLogo logoURI={list.logoURI} size="12px" />
					</Row>
				)}
			</div>
			{!isActive && !isAdded ? (
				<NormalButton
					// scale={isMobile ? 'sm' : 'md'}
					// width="fit-content"
					onClick={() => {
						if (setImportToken) {
							setImportToken(token)
						}
						showImportView()
					}}
				>
					{t('Import')}
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
