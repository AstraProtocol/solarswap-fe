import * as Sentry from '@sentry/react'
import { Dispatch } from '@reduxjs/toolkit'
import { resetUserState } from 'state/global/actions'
// import { connectorLocalStorageKey, ConnectorNames } from '@solarswap/uikit'
import { walletconnector } from './web3React'
import { LS_ORDERS } from './localStorageOrders'
import getLocalStorageItemKeys from './getLocalStorageItemKeys'

// export const clearUserStates = (dispatch: Dispatch<any>, chainId: number) => {
//   dispatch(resetUserState({ chainId }))
//   Sentry.configureScope((scope) => scope.setUser(null))

//   if (window?.localStorage?.getItem(connectorLocalStorageKey) === ConnectorNames.AstraConnect) {
//     try {
//       walletconnector.deactivate()
//       // eslint-disable-next-line no-empty
//     } catch {}
//   }

//   window?.localStorage?.removeItem(connectorLocalStorageKey)
//   const lsOrderKeys = getLocalStorageItemKeys(LS_ORDERS)
//   lsOrderKeys.forEach((lsOrderKey) => window?.localStorage?.removeItem(lsOrderKey))
// }
