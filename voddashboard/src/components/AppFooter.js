import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://coreui.io" target="_blank" rel="noopener noreferrer">
          Dashboard
        </a>
        <span className="ms-1">&copy; 2025 THFILM.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">
          React Admin &amp;
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
