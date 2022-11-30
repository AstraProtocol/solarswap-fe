import * as Sentry from "@sentry/react";
import { useTranslation } from "contexts/Localization";

export default function ErrorBoundary({ children }) {
	const { t } = useTranslation();
	return (
		<Sentry.ErrorBoundary
			beforeCapture={(scope) => {
				scope.setLevel(Sentry.Severity.Fatal);
			}}
			fallback={({ eventId }) => {
				return (
					<div>
						<h1>Co loi xay ra. {eventId}</h1>
						<button onClick={() => window.location.reload()}>
							{t("Click here to reset!")}
						</button>
					</div>
					// <Page>
					//   <Flex flexDirection="column" justifyContent="center" alignItems="center">
					//     <LogoIcon width="64px" mb="8px" />
					//     <Text mb="16px">{t('Oops, something wrong.')}</Text>
					//     {eventId && (
					//       <Flex flexDirection="column" style={{ textAlign: 'center' }} mb="8px">
					//         <Text>{t('Error Tracking Id')}</Text>
					//         <Flex alignItems="center">
					//           <Text>{eventId}</Text>
					//           <IconButton variant="text" onClick={() => copyText(eventId)}>
					//             <CopyIcon color="primary" width="24px" />
					//           </IconButton>
					//         </Flex>
					//       </Flex>
					//     )}
					//     <Button onClick={() => window.location.reload()}>{t('Click here to reset!')}</Button>
					//   </Flex>
					// </Page>
				);
			}}
		>
			{children}
		</Sentry.ErrorBoundary>
	);
}
