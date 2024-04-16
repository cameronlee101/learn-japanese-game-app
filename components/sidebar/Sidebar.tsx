"use client";
import Link from "next/link";
import styles from "./Sidebar.module.css";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

const sidebarItems = [
	{
		name: "Home",
		href: "/",
	},
	{
		name: "Flashcards",
		href: "/selection/flashcards",
	},
	{
		name: "M.C. Quiz",
		href: "/selection/mc-quiz",
	},
	{
		name: "Matching",
		href: "/selection/matching",
	},
	{
		name: "See Contents",
		href: "/selection/contents-of",
	},
];

const Sidebar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleSidebar = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className={`${styles.sidebarContainer}`}>
			<GiHamburgerMenu
				data-test="sidemenu-button"
				className={`${styles.menuButton} ${isOpen ? "" : styles.closed}`}
				onMouseUp={toggleSidebar}
			/>
			<nav
				className={`${styles.sidebar} ${isOpen ? "" : styles.closed}`}
				data-test="sidemenu"
			>
				<ul className="mx-auto flex justify-between flex-col">
					{sidebarItems.map((item, index) => (
						<li
							className={`${styles.sidebarLink} ${isOpen ? "" : styles.closed}`}
							key={item.name}
						>
							<Link
								href={item.href}
								className={`${styles.navLink}`}
								onMouseUp={toggleSidebar}
								data-test={`sidemenu-link-${index}`}
							>
								{item.name}
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</div>
	);
};

export default Sidebar;
