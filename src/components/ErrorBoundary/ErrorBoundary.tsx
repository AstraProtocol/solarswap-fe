import { Logo } from '@astraprotocol/astra-ui'
import * as Sentry from '@sentry/react'
import { useTranslation } from 'contexts/Localization'

export default function ErrorBoundary({ children }) {
	const { t } = useTranslation()
	return (
		<Sentry.ErrorBoundary
			beforeCapture={scope => {
				scope.setLevel(Sentry.Severity.Fatal)
			}}
			fallback={({ eventId }) => {
				return (
					<div>
						<Logo type="transparent" hasText={false} />
						<span className="text text-lg">{t('Oops, something wrong.')}</span>
						{eventId && (
							<div>
								<span>{t('Error Tracking Id')}</span>
							</div>
						)}
						<button className="text text-base" onClick={() => window.location.reload()}>
							{t('Click here to reset!')}
						</button>
					</div>
				)
			}}
		>
			{children}
		</Sentry.ErrorBoundary>
	)
}
