import { useMobileLayout } from '@astraprotocol/astra-ui'
import { useTranslation } from 'contexts/Localization'
import Image from 'next/image'
import { isAstraApp } from 'utils'

const PhisingBanner = () => {
	const { isMobile } = useMobileLayout('small')
	const { t } = useTranslation()
	const URL = process.env.NEXT_PUBLIC_HOST

	if (isAstraApp()) return null

	return (
		<div
			className="banner flex flex-justify-center flex-align-center padding-top-md padding-bottom-md"
			style={{ backgroundColor: '#1C2742', gap: 10 }}
		>
			<Image src="/images/ic_secure.png" width={isMobile ? 84 : 44} height={isMobile ? 80 : 40} alt="icon" />
			<div style={{ lineHeight: 1.2 }}>
				<span style={{ color: '#FFA549' }}>{t('Phishing warning: Please make sure you’re visiting')}</span>
				<a
					href={URL}
					target="_blank"
					rel="noreferrer"
					className="margin-left-xs margin-right-xs contrast-color-100"
				>
					{URL}
				</a>
				<span style={{ color: '#FFA549' }}>- {t('Check the URL carefully')}.</span>
			</div>
		</div>
	)
}

export default PhisingBanner
