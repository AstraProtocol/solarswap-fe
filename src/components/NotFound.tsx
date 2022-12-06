import { Logo, NormalButton } from '@astraprotocol/astra-ui'
import { useTranslation } from 'contexts/Localization'
import Link from 'next/link'

const NotFound = () => {
	const { t } = useTranslation()

	return (
		<div className="margin-auto flex col flex-align-center padding-top-2xl">
			<Logo type="transparent" hasText={false} />
			<div className="text text-4xl text-bold margin-bottom-sm">404</div>
			<div className="text text-lg margin-bottom-sm">{t('Oops, page not found.')}</div>
			<Link href="/" passHref>
				<NormalButton>{t('Back Home')}</NormalButton>
			</Link>
		</div>
	)
}

export default NotFound
