import React, { useState } from 'react'
import { PrimaryButton } from '../components/PrimaryButton'
import { useNavigate } from 'react-router-dom'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('') // State for error message
  const navigate = useNavigate()

  const handleLogin = () => {
    if (username.endsWith('@cotecmar.com')) {
      // Perform authentication logic here (replace with your actual logic)
      // If authentication fails, set an error message
      const authenticationFailed = false // Replace with your authentication logic result
      if (authenticationFailed) {
        setErrorMessage('Authentication failed. Please check your credentials.')
      } else {
        // Successful authentication
        console.log('Username:', username)
        console.log('Password:', password)
        navigate('/')
      }
    } else {
      setErrorMessage('Correo invalido, el dominio debe ser "@cotecmar.com".')
    }
  }
  return (
    <>
      <div className="pattern-cross pattern-orange-500 pattern-bg-white pattern-opacity-20 pattern-size-4 fixed top-0 left-0 right-0 bottom-0"></div>
      <div className="min-h-screen flex flex-col items-center justify-center relative">
        <nav className='w-screen pt-6 pl-6 absolute top-0'>
          <img className='h-16 mb-5 md:ml-8 md:mt-3' src="/LOGOTIPO ECOTEA-06.png" alt="" />
        </nav>
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-semibold mb-4">Login</h2>
          {(errorMessage.length > 0) && (
          <div className="mb-4 text-red-500">{errorMessage}</div>
          )}
          <div className="mb-4">
            <label className="block text-gray-600 text-sm">Usuario</label>
            <input
              type="text"
              className="border w-full p-2 rounded-md focus:outline-none focus:ring focus:border-blue-400"
              placeholder="Ingrese su usuario"
              value={username}
              required
              onChange={(e) => { setUsername(e.target.value) }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm">Contraseña</label>
            <input
              type="password"
              className="border w-full p-2 rounded-md focus:outline-none focus:ring focus:border-blue-400"
              placeholder="Contraseña"
              value={password}
              required
              onChange={(e) => { setPassword(e.target.value) }}
            />
          </div>
          <PrimaryButton text='Login' handleClick={handleLogin} />
        </div>
      </div>
    </>
  )
}

export default Login
