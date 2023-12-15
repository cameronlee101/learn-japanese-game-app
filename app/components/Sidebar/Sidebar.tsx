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
        name: 'Flashcards',
        href: '/pages/flashcards-select',
    },
    {
        name: 'Test1',
        href: '/pages/test1',
    },
    {
        name: 'Test2',
        href: '/pages/test2',
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
                className={`${styles.menuButton} ${isOpen ? '' : styles.closed}`}
                onClick={toggleSidebar}
            />
            <aside 
                className={`${styles.sidebar} ${isOpen ? '' : styles.closed}`}
            >
                <ul className='mx-auto flex justify-between flex-col'>
                    {sidebarItems.map((item) => (
                        <li 
                            className={`${styles.li} ${isOpen ? '' : styles.closed}`}
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