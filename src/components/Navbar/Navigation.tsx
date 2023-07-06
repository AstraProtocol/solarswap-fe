import clsx from 'clsx'

import React, { MouseEventHandler, useEffect, useRef, useState } from 'react'

import { useClickOutsideElement } from '@astraprotocol/astra-ui'
import Image from 'next/image'
import styles from './style.module.scss'
import { useTranslation } from 'contexts/Localization'
import Link from 'next/link'
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
	isExternal?: boolean
	hideOnMobile?: boolean
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

type LinkItemProps = {
	isSubmenu: boolean
	link: string
	content: React.ReactNode
	index: number
	len: number
	onClick?: Function
	locale?: boolean
	align?: string
}

const LinkItem = (props: LinkItemProps) => {
	const { isSubmenu = false, link, content, index, len, onClick, locale = false, align = '' } = props
	const isExternal = link.indexOf('https://') >= 0
	const span = () => (
		<span
			className={clsx(
				isSubmenu && styles.linkSubItem,
				'text-base text-center text-bold',
				'padding-sm',
				'flex pointer',
				align || 'flex-justify-center flex-align-center',
				{ 'radius-tl-sm radius-tr-sm': index === 0 },
				{ 'radius-bl-sm radius-br-sm': index === len - 1 },
			)}
			style={{
				color: isSubmenu ? '#0B0F1E' : 'var(--contrast-color-theme-70)',
				borderBottom: isSubmenu ? '1px solid #0000000D' : '',
			}}
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
			{isExternal && <span className="padding-left-xs icon-external-link" />}
		</span>
	)
	return link && !locale ? (
		<Link target={isExternal ? '_blank' : '_self'} href={link}>
			{span()}
		</Link>
	) : (
		span()
	)
}

export default function Navigation({ items }: NavigationProps) {
	const { currentLanguage } = useTranslation()
	const [_menuItems, setMenuItems] = useState(items)
	const wrapperRef = useRef(null)
	const hideMenu = function () {
		_showSubMenu(undefined, '')
	}
	useClickOutsideElement(wrapperRef, hideMenu)

	// useEffect(() => {
	// 	setMenuItems(items)
	// }, [items])

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
							<LinkItem isSubmenu={false} link={link} content={label} index={1} len={0} />
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
										<LinkItem
											isSubmenu
											link={menu?.link || ''}
											content={menu.label}
											index={index}
											len={sub1.length}
											onClick={menu.onClick}
											locale={type === 'locale'}
											align={menu.align}
										/>
										{menu.submenus && (
											<ul
												className={clsx(styles.submenu2, 'radius-xs', {
													[styles.show]: menu.show,
												})}
											>
												{menu.submenus.map(sub2 => (
													<li key={sub2.id}>
														<LinkItem
															isSubmenu
															link={sub2.link}
															content={sub2.label}
															index={index}
															len={sub1.length}
															onClick={menu.onClick}
															locale
														/>
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
