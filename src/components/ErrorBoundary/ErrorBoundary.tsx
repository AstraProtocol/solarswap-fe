import { Logo } from '@astraprotocol/astra-ui'
import { ErrorBoundary as SentryErrorBoundary, Severity } from '@sentry/nextjs'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import { useTheme } from 'next-themes'
import { useCallback } from 'react'

export default function ErrorBoundary({ children }) {
	const { t } = useTranslation()
	const { resolvedTheme } = useTheme()
	const handleOnClick = useCallback(() => window.location.reload(), [])

	return (
		<SentryErrorBoundary
			beforeCapture={scope => {
				scope.setLevel(Severity.Fatal)
			}}
			fallback={({ eventId }) => {
				return (
					<div className={`${resolvedTheme}--mode`}>
						<Page>
							<Logo type="transparent" hasText={false} />
							<span className="text text-lg">{t('Oops, something wrong.')}</span>
							{/* {eventId && (
							<div>
								<span>{t('Error Tracking Id')}</span>
							</div>
						)} */}
							<button className="text text-base" onClick={handleOnClick}>
								{t('Click here to reset!')}
							</button>
						</Page>
					</div>
				)
			}}
		>
			{children}
		</SentryErrorBoundary>
	)
}
