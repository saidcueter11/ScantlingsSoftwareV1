import { type SyntheticEvent } from 'react'
import { useScantlingsContext } from '../Context/ScantlingsContext'
import { FormContainer } from '../components/FormContainer'
import { ZoneFormContainer } from '../components/zoneForms/ZoneFormContainer'
import { PlatingForm } from '../components/zoneForms/PlatingForm'
import { useNavigate } from 'react-router-dom'
import { StiffenersForm } from '../components/zoneForms/StiffenersForm'
import { PrimaryButton } from '../components/PrimaryButton'

export const ZonePage = () => {
  const { material, zone, context } = useScantlingsContext()
  const navigate = useNavigate()
  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    navigate('results')
  }

  const goBack = () => { history.back() }
  return (
    <>
      <section className='flex flex-col justify-between text-center gap-2 max-w-xs sm:max-w-xl lg:max-w-4xl mt-5'>
        <div className=''>
          <p className='font-semibold tracking-wider text-[#9ac400]'>ESCATONILLADO</p>
          <p className='italic font-medium'>{context}</p>
        </div>
        <div className='flex justify-evenly'>
          <div className='w-28'>
            <p className='font-semibold tracking-wider text-[#5c7f63]'>MATERIAL</p>
            <p className='italic font-medium'>{material}</p>
          </div>
          <div className='w-28'>
            <p className='font-semibold tracking-wider text-[#5c7f63]'>ZONA</p>
            <p className='italic font-medium'>{zone}</p>
          </div>
        </div>
      </section>

      <section className='grid lg:grid-cols-3 items-center lg:justify-between justify-center'>
        <div className='lg:col-span-2 flex-col flex justify-center items-center'>
          <FormContainer handleSubmit={handleSubmit}>

            {
              context === 'Plating' && <PlatingForm />
            }

            {
              context === 'Stiffeners' && <StiffenersForm />
            }

            <ZoneFormContainer />

            <div className='flex gap-4'>
              <PrimaryButton handleClick={goBack} text='Ir Atras'/>
              <PrimaryButton text='Siguiente'/>
            </div>

          </FormContainer>
        </div>

        <figure className='lg:col-span-1 flex flex-col gap-6'>
          <img className='h-60' src="/MER-4296-117-01-CUADERNA-MAESTRA-Model (1).png" alt="" />
          <img className='h-60' src="/MER-4296-130-01A-ESTRUCTURA-GENERAL-Model (1).png" alt="" />
        </figure>
      </section>

    </>

  )
}
