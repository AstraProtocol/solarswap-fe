import { forwardRef } from 'react'
// import styled from 'styled-components'
import NextLink from 'next/link'

// react-router-dom LinkProps types
interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	to: any
	replace?: boolean
	innerRef?: React.Ref<HTMLAnchorElement>
	// next
	prefetch?: boolean
}

// const A = styled.a``

/**
 * temporary solution for migrating React Router to Next.js Link
 */
// eslint-disable-next-line react/display-name
export const NextLinkFromReactRouter = forwardRef<any, LinkProps>(
	({ to, replace, children, prefetch, ...props }, ref) => (
		<NextLink href={to as string} replace={replace} passHref prefetch={prefetch}>
			<a ref={ref} {...props}>
				{children}
			</a>
		</NextLink>
	),
)
