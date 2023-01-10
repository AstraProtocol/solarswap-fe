import {
	CryptoIcon,
	ellipseBetweenText,
	Icon,
	IconEnum,
	Logo,
	ModalWrapper,
	useClickOutsideElement
} from '@astraprotocol/astra-ui'
import { useConnectWallet } from '@web3-onboard/react'
import clsx from 'clsx'
import { cloneDeep, isEmpty } from 'lodash'
import { useTranslation } from 'contexts/Localization'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { WalletHelper } from 'utils/wallet'
import LiveIcon from './LiveIcon'
import MobileNavigation from './MobileNavigation'
import Navigation, { MenuItem, SubMenuItem } from './Navigation'
import styles from './style.module.scss'
import SwitchTheme from './SwitchTheme'
import ButtonConnect from 'components/ButtonConnect'
import { VI, EN } from '../../config/localization/languages'
import useAuth from 'hooks/useAuth'
import { Modal, useModal } from 'components/Modal'
import NavigationConnect from 'components/ButtonConnect/NavigationConnect'

export default function Navbar() {
	const [shadow, setShadow] = useState(false)
	const [showHamburgerMenu, setShowHamburgerMenu] = useState(false)
	const [load, setLoad] = useState(false)
	const { logout } = useAuth()
	const _searchWrapperRef = useRef<HTMLDivElement>(null)
	const [{ wallet }, connect] = useConnectWallet()

	const { t, setLanguage, currentLanguage } = useTranslation()

	const _hideMenu = () => {
		setLoad(false)
		//time for animation
		setTimeout(() => setShowHamburgerMenu(false), 500)
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

	useEffect(() => {
		setTimeout(() => setLoad(showHamburgerMenu), 100)
	}, [showHamburgerMenu])

	const _setWalletFromLocalStorage = useCallback(async () => {
		try {
			const previouslyConnectedWallets = WalletHelper.getCacheConnect()

			if (previouslyConnectedWallets?.length) {
				const walletConnected = await connect({
					autoSelect: {
						label: previouslyConnectedWallets[0],
						disableModals: true
					}
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

	const _changeMenu = useCallback(() => {
		const MENU_ITEMS: MenuItem[] = [
			{
				id: '1',
				type: 'static',
				label: t('Trade'),
				link: '/swap',
				submenus: [
					{
						id: '1.1',
						label: t('Swap'),
						link: '/swap'
					},

					{
						id: '1.2',
						label: t('Liquidity'),
						link: '/liquidity'
					}
				]
			},
			{
				id: '2',
				type: 'static',
				label: t('Farm'),
				link: '/farms',
				submenus: []
			},
			{
				id: '4',
				type: 'locale',
				submenus: [
					{
						id: '4.1',
						label: EN.language,
						link: EN.code,
						onClick: () => setLanguage(EN)
					},
					{
						id: '4.2',
						label: VI.language,
						link: VI.code,
						onClick: () => setLanguage(VI)
					}
				]
			}
		]

		return MENU_ITEMS
	}, [currentLanguage])

	const menus = _changeMenu()

	const ModalMobileNav = () => (
		<div
			className={clsx(styles.hamburgerMenuContainer, 'padding-lg ', {
				[styles.hamburgerActive]: showHamburgerMenu,
				[styles.hamburgerDeactive]: !showHamburgerMenu
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
			<nav
				className={clsx(styles.navbar, 'margin-bottom-sm', {
					'shadow-xs': shadow,
					[styles.topBackground]: shadow
				})}
			>
				<div className={clsx(styles.container, 'margin-auto')}>
					<div className={styles.hamburgerMenuIcon}>
						<div className="padding-left-lg pointer">
							<span
								onClick={() => showMobileNav()}
								className="icon-menu-hamburger contrast-color-100 text-xl"
							></span>
						</div>
					</div>
					<div className={clsx(styles.left, 'link')}>
						<Logo type="transparent" text={process.env.NEXT_PUBLIC_TITLE} />
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
