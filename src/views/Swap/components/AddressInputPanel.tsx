import { useCallback } from 'react'
import { Form, Row, Typography } from '@astraprotocol/astra-ui'

import { useTranslation } from 'contexts/Localization'
import useENS from '../../../hooks/ENS/useENS'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'
import { AutoColumn } from '../../../components/Layout/Column'
import { getAstraExplorerLink } from '../../../utils'
import styles from './styles.module.scss'
import clsx from 'clsx'

// const InputPanel = styled.div`
// 	display: flex;
// 	flex-flow: column nowrap;
// 	position: relative;
// 	border-radius: 1.25rem;
// 	background-color: ${({ theme }) => theme.colors.backgroundAlt};
// 	z-index: 1;
// 	width: 100%;
// `

// const ContainerRow = styled.div<{ error: boolean }>`
// 	display: flex;
// 	justify-content: center;
// 	align-items: center;
// 	border-radius: 1.25rem;
// 	border: 1px solid ${({ error, theme }) => (error ? theme.colors.failure : theme.colors.background)};
// 	transition: border-color 300ms ${({ error }) => (error ? 'step-end' : 'step-start')},
// 		color 500ms ${({ error }) => (error ? 'step-end' : 'step-start')};
// 	background-color: ${({ theme }) => theme.colors.backgroundAlt};
// `

// const InputContainer = styled.div`
// 	flex: 1;
// 	padding: 1rem;
// `

// const Input = styled.input<{ error?: boolean }>`
// 	font-size: 1.25rem;
// 	outline: none;
// 	border: none;
// 	flex: 1 1 auto;
// 	background-color: ${({ theme }) => theme.colors.backgroundAlt};
// 	transition: color 300ms ${({ error }) => (error ? 'step-end' : 'step-start')};
// 	color: ${({ error, theme }) => (error ? theme.colors.failure : theme.colors.primary)};
// 	overflow: hidden;
// 	text-overflow: ellipsis;
// 	font-weight: 500;
// 	width: 100%;
// 	::placeholder {
// 		color: ${({ theme }) => theme.colors.textDisabled};
// 	}
// 	padding: 0px;
// 	-webkit-appearance: textfield;

// 	::-webkit-search-decoration {
// 		-webkit-appearance: none;
// 	}

// 	::-webkit-outer-spin-button,
// 	::-webkit-inner-spin-button {
// 		-webkit-appearance: none;
// 	}

// 	::placeholder {
// 		color: ${({ theme }) => theme.colors.textDisabled};
// 	}
// `

export default function AddressInputPanel({
	id,
	value,
	onChange
}: {
	id?: string
	// the typed string value
	value: string
	// triggers whenever the typed value changes
	onChange: (value: string) => void
}) {
	const { chainId } = useActiveWeb3React()

	const { t } = useTranslation()

	const { address, loading, name } = useENS(value)

	const handleInput = useCallback(
		event => {
			const input = event.target.value
			const withoutSpaces = input.replace(/\s+/g, '')
			onChange(withoutSpaces)
		},
		[onChange]
	)

	const error = Boolean(value.length > 0 && !loading && !address)

	return (
		<div className={styles.addressInputPanel} id={id}>
			<div
				className={clsx(
					styles.containerRow,
					'flex col border border-base radius-lg padding-md',
					error && styles.containerRowError
				)}
			>
				<Row style={{ justifyContent: 'space-between' }}>
					<span className="text text-base">{t('Recipient')}</span>
					{address && chainId && (
						<Typography.Link href={getAstraExplorerLink(name ?? address, 'address', chainId)}>
							{t('View on AstraExplorer')}
						</Typography.Link>
					)}
				</Row>
				<Form.Input
					className=" recipient-address-input"
					type="text"
					autoComplete="off"
					autoCorrect="off"
					autoCapitalize="off"
					spellCheck="false"
					placeholder={t('Wallet Address or ENS name')}
					// error={error}
					pattern="^(0x[a-fA-F0-9]{40})$"
					onChange={handleInput}
					value={value}
					classes={{ option: ' ', wapper: 'margin-top-md' }}
				/>
			</div>
		</div>
	)
}
