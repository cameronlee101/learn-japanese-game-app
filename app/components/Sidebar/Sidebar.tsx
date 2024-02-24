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
    href: "/pages/selection/flashcards-activity",
  },
  {
    name: "M.C. Quiz",
    href: "/pages/selection/mc-quiz",
  },
  {
    name: "Matching",
    href: "/pages/selection/matching-activity",
  },
  {
    name: "See Contents",
    href: "/pages/selection/contents-of",
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
        onClick={toggleSidebar}
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
                onClick={toggleSidebar}
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
