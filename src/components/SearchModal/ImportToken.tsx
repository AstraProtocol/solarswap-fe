import { useState } from 'react'
import { Token, Currency } from '@solarswap/sdk'
import { Checkbox, Icon, IconEnum, Message, NormalButton, Tag, Typography } from '@astraprotocol/astra-ui'

import { useAddUserToken } from 'state/user/hooks'
import { getAstraExplorerLink } from 'utils'
import truncateHash from 'utils/truncateHash'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCombinedInactiveList } from 'state/lists/hooks'
import { ListLogo } from 'components/Logo'
import { useTranslation } from 'contexts/Localization'

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
		<div className="flex col">
			<Message variant="warning">
				<span>
					{t(
						'Anyone can create a ERC20 token on Astra Chain with any name, including creating fake versions of existing tokens and tokens that claim to represent projects that do not have a token.'
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
					<div key={token.address}>
						{list !== undefined ? (
							<div className="margin-top-md">
								<Tag
									variant="success"
									outline
									scale="sm"
									startIcon={list.logoURI && <ListLogo logoURI={list.logoURI} size="12px" />}
								>
									{t('via')} {list.name}
								</Tag>
							</div>
						) : (
							<div className="margin-top-md">
								<Tag
									variant="error"
									outline
									scale="sm"
									startIcon={<Icon icon={IconEnum.ICON_WARNING} classes="alert-color-error" />}
								>
									{t('Unknown Source')}
								</Tag>
							</div>
						)}
						<div className="flex flex-align-center margin-top-md">
							<span className="text text-base margin-right-sm">{token.name}</span>
							<span className="text text-sm contrast-color-50">({token.symbol})</span>
						</div>
						{chainId && (
							<div className="flex flex-justify-space-between width-100">
								<span className="text text-base margin-right-xs">{address}</span>
								<Typography.Link
									target="_blank"
									href={getAstraExplorerLink(token.address, 'address', chainId)}
								>
									({t('View on AstraExplorer')})
								</Typography.Link>
							</div>
						)}
					</div>
				)
			})}

			<div className="flex flex-justify-space-between flex-align-center margin-top-md">
				<div className="flex flex-align-center" onClick={() => setConfirmed(!confirmed)}>
					<Checkbox
						scale="sm"
						name="confirmed"
						type="checkbox"
						checked={confirmed}
						onChange={() => setConfirmed(!confirmed)}
					/>
					<span
						id="import-token-understand"
						className="text text-base margin-left-xs"
						style={{ userSelect: 'none' }}
					>
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
					classes={{ other: 'token-dismiss-button' }}
				>
					<span className="text text-base">{t('Import')}</span>
				</NormalButton>
			</div>
		</div>
	)
}

export default ImportToken
