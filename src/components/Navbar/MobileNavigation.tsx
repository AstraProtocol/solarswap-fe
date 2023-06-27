import { Collapse, Icon, IconEnum, Typography } from '@astraprotocol/astra-ui'
import { CollapseProps } from '@astraprotocol/astra-ui/lib/es/components/Collapse'
import clsx from 'clsx'

import { useTranslation } from 'contexts/Localization'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { LinkMenuConnect, LinkMenuItem, LinkMenuLocale } from './components/LinkMenu'
import { MenuItem } from './Navigation'
import styles from './style.module.scss'

type MobileNavigationProps = {
	items: MenuItem[]
}




export default function MobileNavigation({ items }: MobileNavigationProps) {
	const router = useRouter()
	const { currentLanguage } = useTranslation()
	const { pathname, locale } = router

	const _renderMenu = useMemo(() => {
		const menus: React.ReactNode[] = []
		let titleElement = null
		for (let item of items) {
			if (item.submenus && item.submenus.length > 0) {
				let subCollapse = []
				if (item.type == 'locale') {
					titleElement = (
						<div
							className={clsx('text-base text-center text-bold', 'block-center pointer')}
							key={`title-${currentLanguage?.locale}`}
						>
							<Image
								alt={locale}
								src={`/images/flag/${currentLanguage.code}.svg`}
								width={20}
								height={15}
							/>
							<span className="margin-left-sm">{currentLanguage?.language}</span>
							<Icon icon={IconEnum.ICON_DROPDOWN} classes="margin-left-xs" />
						</div>
					)
					subCollapse = item.submenus.map(item => (
						<LinkMenuLocale
							label={item.label}
							onClick={item.onClick}
							classes={'padding-left-xs'}
							key={`sub-${item.label}`}
							prefix={
								<span className="padding-left-md">
									<Image alt={locale} src={`/images/flag/${item.link}.svg`} width={30} height={19} />
								</span>
							}
						/>
					))
				} else {
					titleElement = (
						<span>
							{item.label} {item.prefixIcon}
							<Icon icon={IconEnum.ICON_DROPDOWN} classes="margin-left-xs" />
						</span>
					)
					subCollapse = item.submenus.map(item => (
						<LinkMenuItem
							link={item.link}
							label={item.label}
							key={item.id}
							pathname={pathname}
							classes={'padding-left-md'}
							prefix={item.prefix}
						/>
					))
				}
				const collapse: CollapseProps = {
					title: titleElement,
					content: <>{subCollapse}</>,
				}
				menus.push(
					<Collapse
						key={`collapse-${item.label}`}
						{...collapse}
						classes={{ wrapper: 'border border-bottom-base' }}
					/>,
				)
			} else {
				menus.push(<LinkMenuItem key={item.label} link={item.link} label={item.label} pathname={pathname} />)
			}
		}

		menus.push(<LinkMenuConnect key="button-connect" />)

		return menus
	}, [currentLanguage.code, currentLanguage?.language, currentLanguage?.locale, items, locale, pathname])

	return <>{_renderMenu}</>
}
