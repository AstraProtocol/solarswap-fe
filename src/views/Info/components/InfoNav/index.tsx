import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import Search from 'views/Info/components/InfoSearch'
// import { chains } from 'utils/wagmi'
// import { ChainLogo } from 'components/Logo/ChainLogo'
// import { bsc, mainnet, polygonZkEvm } from 'wagmi/chains'
// import { ASSET_CDN } from 'config/constants/endpoints'
import { useTranslation } from 'contexts/Localization'
import style from './style.module.scss'
import { ButtonMenu, ButtonMenuItem } from '@astraprotocol/astra-ui'
import { NextLinkFromReactRouter } from 'components/NextLink'

const NavWrapper = ({ children }: { children: React.ReactNode }) => <div className={style.navWrapper}>{children}</div>


const InfoNav: React.FC<{ isStableSwap: boolean }> = ({ isStableSwap }) => {
	const { t } = useTranslation()
	const router = useRouter()
	const stableSwapQuery = isStableSwap ? '?type=stableSwap' : ''
	const activeIndex = useMemo(() => {
		if (router?.pathname?.includes('/pairs')) {
			return 1
		}
		if (router?.pathname?.includes('/tokens')) {
			return 2
		}
		return 0
	}, [router.pathname])

	const onNavItemClick = useCallback(index => {
		if (index == 1) router.push(`/info/pairs${stableSwapQuery}`)
		else if (index == 2) router.push(`/info/tokens${stableSwapQuery}`)
		else router.push(`/info${stableSwapQuery}`)
	}, [])

	return (
		<>
			<NavWrapper>
				<div>
					<ButtonMenu activeIndex={activeIndex} size="sm" onItemClick={onNavItemClick}>
						<ButtonMenuItem as={NextLinkFromReactRouter} to={`/info${stableSwapQuery}`}>
							<span className="text text-bold">{t('Overview')}</span>
						</ButtonMenuItem>
						<ButtonMenuItem as={NextLinkFromReactRouter} to={`/info/pairs${stableSwapQuery}`}>
							<span className="text text-bold">{t('Pairs')}</span>
						</ButtonMenuItem>
						<ButtonMenuItem as={NextLinkFromReactRouter} to={`/info/tokens${stableSwapQuery}`}>
							<span className="text text-bold">{t('Tokens')}</span>
						</ButtonMenuItem>
					</ButtonMenu>
				</div>
				<Search />
			</NavWrapper>
			{/* {!isStableSwap && (
				<div style={{maxWidth: 1200}}>
					<Message my="24px" mx="24px" variant="warning">
						<MessageText fontSize="17px">
							<Text color="warning" as="span">
								{t(
									'The markets for some of the newer and low-cap tokens displayed on the v2 info page are highly volatile, and as a result, token information may not be accurate.',
								)}
							</Text>
							<Text color="warning" ml="4px" bold as="span">
								{t('Before trading any token, please DYOR, and pay attention to the risk scanner.')}
							</Text>
						</MessageText>
					</Message>
				</div>
			)} */}
		</>
	)
}

// const targetChains = [mainnet, bsc, polygonZkEvm]

// export const NetworkSwitcher: React.FC<{ activeIndex: number }> = ({ activeIndex }) => {
//   const { t } = useTranslation()
//   const foundChain = chains.find((d) => d.id === multiChainId[chainName])
//   const symbol = foundChain?.nativeCurrency?.symbol
//   const router = useRouter()
//   const switchNetwork = useCallback(
//     (chianId: number) => {
//       const chainPath = multiChainPaths[chianId]
//       if (activeIndex === 0) router.push(`/info`)
//       if (activeIndex === 1) router.push(`/info/pairs`)
//       if (activeIndex === 2) router.push(`/info/tokens`)
//     },
//     [router, activeIndex],
//   )

//   return (
//     <UserMenu
//       alignItems="top"
//       ml="8px"
//       avatarSrc={`${ASSET_CDN}/web/chains/${multiChainId[chainName]}.png`}
//       text={
//         foundChain ? (
//           <>
//             <Box display={['none', null, null, null, null, 'block']}>{foundChain.name}</Box>
//             <Box display={['block', null, null, null, null, 'none']}>{symbol}</Box>
//           </>
//         ) : (
//           t('Select a Network')
//         )
//       }
//       recalculatePopover
//     >
//       {() => <NetworkSelect chainId={multiChainId[chainName]} switchNetwork={switchNetwork} />}
//     </UserMenu>
//   )
// }

// const NetworkSelect: React.FC<{ chainId: ChainId; switchNetwork: (chainId: number) => void }> = ({
// 	switchNetwork,
// 	chainId,
// }) => {
// 	const { t } = useTranslation()

// 	return (
// 		<>
// 			<Box px="16px" py="8px">
// 				<Text color="textSubtle">{t('Select a Network')}</Text>
// 			</Box>
// 			<UserMenuDivider />
// 			{targetChains.map(chain => (
// 				<UserMenuItem
// 					key={chain.id}
// 					style={{ justifyContent: 'flex-start' }}
// 					onClick={() => {
// 						if (chain.id !== chainId) switchNetwork(chain.id)
// 					}}
// 				>
// 					<ChainLogo chainId={chain.id} />
// 					<Text color={chain.id === chainId ? 'secondary' : 'text'} bold={chain.id === chainId} pl="12px">
// 						{chain.name}
// 					</Text>
// 				</UserMenuItem>
// 			))}
// 		</>
// 	)
// }

export default InfoNav
