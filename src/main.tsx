import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Route, Outlet, Navigate } from 'react-router-dom'
import './index.css'
import { ScantlingsContextProvider } from './Context/ScantlingsContext.tsx'
import Login from './Routes/Login.tsx'
import { GeneralPage } from './Routes/General.tsx'
import { ZonePage } from './Routes/Zone.tsx'
import { Results } from './Routes/Results.tsx'

const isAuthenticated = true // Replace with your authentication logic

const router = createBrowserRouter([
  {
    path: '/',
    element: isAuthenticated
      ? (
      <Outlet />
        )
      : (
      <Navigate to="/login" />
        ),
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
        path: 'zone/:zoneName/results',
        element: <Results />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
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
