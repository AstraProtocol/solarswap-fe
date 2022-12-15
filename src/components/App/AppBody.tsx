/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
	return (
		<div className="width-100 radis-2xl" style={{ maxWidth: 436 }}>
			{children}
		</div>
	)
}
