import React from 'react'

import styles from './style.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      © {new Date().getFullYear()} 42 Transcendence, Inc. All rights reserved.
    </footer>
  )
}

export default Footer
