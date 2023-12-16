import React from 'react'

// Components
import Header from './Header'
import Footer from './Footer'

// Styles
import styles from './style.module.css'

interface LayoutProps {
  children: React.ReactNode
  disableFooter?: boolean
}

const Layout = (props: LayoutProps) => {
  const { children, disableFooter } = props

  return (
    <div className={styles.mainContainer}>
      <Header />
      <div className={styles.mainContent}>{children}</div>
      {!disableFooter && <Footer />}
    </div>
  )
}

export default Layout
