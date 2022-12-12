import { CryptoIcon, ellipseBetweenText, Logo, ModalWrapper, useClickOutsideElement } from '@astraprotocol/astra-ui'
import { useConnectWallet } from '@web3-onboard/react'
import clsx from 'clsx'
import { cloneDeep, isEmpty } from 'lodash'
import { useTranslation } from 'contexts/Localization'
import { useCallback, useEffect, useRef, useState } from 'react'
import { WalletHelper } from 'utils/wallet'
import LiveIcon from './LiveIcon'
import MobileNavigation from './MobileNavigation'
import Navigation, { MenuItem, SubMenuItem } from './Navigation'
import styles from './style.module.scss'
import SwitchTheme from './SwitchTheme'
import ButtonConnect from 'components/ButtonConnect'

export const MENU_ITEMS: MenuItem[] = [
	{
		id: '1',
		type: 'static',
		label: 'Swap',
		link: '/swap',
		submenus: []
	},
	{
		id: '2',
		type: 'static',
		label: 'Farm',
		link: '/liquidity',
		submenus: []
	},
	{
		id: '4',
		type: 'locale',
		submenus: [
			{
				id: '4.1',
				label: 'ENG',
				link: '/en'
			},
			{
				id: '4.2',
				label: 'VI',
				link: '/vi'
			}
		]
	}
]

export default function Navbar() {
	const [shadow, setShadow] = useState(false)
	const [showHamburgerMenu, setShowHamburgerMenu] = useState(false)
	const [load, setLoad] = useState(false)
	const _searchWrapperRef = useRef<HTMLDivElement>(null)
	const [{ wallet }, connect, disconnect] = useConnectWallet()
	console.log(wallet)
	const { t } = useTranslation()

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
		_setWalletFromLocalStorage()
	}, [wallet, _setWalletFromLocalStorage])

	const _changeMenu = useCallback(() => {
		const newMenus = cloneDeep(MENU_ITEMS)
		if (wallet && !isEmpty(wallet?.accounts)) {
			const account = wallet.accounts[0]
			let optionItems: SubMenuItem[] = []
			optionItems.push()
			newMenus.push({
				id: '99',
				label: ellipseBetweenText(account.address, 6, 6),
				prefixIcon: <LiveIcon />,
				className: styles.customSubmenu,
				submenus: [
					{
						id: '99.1',
						label: (
							<div className="flex flex-column width-100">
								<div className="flex flex-row flex-align-center">
									<div className="margin-right-sm flex-justify-center">
										<CryptoIcon name="asa" />
									</div>
									<div className="flex flex-column flex-justify-start">
										<span className="text text-base">
											{ellipseBetweenText(account.address, 6, 6)}
										</span>
									</div>
								</div>
							</div>
						),
						hover: 'none',
						align: ' '
					},
					{
						id: '99.2',
						label: (
							<div className="block-center">
								<span className="icon-setting margin-right-sm text-xl"></span>
								{t('Disconnect Wallet')}
							</div>
						),
						onClick: () => {
							disconnect(wallet)
							WalletHelper.removeCacheConnect()
						},
						align: ' '
					}
				]
			})
		}

		return newMenus
	}, [wallet])

	const menus = _changeMenu()
	return (
		<>
			<ModalWrapper open={showHamburgerMenu}>
				<div
					className={clsx(styles.hamburgerMenuContainer, 'padding-lg hamburger-enter', {
						'hamburger-enter-active': load
					})}
					ref={_searchWrapperRef}
				>
					<div className={styles.close}>
						<span onClick={_hideMenu} className="icon-close contrast-color-100 pointer"></span>
					</div>
					<div className={styles.content}>
						<MobileNavigation items={menus} />
					</div>
				</div>
			</ModalWrapper>
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
								onClick={() => setShowHamburgerMenu(true)}
								className="icon-menu-hamburger contrast-color-100 text-xl"
							></span>
						</div>
					</div>
					<div className={styles.left}>
						<Logo type="transparent" text={process.env.NEXT_PUBLIC_TITLE} />
					</div>
					<div className={styles.right}>
						<Navigation items={menus} />
						<ButtonConnect />
						{/* <SwitchTheme /> */}
					</div>
				</div>
			</nav>
		</>
	)
}

Navbar.messages = ['Navbar']
