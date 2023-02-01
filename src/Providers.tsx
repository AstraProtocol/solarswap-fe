import { Web3ReactProvider } from '@web3-react/core'
import { Provider } from 'react-redux'
import { SWRConfig } from 'swr'
import { getLibrary } from 'utils/web3React'
import { LanguageProvider } from 'contexts/Localization'
import { fetchStatusMiddleware } from 'hooks/useSWRContract'
import { ThemeProvider as NextThemeProvider } from 'next-themes'
import { ModalProvider } from 'components/Modal'
import { AppState } from 'state'
import { Store } from 'redux'

interface Props {
	children?: JSX.Element | JSX.Element[] | string | string[]
	store: Store<AppState>
}

const Providers: React.FC<Props> = ({ children, store }: Props) => {
	return (
		<Web3ReactProvider getLibrary={getLibrary}>
			<Provider store={store}>
				<NextThemeProvider>
					<LanguageProvider>
						<SWRConfig
							value={{
								use: [fetchStatusMiddleware],
							}}
						>
							<ModalProvider>{children}</ModalProvider>
						</SWRConfig>
					</LanguageProvider>
				</NextThemeProvider>
			</Provider>
		</Web3ReactProvider>
	)
}

export default Providers
