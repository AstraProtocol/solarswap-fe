import clsx from 'clsx'
import style from './style.module.scss'
import { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
	scale: 'lg' | 'md' | 'xl' | 'xxl'
}

const Heading = ({ children, scale, ...props }: Props) => {
	return (
		<div
			{...props}
			className={clsx(
				'text',
				style.heading,
				{
					['text-lg']: scale === 'lg',
					['text-md']: scale === 'md',
					['text-xl']: scale === 'xl',
					['text-2xl']: scale === 'xxl',
				},
				props.className,
			)}
		>
			{children}
		</div>
	)
}

export default Heading
