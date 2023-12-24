'use client'
import Link from 'next/link'
import './Sidebar.css'
import { useState } from 'react'
import { GiHamburgerMenu } from "react-icons/gi";

const sidebarItems = [
    {
        name: 'Home',
        href: '/',
    },
    {
        name: 'Flashcards',
        href: '/pages/selection/flashcards-activity',
    },
    {
        name: 'M.C. Quiz',
        href: '/pages/selection/mc-quiz',
    },
    {
        name: 'See Contents',
        href: '/pages/selection/contents-of',
    },
]

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className='sidebarContainer'>
            <GiHamburgerMenu 
                className={`menuButton ${isOpen ? '' : 'closed'}`}
                onClick={toggleSidebar}
            />
            <aside 
                className={`sidebar ${isOpen ? '' : 'closed'}`}
            >
                <ul className='mx-auto flex justify-between flex-col'>
                    {sidebarItems.map((item) => (
                        <li 
                            className={`${isOpen ? '' : 'closed'}`}
                            key={item.name}
                        >
                            <Link 
                                href={item.href} 
                                className='sidebarLink'
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