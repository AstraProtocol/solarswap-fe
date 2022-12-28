import clsx from 'clsx'

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children, className }: { children: React.ReactNode; className: string }) {
	return (
		<div className={clsx('width-100', className)} style={{ maxWidth: 436 }}>
			{children}
		</div>
	)
}
