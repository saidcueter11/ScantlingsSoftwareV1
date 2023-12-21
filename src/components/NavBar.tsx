// instrucciones de uso
// norma
// definiciones y acronimos

import { useState } from 'react'

// exportacion de datos

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const handleClick = () => { setIsOpen(prev => !prev) }
  return (
      <div className="relative w-full">
        <div className={`bg-white flex flex-col shadow-lg rounded-lg h-full max-w-xs min-w-fit w-2/4 fixed z-20 top-0 right-0 p-4 ${!isOpen ? 'translate-x-full' : 'translate-x-0'} transition-transform`}>
          <img src="/WhatsApp Image 2023-12-11 at 7.50.54 AM.jpeg" alt="" className='w-44 absolute bottom-8'/>
          <div className='flex items-center gap-4'>
            <svg onClick={handleClick} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 hover:cursor-pointer">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            <h4 className='font-bold text-[#5c7f63]'>Definiciones</h4>
          </div>

          <div className='flex flex-col mt-4 gap-2'>
            <a target='_blank' href="/ISO 12215-5 (2).pdf">ISO 12215-5</a>
            <a target='_blank' href="/Definiciones y Acrónimos (1).pdf">Definiciones y Acrónimos</a>
          </div>
        </div>

        <nav className="py-3 w-full flex justify-between items-center ">
          <img className='h-16' src="/LOGOTIPO ECOTEA-06.png" alt="" />

          <div onClick={handleClick} className='hover:cursor-pointer border-2 border-black border-opacity-0 hover:border-opacity-80 rounded-lg transition-opacity'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </div>
        </nav>

      </div>
  )
}
