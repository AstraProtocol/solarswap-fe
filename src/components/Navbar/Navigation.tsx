import clsx from 'clsx'
import Link from 'next/link'
import { MouseEventHandler, useEffect, useRef, useState } from 'react'

import { useClickOutsideElement } from '@astraprotocol/astra-ui'
import Image from 'next/image'
import styles from './style.module.scss'
import { useTranslation } from 'contexts/Localization'
export type MenuType = 'static' | 'locale'

export type SubMenuItem = {
	id: string
	label: React.ReactNode
	hover?: string
	align?: string
	prefix?: JSX.Element
	suffix?: JSX.Element
	link?: string
	show?: boolean
	submenus?: { id: string; label: string; link: string; show?: boolean }[]
	onClick?: Function
}
export type MenuItem = {
	id: string
	label?: string
	link?: string
	show?: boolean
	className?: string
	prefixIcon?: React.ReactNode
	submenus?: SubMenuItem[]
	type?: MenuType
	onClick?: Function
}

export type NavigationProps = {
	items: MenuItem[]
}

export default function Navigation({ items }: NavigationProps) {
	const { currentLanguage } = useTranslation()
	const [_menuItems, setMenuItems] = useState(items)
	const wrapperRef = useRef(null)
	const hideMenu = function () {
		_showSubMenu(undefined, '')
	}
	useClickOutsideElement(wrapperRef, hideMenu)

	useEffect(() => {
		setMenuItems(items)
	}, [items])

	const _renderLink = (
		link: string,
		content: React.ReactNode,
		index: number,
		len: number,
		onClick?: Function,
		locale = false,
		align = '',
		hover = 'hover',
	) => {
		const span = () => (
			<span
				className={clsx(
					'text-base text-center text-bold',
					'contrast-color-70 padding-sm',
					'flex pointer',
					align || 'flex-justify-center flex-align-center',
					hover,
					{ 'radius-tl-sm radius-tr-sm': index === 0 },
					{ 'radius-bl-sm radius-br-sm': index === len - 1 },
				)}
				onClick={onClick as MouseEventHandler<HTMLSpanElement>}
			>
				{locale ? (
					<>
						<Image alt={link} src={`/images/flag/${link}.svg`} width={30} height={19} />
						<span className="padding-left-xs">{content}</span>
					</>
				) : (
					content
				)}
			</span>
		)
		return link && !locale ? <Link href={link}>{span()}</Link> : span()
	}
	/**
	 *
	 * @param id string[]: [url level 1, url level 2 ]
	 */
	const _showSubMenu = (event: React.MouseEvent<HTMLElement> | undefined, id: string) => {
		event?.stopPropagation()
		for (let item of items) {
			if (item.id === id) {
				item.show = true
			} else {
				item.show = false
			}
		}

		setMenuItems([...items])
	}

	const _renderLocale = () => {
		return (
			<span className="text-base text-center text-bold contrast-color-70 padding-sm block-center pointer">
				<Image
					alt={currentLanguage.code}
					src={`/images/flag/${currentLanguage.code}.svg`}
					width={20}
					height={15}
				/>
				<span className="padding-left-sm">{currentLanguage?.language}</span>
			</span>
		)
	}
	return (
		<ul className={styles.navigation} ref={wrapperRef}>
			{_menuItems.map(({ link = '', prefixIcon, label, show, id, submenus: sub1, type, className }) => (
				<li
					key={id}
					className={clsx(styles.item, 'margin-left-lg', 'block-center', 'padding-right-lg radius-lg', {
						[`padding-left-lg ${styles.background}`]: prefixIcon,
						'padding-right-md padding-left-xs': !prefixIcon,
					})}
					onClick={event => _showSubMenu(event, id)}
					onMouseEnter={event => _showSubMenu(event, id)}
					onMouseLeave={event => _showSubMenu(event, null)}
				>
					{type === 'locale' ? (
						_renderLocale()
					) : (
						<>
							{prefixIcon && prefixIcon}
							{_renderLink(link, label!, 1, 0)}
						</>
					)}

					{sub1!.length > 0 && (
						<>
							<span className="icon-arrow-down contrast-color-100"></span>
							<ul
								className={clsx(styles.submenu, className, 'radius-sm', {
									[styles.show]: show,
									[styles.locale]: type === 'locale',
								})}
							>
								{sub1?.map((menu, index) => (
									<li
										className={clsx({
											'border border-bottom-base': index !== sub1.length - 1,
										})}
										key={menu.id}
										// onClick={event => _showSubMenu(event, [id, menu.id])}
									>
										{_renderLink(
											menu?.link || '',
											menu.label,
											index,
											sub1.length,
											menu.onClick,
											type === 'locale',
											menu.align,
											menu.hover,
										)}
										{menu.submenus && (
											<ul
												className={clsx(styles.submenu2, 'contrast-bg-color-50', 'radius-xs', {
													[styles.show]: menu.show,
												})}
											>
												{menu.submenus.map(sub2 => (
													<li key={sub2.id}>
														{_renderLink(
															sub2.link,
															sub2.label,
															index,
															sub1.length,
															menu.onClick,
															true,
														)}
													</li>
												))}
											</ul>
										)}
									</li>
								))}
							</ul>
						</>
					)}
				</li>
			))}
		</ul>
	)
}
