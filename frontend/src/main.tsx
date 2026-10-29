import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'

import { Providers } from '@/app/providers'
import { router } from '@/app/router'
import './index.css'

// TEMPORARY: ?bg=dots|grid|stripes|spotlight previews a page background (see index.css).
const previewBg = new URLSearchParams(window.location.search).get('bg')
if (previewBg && ['dots', 'grid', 'stripes', 'spotlight'].includes(previewBg)) document.body.dataset.bg = previewBg

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root in index.html')

createRoot(root).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>,
)
