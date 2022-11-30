import styled from "styled-components";
import { Button, Heading, Text, LogoIcon } from "@solarswap/uikit";
import Page from "components/Layout/Page";
import { useTranslation } from "contexts/Localization";
import Link from "next/link";

const NotFound = () => {
	const { t } = useTranslation();

	return <div>Not Found</div>;
};

export default NotFound;
