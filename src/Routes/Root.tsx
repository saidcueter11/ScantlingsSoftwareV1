import { Outlet } from 'react-router-dom'
import { NavBar } from '../components/NavBar'

export const Root = () => {
  return (
    <>
      <div className="pattern-cross pattern-orange-500 pattern-bg-white pattern-opacity-20 pattern-size-4 fixed top-0 left-0 right-0 bottom-0"></div>
      <main className='p-6 pt-0 flex flex-col items-center relative'>
        <NavBar />
        <h1 className='font-bold tracking-wider text-2xl text-center text-[#5c7f63]'><span className='text-[#9ac400]'>SCANTLING</span> SOFTWARE</h1>
        <Outlet/>
      </main>
    </>
  )
}
