import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import './index.css'
import { ScantlingsContextProvider } from './Context/ScantlingsContext.tsx'
import Login from './Routes/Login.tsx'
import { GeneralPage } from './Routes/General.tsx'
import { ZonePage } from './Routes/Zone.tsx'
import { Results } from './Routes/Results.tsx'
import PrivateRoute from './components/PrivateRoute' // Import the PrivateRoute component

const isAuthenticated = true // Replace with your authentication logic

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Outlet />
    ),
    children: [
      {
        path: '/',
        element: (
          <PrivateRoute isAuthenticated={isAuthenticated} path="/" element={<GeneralPage />} />
        )
      },
      {
        path: 'zone/:zoneName',
        element: (
          <PrivateRoute isAuthenticated={isAuthenticated} path="zone/:zoneName" element={<ZonePage />} />
        )
      },
      {
        path: 'zone/:zoneName/results',
        element: (
          <PrivateRoute isAuthenticated={isAuthenticated} path="zone/:zoneName/results" element={<Results />} />
        )
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
