import { useCallback } from 'react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'

import {
	NoEthereumProviderError,
	UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'

import { connectorsByName } from 'utils/web3React'
import { connectorLocalStorageKey, setupNetwork } from 'utils/wallet'
import { useAppDispatch } from 'state'
import { useTranslation } from 'contexts/Localization'
import { clearUserStates } from '../utils/clearUserStates'
import { withToast } from '@astraprotocol/astra-ui'
import { ConnectorNames } from 'config/constants'

const useAuth = () => {
	const { t } = useTranslation()
	const dispatch = useAppDispatch()
	const { chainId, activate, deactivate, setError } = useWeb3React()
	// const { toastError } = useToast()
	const login = useCallback(
		async (connectorID: ConnectorNames) => {
			const connectorOrGetConnector = connectorsByName[connectorID]
			const connector =
				typeof connectorOrGetConnector !== 'function'
					? connectorsByName[connectorID]
					: await connectorOrGetConnector()
			if (typeof connector !== 'function' && connector) {
				activate(connector, async (error: Error) => {
					if (error instanceof UnsupportedChainIdError) {
						setError(error)
						const provider = await connector.getProvider()
						const hasSetup = await setupNetwork(provider)
						if (hasSetup) {
							activate(connector)
						}
					} else {
						window?.localStorage?.removeItem(connectorLocalStorageKey)
						if (error instanceof NoEthereumProviderError) {
							// withToast(
							//   t('Provider Error'),
							//   <Box>
							//     <Text>{t('No provider was found')}</Text>
							//     <LinkExternal href="https://docs.solarswap.io/get-started/connection-guide">
							//       {t('Need help ?')}
							//     </LinkExternal>
							//   </Box>,
							// )
						} else if (error instanceof UserRejectedRequestErrorInjected) {
							// toastError(t('Authorization Error'), t('Please authorize to access your account'))
						} else {
							// toastError(error.name, error.message)
						}
					}
				})
			} else {
				window?.localStorage?.removeItem(connectorLocalStorageKey)
				// toastError(t('Unable to find connector'), t('The connector config is wrong'))
			}
		},
		[t, activate, /*toastError,*/ setError],
	)

	const logout = useCallback(() => {
		deactivate()
		clearUserStates(dispatch, chainId)
	}, [deactivate, dispatch, chainId])

	return { login, logout }
}

export default useAuth
