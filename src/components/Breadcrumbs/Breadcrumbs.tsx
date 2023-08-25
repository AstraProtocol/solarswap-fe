/* eslint-disable react/no-array-index-key */
import React, { Children, isValidElement, ReactNode } from 'react'
import { BreadcrumbsProps } from './types'
import style from './style.module.scss'
import { Icon, IconEnum } from '@astraprotocol/astra-ui'
import clsx from 'clsx'

const Separator = ({ children }) => <div className={style.separator}>{children}</div>

const StyledBreadcrumbs = ({ children, className }) => (
	<ul className={clsx(style.styledBreadcrumbs, 'row flex-align-center', className)}>{children}</ul>
)

const insertSeparators = (items: ReactNode[], separator: BreadcrumbsProps['separator']) =>
	items.reduce((accum: ReactNode[], item, index) => {
		if (index === 0) {
			return [...accum, item]
		}

		return [
			...accum,
			<Separator aria-hidden key={`separator-${index}`}>
				{separator}
			</Separator>,
			item,
		]
	}, [])

const DefaultSeparator = <Icon icon={IconEnum.ICON_ARROW_RIGHT} />

const Breadcrumbs: React.FC<React.PropsWithChildren<BreadcrumbsProps>> = ({
	separator = DefaultSeparator,
	children,
	className,
}) => {
	const validItems = Children.toArray(children).filter(child => isValidElement(child))
	const items = insertSeparators(validItems, separator)

	return (
		<StyledBreadcrumbs className={className}>
			{items.map((item, index) => (
				<li key={`child-${index}`} className="text text-base" style={{ display: 'flex', flexDirection: 'row' }}>
					{item}
				</li>
			))}
		</StyledBreadcrumbs>
	)
}

export default Breadcrumbs
