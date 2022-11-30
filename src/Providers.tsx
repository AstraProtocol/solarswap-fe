import { Web3ReactProvider } from '@web3-react/core'
import { Provider } from 'react-redux'
import { SWRConfig } from 'swr'
import { getLibrary } from 'utils/web3React'
import { LanguageProvider } from 'contexts/Localization'
import { fetchStatusMiddleware } from 'hooks/useSWRContract'
import { Store } from '@reduxjs/toolkit'
import { ThemeProvider as NextThemeProvider } from 'next-themes'

const Providers: React.FC<{ store: Store }> = ({ children, store }) => {
	return (
		<Web3ReactProvider getLibrary={getLibrary}>
			<Provider store={store}>
				<NextThemeProvider>
					<LanguageProvider>
						<SWRConfig
							value={{
								use: [fetchStatusMiddleware]
							}}
						>
							{children}
							{/* <ModalProvider>{children}</ModalProvider> */}
						</SWRConfig>
					</LanguageProvider>
				</NextThemeProvider>
			</Provider>
		</Web3ReactProvider>
	)
}

export default Providers
