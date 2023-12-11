import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { GeneralPage } from './Routes/General.tsx'
import { ZonePage } from './Routes/Zone.tsx'
import { Root } from './Routes/Root.tsx'
import { ScantlingsContextProvider } from './Context/ScantlingsContext.tsx'
import { Results } from './Routes/Results.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    children: [
      {
        path: '/',
        element: <GeneralPage />
      },
      {
        path: 'zone/:zoneName',
        element: <ZonePage />
      },
      {
        path: '/zone/:zoneName/results',
        element: <Results />
      }
    ]
  }
])

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ScantlingsContextProvider>
      <RouterProvider router={router} />
    </ScantlingsContextProvider>
  </React.StrictMode>
)
