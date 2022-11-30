import { Collapse, Typography } from "@astraprotocol/astra-ui";
import { CollapseProps } from "@astraprotocol/astra-ui/lib/es/components/Collapse";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/router";
import { MenuItem } from "./Navigation";
import styles from "./style.module.scss";

type MobileNavigationProps = {
	items: MenuItem[];
};

const Checked = () => <span className="icon-checked alert-color-success block-ver-center"></span>;

const LinkMenuItem = ({
	link,
	label,
	pathname,
	classes,
	prefix,
}: {
	link?: string;
	label?: React.ReactNode;
	pathname?: string;
	classes?: string;
	prefix?: React.ReactNode;
}) => (
	<div
		className={clsx("radius-base", "padding-sm", styles.subItem, {
			[styles.subActive]: pathname === link,
		})}
	>
		<span className="block-center">
			{!!prefix && prefix}
			<Typography.Link href={link || ""} classes={clsx("text text-lg", styles.link, classes)}>
				{label}
			</Typography.Link>
		</span>
		{pathname === link && <Checked />}
	</div>
);

export default function MoibleNavigation({ items }: MobileNavigationProps) {
	const router = useRouter();
	const { pathname, locale } = router;

	const _renderMenu = () => {
		const menus: React.ReactNode[] = [];
		let titleElement = null;
		for (let item of items) {
			if (item.submenus) {
				let subCollapse = [];
				if (item.type == "locale") {
					const localeItem = item.submenus.find((item) => item.link === `/${locale}`);
					titleElement = (
						<>
							<span
								className={clsx(
									"text-base text-center text-bold",
									"contrast-color-70",
									"block-center pointer padding-top-xs"
								)}
								key={`title-${localeItem?.label}`}
							>
								<Image
									alt={locale}
									src={`/images/flag/${locale}.svg`}
									width={30}
									height={19}
								/>
								<span className="padding-left-xs">{localeItem?.label}</span>
							</span>
						</>
					);
					subCollapse = item.submenus.map((item) => (
						<LinkMenuItem
							link={item.link}
							label={item.label}
							pathname={pathname}
							classes={"padding-left-xs"}
							key={`sub-${item.label}`}
							prefix={
								<span className="padding-left-md">
									<Image
										alt={locale}
										src={`/images/flag/${item.link}.svg`}
										width={30}
										height={19}
									/>
								</span>
							}
						/>
					));
				} else {
					titleElement = (
						<span>
							{item.label} {item.prefixIcon}
						</span>
					);
					subCollapse = item.submenus.map((item) => (
						<LinkMenuItem
							link={item.link}
							label={item.label}
							key={item.id}
							pathname={pathname}
							classes={"padding-left-md"}
							prefix={item.prefix}
						/>
					));
				}
				const collapse: CollapseProps = {
					title: titleElement,
					content: <>{subCollapse}</>,
				};
				menus.push(
					<Collapse
						key={`collapse-${item.label}`}
						{...collapse}
						classes={{ wrapper: "border border-bottom-base" }}
					/>
				);
			} else {
				menus.push(
					<LinkMenuItem
						key={item.label}
						link={item.link}
						label={item.label}
						pathname={pathname}
					/>
				);
			}
		}
		return menus;
	};
	return <>{_renderMenu()}</>;
}
