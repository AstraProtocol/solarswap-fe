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
							<span className="text text-bold">{t('Token')}</span>
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

export default InfoNav
