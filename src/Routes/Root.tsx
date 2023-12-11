import { Outlet } from 'react-router-dom'

export const Root = () => {
  return (
    <main className='p-6 flex flex-col items-center'>
      <h1 className='font-bold text-xl text-center mb-5'>Scantling Software</h1>
      <Outlet/>
    </main>
  )
}
