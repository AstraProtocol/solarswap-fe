import { useState, useMemo } from 'react'
import debounce from 'lodash/debounce'
import { useTranslation } from 'contexts/Localization'
import { Form } from '@astraprotocol/astra-ui'

interface Props {
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	placeholder?: string
}

const SearchInput: React.FC<Props> = ({ onChange: onChangeCallback, placeholder = 'Search' }) => {
	const [searchText, setSearchText] = useState('')

	const { t } = useTranslation()

	const debouncedOnChange = useMemo(
		() => debounce((e: React.ChangeEvent<HTMLInputElement>) => onChangeCallback(e), 500),
		[onChangeCallback]
	)

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchText(e.target.value)
		debouncedOnChange(e)
	}

	return (
		<Form.Input
			classes={{
				option: ' ',
				inputWrapperPadding: 'padding-top-xs padding-bottom-xs padding-left-md padding-right-md'
			}}
			value={searchText}
			onChange={onChange}
			placeholder={t(placeholder)}
		/>
	)
}

export default SearchInput
