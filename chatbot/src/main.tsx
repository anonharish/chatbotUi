import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { ReactErrorBoundary } from '@/components/ErrorBoundary'
import router from '@/router'
import './index.css'
import './features/region-selection/styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactErrorBoundary>
      <RouterProvider router={router} />
    </ReactErrorBoundary>
  </StrictMode>,
)
