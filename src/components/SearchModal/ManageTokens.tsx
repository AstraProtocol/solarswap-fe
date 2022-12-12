import { useRef, RefObject, useCallback, useState, useMemo } from 'react'
import { Token } from '@solarswap/sdk'
// import { Text, Button, CloseIcon, IconButton, LinkExternal, Input, Link } from '@solarswap/uikit'

// import Row, { RowBetween, RowFixed } from 'components/Layout/Row'
import { useToken } from 'hooks/Tokens'
import { useRemoveUserAddedToken } from 'state/user/hooks'
import useUserAddedTokens from 'state/user/hooks/useUserAddedTokens'
import { CurrencyLogo } from 'components/Logo'
import { getAstraScanLink, isAddress } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
// import Column, { AutoColumn } from '../Layout/Column'
import ImportRow from './ImportRow'
import { CurrencyModalView } from './types'
import { Form, IconButton, IconEnum, NormalButton, Row, Typography } from '@astraprotocol/astra-ui'

// const Wrapper = styled.div`
//   width: 100%;
//   height: calc(100% - 60px);
//   position: relative;
//   padding-bottom: 60px;
// `

// const Footer = styled.div`
//   position: absolute;
//   bottom: 0;
//   width: 100%;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// `

export default function ManageTokens({
	setModalView,
	setImportToken
}: {
	setModalView: (view: CurrencyModalView) => void
	setImportToken: (token: Token) => void
}) {
	const { chainId } = useActiveWeb3React()

	const { t } = useTranslation()

	const [searchQuery, setSearchQuery] = useState<string>('')

	// manage focus on modal show
	const inputRef = useRef<HTMLInputElement>()
	const handleInput = useCallback(event => {
		const input = event.target.value
		const checksummedInput = isAddress(input)
		setSearchQuery(checksummedInput || input)
	}, [])

	// if they input an address, use it
	const searchToken = useToken(searchQuery)

	// all tokens for local list
	const userAddedTokens: Token[] = useUserAddedTokens()
	const removeToken = useRemoveUserAddedToken()

	const handleRemoveAll = useCallback(() => {
		if (chainId && userAddedTokens) {
			userAddedTokens.forEach(token => {
				return removeToken(chainId, token.address)
			})
		}
	}, [removeToken, userAddedTokens, chainId])

	const tokenList = useMemo(() => {
		return (
			chainId &&
			userAddedTokens.map(token => (
				<Row key={token.address} style={{ justifyContent: 'space-between' }}>
					<Row>
						<CurrencyLogo currency={token} size="20px" />
						<Typography.Link href={getAstraScanLink(token.address, 'address', chainId)}>
							{token.symbol}
						</Typography.Link>
					</Row>
					<Row>
						<IconButton icon={IconEnum.ICON_CLOSE} onClick={() => removeToken(chainId, token.address)} />
						{/* <Typography.Link href={getAstraScanLink(token.address, 'address', chainId)} /> */}
					</Row>
				</Row>
			))
		)
	}, [userAddedTokens, chainId, removeToken])

	const isAddressValid = searchQuery === '' || isAddress(searchQuery)

	return (
		<div>
			<div style={{ width: '100%', flex: '1 1' }}>
				<div>
					<Row>
						<Form.Input
							id="token-search-input"
							// scale="lg"
							placeholder="0x0000"
							value={searchQuery}
							autoComplete="off"
							ref={inputRef as RefObject<HTMLInputElement>}
							onChange={handleInput}
							// isWarning={!isAddressValid}
						/>
					</Row>
					{!isAddressValid && <span color="failure">{t('Enter valid token address')}</span>}
					{searchToken && (
						<ImportRow
							token={searchToken}
							showImportView={() => setModalView(CurrencyModalView.importToken)}
							setImportToken={setImportToken}
							style={{ height: 'fit-content' }}
						/>
					)}
				</div>
				{tokenList}
				<div>
					<span color="textSubtle">
						{userAddedTokens?.length}{' '}
						{userAddedTokens.length === 1 ? t('Custom Token') : t('Custom Tokens')}
					</span>
					{userAddedTokens.length > 0 && (
						<NormalButton onClick={handleRemoveAll}>{t('Clear all')}</NormalButton>
					)}
				</div>
			</div>
		</div>
	)
}
