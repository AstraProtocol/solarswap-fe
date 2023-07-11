import { useTranslation } from 'contexts/Localization'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { DEFAULT_META, getCustomMeta } from 'config/constants/meta'
import { useAstraUsdtPrice } from 'hooks/useUSDTPrice'
import { Container } from '@astraprotocol/astra-ui'

// const StyledPage = styled(Container)`
//   min-height: calc(100vh - 64px);
//   padding-top: 16px;
//   padding-bottom: 16px;

//   ${({ theme }) => theme.mediaQueries.sm} {
//     padding-top: 24px;
//     padding-bottom: 24px;
//   }

//   ${({ theme }) => theme.mediaQueries.lg} {
//     padding-top: 32px;
//     padding-bottom: 32px;
//   }
// `

export const PageMeta: React.FC<{ symbol?: string }> = ({ symbol }) => {
	const { t } = useTranslation()
	const { pathname } = useRouter()
	const astraPriceUsd = useAstraUsdtPrice()

	const asaPriceUsdDisplay = astraPriceUsd ? `$${astraPriceUsd.toFixed(3)}` : ''

	const pageMeta = getCustomMeta(pathname, t) || {}
	const { title, description, image } = { ...DEFAULT_META, ...pageMeta }
	let pageTitle = asaPriceUsdDisplay ? [title, asaPriceUsdDisplay].join(' - ') : title
	if (symbol) {
		pageTitle = [symbol, title].join(' - ')
	}

	return (
		<Head>
			<title>{pageTitle}</title>
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={image} />
		</Head>
	)
}

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
	symbol?: string
}

const Page: React.FC<PageProps> = ({ children, symbol, ...props }) => {
	return (
		<>
			<PageMeta symbol={symbol} />
			<Container {...props}>{children}</Container>
		</>
	)
}

export default Page
