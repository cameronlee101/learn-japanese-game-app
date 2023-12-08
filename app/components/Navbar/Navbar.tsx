import Link from 'next/link'
import styles from './Navbar.module.css'

const Navbar = () => {
    return (
        <nav className='bg-slate-600 p-4 sticky top-0 drop-shadow-xl z-10'>
            <div className='mx-auto flex justify-between flex-col sm:flex-row max-w-3xl'>
                <Link href='/' className={styles.navbarLink}>Home</Link>
                <Link href='/' className={styles.navbarLink}>Thing1</Link>
                <Link href='/' className={styles.navbarLink}>Thing2</Link>
                <Link href='/' className={styles.navbarLink}>Thing3</Link>
            </div>
        </nav>
    )
}

export default Navbar