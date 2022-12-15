import { useState } from 'react'
import { Token, Currency } from '@solarswap/sdk'
// import { Button, span, ErrorIcon, Flex, Message, Checkbox, Link, Tag, Grid } from '@solarswap/uikit'
import { AutoColumn } from 'components/Layout/Column'
import { useAddUserToken } from 'state/user/hooks'
import { getAstraScanLink } from 'utils'
import truncateHash from 'utils/truncateHash'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCombinedInactiveList } from 'state/lists/hooks'
import { ListLogo } from 'components/Logo'
import { useTranslation } from 'contexts/Localization'
import { Checkbox, Message, NormalButton } from '@astraprotocol/astra-ui'

interface ImportProps {
  tokens: Token[]
  handleCurrencySelect?: (currency: Currency) => void
}

function ImportToken({ tokens, handleCurrencySelect }: ImportProps) {
  const { chainId } = useActiveWeb3React()

  const { t } = useTranslation()

  const [confirmed, setConfirmed] = useState(false)

  const addToken = useAddUserToken()

  // use for showing import source on inactive tokens
  const inactiveTokenList = useCombinedInactiveList()

  return (
		<AutoColumn gap="lg">
			<Message variant="warning">
				<span>
					{t(
						'Anyone can create a ARC20 token on Astra Chain with any name, including creating fake versions of existing tokens and tokens that claim to represent projects that do not have a token.'
					)}
					<br />
					<br />
					{t('If you purchase an arbitrary token, you may be unable to sell it back.')}
				</span>
			</Message>
			{tokens.map(token => {
				const list = chainId && inactiveTokenList?.[chainId]?.[token.address]?.list
				const address = token.address ? `${truncateHash(token.address)}` : null
				return (
					<Grid key={token.address} gridTemplateRows="1fr 1fr 1fr" gridGap="4px">
						{list !== undefined ? (
							<Tag
								variant="success"
								outline
								scale="sm"
								startIcon={list.logoURI && <ListLogo logoURI={list.logoURI} size="12px" />}
							>
								{t('via')} {list.name}
							</Tag>
						) : (
							<Tag variant="failure" outline scale="sm" startIcon={<ErrorIcon color="failure" />}>
								{t('Unknown Source')}
							</Tag>
						)}
						<Flex alignItems="center">
							<span mr="8px">{token.name}</span>
							<span>({token.symbol})</span>
						</Flex>
						{chainId && (
							<Flex justifyContent="space-between" width="100%">
								<span mr="4px">{address}</span>
								<Link href={getAstraScanLink(token.address, 'address', chainId)} external>
									({t('View on AstraExplorer')})
								</Link>
							</Flex>
						)}
					</Grid>
				)
			})}
			;
			<div className="flex flex-justify-space-between flex-align-center">
				<div className="flex flex-align-center" onClick={() => setConfirmed(!confirmed)}>
					<Checkbox
						scale="sm"
						name="confirmed"
						type="checkbox"
						checked={confirmed}
						onChange={() => setConfirmed(!confirmed)}
					/>
					<span className="text text-base" style={{ userSelect: 'none' }}>
						{t('I understand')}
					</span>
				</div>
				<NormalButton
					disabled={!confirmed}
					onClick={() => {
						tokens.forEach(token => addToken(token))
						if (handleCurrencySelect) {
							handleCurrencySelect(tokens[0])
						}
					}}
					className=".token-dismiss-button"
				>
					{t('Import')}
				</NormalButton>
			</div>
		</AutoColumn>
  )
}

export default ImportToken
