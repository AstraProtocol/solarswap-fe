/* eslint-disable jsx-a11y/iframe-has-title */
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import { nodes } from 'utils/getRpcUrl'

class MyDocument extends Document {
	render() {
		return (
			<Html translate="no">
				<Head>
					{nodes.map(node => (
						<link key={node} rel="preconnect" href={node} />
					))}
					{process.env.NEXT_PUBLIC_NODE_PRODUCTION && (
						<link rel="preconnect" href={process.env.NEXT_PUBLIC_NODE_PRODUCTION} />
					)}
					<link rel="shortcut icon" href="/images/logo/asa.svg" />
					<link rel="apple-touch-icon" href="/images/logo/asa.svg" />
					<link rel="manifest" href="/manifest.json" />
				</Head>
				<body>
					<Main />
					<NextScript />
					<div id="portal-root" />
				</body>
			</Html>
		)
	}
}

export default MyDocument
