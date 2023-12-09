'use client'
import Link from 'next/link'
import styles from './Sidebar.module.css'
import { useState } from 'react'
import { GiHamburgerMenu } from "react-icons/gi";

const sidebarItems = [
    {
        name: 'Home',
        href: '/',
    },
    {
        name: 'Thing1',
        href: '/',
    },
    {
        name: 'Thing2',
        href: '/',
    },
    {
        name: 'Thing3',
        href: '/',
    },
]

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className={styles.sidebarContainer}>
            <GiHamburgerMenu 
                className={styles.menuButton} 
                onClick={toggleSidebar}
                closed-sidebar={(!isOpen).toString()}
            />
            <aside 
                className={styles.sidebar} 
                closed-sidebar={(!isOpen).toString()}
            >
                <ul className='mx-auto flex justify-between flex-col'>
                    {sidebarItems.map((item) => (
                        <li 
                            className={styles.li} 
                            closed-sidebar={(!isOpen).toString()}
                            key={item.name}
                        >
                            <Link 
                                href={item.href} 
                                className={styles.sidebarLink}
                                onClick={toggleSidebar}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </aside>
        </div>
    )
}

export default Sidebar