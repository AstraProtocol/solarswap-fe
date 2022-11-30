import clsx from "clsx";
import React, { ReactNode, Suspense, useEffect } from "react";
import { Footer, PageLoader, ToastWrapper } from "@astraprotocol/astra-ui";
import styles from "./Layout.module.scss";
import { useTheme } from "next-themes";
import Navbar from "./Navbar";

type Props = {
	children: ReactNode;
};

const Layout: React.FC<Props> = (props) => {
	const { resolvedTheme } = useTheme();

	return (
		<Suspense fallback={<PageLoader />}>
			<div className={clsx(`${resolvedTheme}--mode`, styles.layoutContainer)}>
				<Navbar />
				<div className={styles.layout}>{props.children}</div>
				<Footer logoTitle={process.env.NEXT_PUBLIC_TITLE} />
				<div id="modal-root"></div>
				<ToastWrapper />
			</div>
		</Suspense>
	);
};

export default Layout;
