import { type SyntheticEvent } from 'react'
import { useScantlingsContext } from '../Context/ScantlingsContext'
import { FormContainer } from '../components/FormContainer'
import { ZoneFormContainer } from '../components/zoneForms/ZoneFormContainer'
import { PlatingForm } from '../components/zoneForms/PlatingForm'
import { useNavigate } from 'react-router-dom'
import { StiffenersForm } from '../components/zoneForms/StiffenersForm'
import { PrimaryButton } from '../components/PrimaryButton'
import { type PlatingResult, type StiffenerResult } from '../types'
import { usePlating } from '../hooks/usePlating'
import { useStiffener } from '../hooks/useStiffeners'

export const ZonePage = () => {
  const { zone, context, material } = useScantlingsContext()

  const {
    bottomStiffener,
    sideTransomStiffener,
    deckStiffener,
    watertightBulkheadsStiffener,
    integralTankBulkheadsStiffener,
    washPlatesStiffener,
    collisionBulkheadsStiffener,
    superstructuresDeckhousesStiffener
  } = useStiffener()

  const {
    bottomPlating,
    sideTransomPlating,
    deckPlating,
    watertightBulkheadsPlating,
    integralTankBulkheadsPlating,
    washPlatesPlating,
    collisionBulkheadsPlating,
    superstructuresDeckhousesPlating,
    tFinal,
    wMin,
    smInner,
    smOuter,
    secondI,
    thickness
  } = usePlating()

  const navigate = useNavigate()

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    navigate('results')
  }

  const renderResults = ({ platingData, stiffenerData }: { platingData?: PlatingResult, stiffenerData?: StiffenerResult }) => {
    const flag = context === 'Plating' ? platingData : stiffenerData

    const isPlating = (data: PlatingResult | StiffenerResult): data is PlatingResult => {
      return context === 'Plating' && 'type' in data && data.type !== undefined
    }

    console.log({ platingData })

    switch (flag?.type) {
      case 'Metal':
        if (isPlating(flag)) {
          return <p>El espesor (Metal) es: {tFinal?.toFixed(3)}</p>
        } else {
          return (
          <div>
            <p>Área del Alma (cm²): {flag?.AW}</p>
            <p>Módulo de seccion (cm³): {flag?.SM}</p>
          </div>
          )
        }
      case 'SingleSkin':
        if (isPlating(flag)) {
          return (
          <div>
            <p>El espesor (Fibra Laminada) es: {tFinal?.toFixed(3)}</p>
            <p>Minimo espesor requerido: {wMin}</p>
          </div>
          )
        } else {
          return (
          <div>
            <p>Área del Alma (cm²): {flag?.AW}</p>
            <p>Módulo de seccion (cm³): {flag?.SM}</p>
            <p>Segundo momento de inercia (cm⁴): {flag?.I}</p>
          </div>
          )
        }
      case 'FrpSandwich':
        if (isPlating(flag)) {
          return (
          <div>
            <p>El espesor (Sandwich de FRP) es: {thickness?.toFixed(3)}</p>
            <p>Interior SM: {smInner?.toFixed(3)}</p>
            <p>Exterior SM: {smOuter?.toFixed(3)}</p>
            <p>Segundo momento de área I: {secondI?.toFixed(3)}</p>
            <p>Minimo espesor requerido: {wMin}</p>
          </div>
          )
        } else {
          return (
          <div>
            <p>Área del Alma (cm²): {flag?.AW}</p>
            <p>Módulo de seccion (cm³): {flag?.SM}</p>
            <p>Segundo momento de inercia (cm⁴): {flag?.I}</p>
          </div>
          )
        }
      case 'Wood':
        if (isPlating(flag)) {
          return <p>El espesor (Madera) es: {tFinal?.toFixed(3)}</p>
        }

        return (
          <div>
            <p>Área del Alma (cm²): {flag?.AW}</p>
            <p>Módulo de seccion (cm³): {flag?.SM}</p>
          </div>
        )
      default:
        return <p>No hay datos disponibles para este material.</p>
    }
  }

  const renderZoneResults = () => {
    switch (zone) {
      case 'Fondo':
        return (
          <>
            {renderResults({ platingData: bottomPlating, stiffenerData: bottomStiffener })}
          </>
        )
      case 'Costados y Espejo':
        return (
          <>
            {renderResults({ platingData: sideTransomPlating, stiffenerData: sideTransomStiffener })}
          </>
        )
      case 'Cubierta':
        return (
          <>
            {renderResults({ platingData: deckPlating, stiffenerData: deckStiffener })}
          </>
        )
      case 'Mamparos estancos':
        return (
          <>
            {renderResults({ platingData: watertightBulkheadsPlating, stiffenerData: watertightBulkheadsStiffener })}
          </>
        )
      case 'Mamparos de tanques integrales':
        return (
          <>
            {renderResults({ platingData: integralTankBulkheadsPlating, stiffenerData: integralTankBulkheadsStiffener })}
          </>
        )
      case 'Placas anti oleaje':
        return (
          <>
            {renderResults({ platingData: washPlatesPlating, stiffenerData: washPlatesStiffener })}
          </>
        )
      case 'Mamparos de colisión':
        return (
          <>
            {renderResults({ platingData: collisionBulkheadsPlating, stiffenerData: collisionBulkheadsStiffener })}
          </>
        )
      case 'Superestructura':
        return (
            <>
              {renderResults({ platingData: superstructuresDeckhousesPlating, stiffenerData: superstructuresDeckhousesStiffener })}
            </>
        )
      default:
        return <p>Seleccione una zona para ver los resultados.</p>
    }
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
        <div className='lg:col-span-2 flex-col flex justify-center items-center order-2'>
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
            </div>

          </FormContainer>
        </div>

        <figure className='lg:col-span-1 flex flex-col gap-6 order-1'>
          <img className='h-60' src="/MER-4296-117-01-CUADERNA-MAESTRA-Model (1).png" alt="" />
          <img className='h-60' src="/MER-4296-130-01A-ESTRUCTURA-GENERAL-Model (1).png" alt="" />
        </figure>
      </section>

      <section>
        <h3>Resultados</h3>

        {renderZoneResults()}
      </section>

    </>

  )
}
