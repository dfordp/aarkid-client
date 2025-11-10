import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RecoilRoot } from 'recoil'
import { CustomToaster } from './components/elements/Toaster.tsx'
import DataLoader from './components/elements/DataLoader.tsx'
import { Analytics } from "@vercel/analytics/react"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <DataLoader/>
      <App />
      <Analytics/>
      <CustomToaster/>
    </RecoilRoot>
  </React.StrictMode>,
)
