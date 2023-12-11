import { type SyntheticEvent } from 'react'
import { useScantlingsContext } from '../Context/ScantlingsContext'
import { FormContainer } from '../components/FormContainer'
import { GoBackArrow } from '../components/GoBackArrow'
import { ZoneFormContainer } from '../components/zoneForms/ZoneFormContainer'
import { GeneralZoneForm } from '../components/zoneForms/GeneralZoneForm'
import { useNavigate } from 'react-router-dom'

export const ZonePage = () => {
  const { material, zone, context } = useScantlingsContext()
  const navigate = useNavigate()
  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    navigate('results')
  }

  return (
    <FormContainer handleSubmit={handleSubmit}>
      <GoBackArrow />
      <section className='flex-col flex items-center text-center'>
        <p>El material seleccionado es: <span className='font-bold italic'>{material}</span></p>
        <p>La zona seleccionada es: <span className='font-bold italic'>{zone}</span></p>
        <p>El tipo de escantillonado es: <span className='font-bold italic'>{context}</span></p>
      </section>

      <GeneralZoneForm />

      <ZoneFormContainer />

      <button className={'bg-slate-600 rounded-lg p-3 mt-5 text-slate-50 transition-opacity col-span-2 w-44 justify-self-center hover:opacity-75'}>Siguiente</button>

    </FormContainer>

  )
}
