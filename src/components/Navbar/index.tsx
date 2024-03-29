import {
	CryptoIcon,
	ellipseBetweenText,
	Icon,
	IconEnum,
	Logo,
	ModalWrapper,
	useClickOutsideElement,
} from '@astraprotocol/astra-ui'
import { useConnectWallet } from '@web3-onboard/react'
import clsx from 'clsx'
import { cloneDeep, isEmpty } from 'lodash'
import { useTranslation } from 'contexts/Localization'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { WalletHelper } from 'utils/wallet'
import MobileNavigation from './MobileNavigation'
import Navigation, { MenuItem, SubMenuItem } from './Navigation'
import styles from './style.module.scss'
import { VI, EN } from '../../config/localization/languages'
import useAuth from 'hooks/useAuth'
import { Modal, useModal } from 'components/Modal'
import NavigationConnect from 'components/ButtonConnect/NavigationConnect'
import PhisingBanner from 'components/PhisingBanner'

export default function Navbar() {
	const [shadow, setShadow] = useState(false)
	const [showHamburgerMenu, setShowHamburgerMenu] = useState(false)
	// const [load, setLoad] = useState(false)
	// const { logout } = useAuth()
	const _searchWrapperRef = useRef<HTMLDivElement>(null)
	const [{ wallet }, connect] = useConnectWallet()

	const { t, setLanguage, currentLanguage } = useTranslation()

	const _hideMenu = () => {
		// setLoad(false)
		//time for animation
		setShowHamburgerMenu(false)
	}

	useClickOutsideElement(_searchWrapperRef, _hideMenu)

	useEffect(() => {
		function scroll() {}
		window.addEventListener('scroll', _ => {
			const pos = document.body.scrollTop || document.documentElement.scrollTop
			if (pos > 0) {
				setShadow(true)
			} else {
				setShadow(false)
			}
		})
		return () => {
			window.removeEventListener('scroll', scroll)
		}
	}, [shadow])

	// useEffect(() => {
	// 	const timeout = setTimeout(() => setLoad(showHamburgerMenu), 100)
	// 	return () => clearTimeout(timeout)
	// }, [showHamburgerMenu])

	const _setWalletFromLocalStorage = useCallback(async () => {
		try {
			const previouslyConnectedWallets = WalletHelper.getCacheConnect()

			if (previouslyConnectedWallets?.length) {
				const walletConnected = await connect({
					autoSelect: {
						label: previouslyConnectedWallets[0],
						disableModals: true,
					},
				})

				if (isEmpty(walletConnected)) {
					WalletHelper.removeCacheConnect()
				}
			}
		} catch (error) {
			console.log('error : ', error)
		}
	}, [connect])

	useEffect(() => {
		if (!wallet) {
			_setWalletFromLocalStorage()
		}
	}, [wallet])

	const menus = useMemo(() => {
		const MENU_ITEMS: MenuItem[] = [
			{
				id: '1',
				type: 'static',
				label: t('Swap'),
				link: '/swap',
				submenus: [],
			},
			{
				id: '2',
				type: 'static',
				label: t('Liquidity'),
				link: '/liquidity',
				submenus: [],
			},
			// {
			// 	id: '3',
			// 	type: 'static',
			// 	label: t('Farm'),
			// 	link: '/farms',
			// 	submenus: [],
			// },
			{
				id: '4',
				type: 'static',
				label: t('Bridge'),
				link: 'https://bridge.astranaut.io',
				submenus: [],
				isExternal: true,
				hideOnMobile: true,
			},
			{
				id: '5',
				type: 'static',
				label: t('Info'),
				link: '/info',
				submenus: [],
				// hideOnMobile: true,
			},
			{
				id: '6',
				type: 'locale',
				submenus: [
					{
						id: '4.1',
						label: EN.language,
						link: EN.code,
						onClick: () => {
							dismisMobileNav()
							setLanguage(EN)
						},
					},
					{
						id: '4.2',
						label: VI.language,
						link: VI.code,
						onClick: () => {
							dismisMobileNav()
							setLanguage(VI)
						},
					},
				],
			},
		]

		return MENU_ITEMS
	}, [currentLanguage, t])

	const ModalMobileNav = () => (
		<div
			className={clsx(styles.hamburgerMenuContainer, 'padding-lg ', {
				[styles.hamburgerActive]: showHamburgerMenu,
				[styles.hamburgerDeactive]: !showHamburgerMenu,
			})}
			ref={_searchWrapperRef}
		>
			<div style={{ position: 'absolute', right: 20, top: 20 }}>
				<span
					onClick={() => dismisMobileNav()}
					className="text text-lg icon-close contrast-color-100 pointer"
				></span>
			</div>
			<div className={styles.hamburgerMenuContent}>
				<MobileNavigation items={menus} />
			</div>
		</div>
	)

	const [showMobileNav, dismisMobileNav] = useModal(<ModalMobileNav />)

	return (
		<>
			<PhisingBanner />
			<nav
				className={clsx(styles.navbar, 'margin-bottom-sm', {
					[styles.navShadow]: shadow,
					[styles.topBackground]: shadow,
				})}
			>
				<div className={clsx(styles.container, 'margin-auto')}>
					<div className={styles.hamburgerMenuIcon}>
						<div className="pointer">
							<span
								onClick={() => showMobileNav()}
								className="icon-menu-hamburger contrast-color-100 text-xl"
							></span>
						</div>
					</div>
					<div className={clsx(styles.left, 'link')}>
						<Logo type="swap" size="small" text={process.env.NEXT_PUBLIC_TITLE} />
					</div>
					<div className={styles.right}>
						<Navigation items={menus} />
						<NavigationConnect />
					</div>
				</div>
			</nav>
		</>
	)
}

Navbar.messages = ['Navbar']
