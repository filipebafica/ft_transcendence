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
	console.log(props)
  const { children, disableFooter } = props

  return (
    <>
      <Header />
      <div className={styles.mainContent}>{children}</div>
      {!disableFooter && <Footer />}
    </>
  )
}

export default Layout
