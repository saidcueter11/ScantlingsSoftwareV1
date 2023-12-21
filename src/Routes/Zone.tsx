import { useEffect, useState, type SyntheticEvent } from 'react'
import { useScantlingsContext } from '../Context/ScantlingsContext'
import { FormContainer } from '../components/FormContainer'
import { ZoneFormContainer } from '../components/zoneForms/ZoneFormContainer'
import { PlatingForm } from '../components/zoneForms/PlatingForm'
import { useNavigate } from 'react-router-dom'
import { StiffenersForm } from '../components/zoneForms/StiffenersForm'
import { PrimaryButton } from '../components/PrimaryButton'
import { type PlatingData, type PressureData, type StiffenerData, type PlatingResult, type StiffenerResult } from '../types'
import { usePlating } from '../hooks/usePlating'
import { useStiffener } from '../hooks/useStiffeners'
import { usePressures } from '../hooks/usePressures'
import { exportToExcel } from '../utils/exportToExcel'

export const ZonePage = () => {
  const { zone, context, material, category, LH, LWL, BC, BWL, mLDC, V, B04, skinExterior, skinInterior, resetStates } = useScantlingsContext()

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
    thickness,
    smInner,
    smOuter,
    secondI
  } = usePlating()

  const { designCategoryKDC, dynamicLoadNCG, longitudinalPressureDistributionKL, hullSidePressureReductionKZ, areaPressureReductionKAR, bottomPressure, sideTransomPressure, deckPressure, superstructuresDeckhousesPressure, washPlatesPressure, watertightBulkheadsPressure, integralTankBulkheadsPressure, collisionBulkheadsPressure } = usePressures()

  const [, setCurrentPlating] = useState<PlatingResult>(bottomPlating)
  const [currentStiffener, setCurrentStiffener] = useState<StiffenerResult>(bottomStiffener)
  const [currentPressure, setCurrentPressure] = useState(0)

  const navigate = useNavigate()

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const handleReset = () => {
    navigate('/general')
    resetStates()
  }

  const renderResults = ({ platingData, stiffenerData }: { platingData?: PlatingResult, stiffenerData?: StiffenerResult }) => {
    const flag = context === 'Plating' ? platingData : stiffenerData

    const isPlating = (data: PlatingResult | StiffenerResult): data is PlatingResult => {
      return context === 'Plating' && 'type' in data && data.type !== undefined
    }

    switch (flag?.type) {
      case 'Metal':
        if (isPlating(flag)) {
          return <p>El espesor (Metal) es: {tFinal?.toFixed(3)}[mm]</p>
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
            <p>El espesor (Fibra Laminada) es: {tFinal?.toFixed(3)}[mm]</p>
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
            <p>El espesor (Sandwich de FRP) es: {thickness}[mm]</p>
            <p>Interior SM: {smInner}</p>
            <p>Exterior SM: {smOuter}</p>
            <p>Segundo momento de área I: {secondI}</p>
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
          return <p>El espesor (Madera) es: {tFinal?.toFixed(3)}[mm]</p>
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

  useEffect(() => {
    switch (zone) {
      case 'Fondo':
        setCurrentPlating(bottomPlating)
        setCurrentStiffener(bottomStiffener)
        setCurrentPressure(bottomPressure)
        break
      case 'Costados y Espejo':
        setCurrentPlating(sideTransomPlating)
        setCurrentStiffener(sideTransomStiffener)
        setCurrentPressure(sideTransomPressure)
        break
      case 'Cubierta':
        setCurrentPlating(deckPlating)
        setCurrentStiffener(deckStiffener)
        setCurrentPressure(deckPressure)
        break
      case 'Mamparos estancos':
        setCurrentPlating(watertightBulkheadsPlating)
        setCurrentStiffener(watertightBulkheadsStiffener)
        setCurrentPressure(watertightBulkheadsPressure)
        break
      case 'Mamparos de tanques integrales':
        setCurrentPlating(integralTankBulkheadsPlating)
        setCurrentStiffener(integralTankBulkheadsStiffener)
        setCurrentPressure(integralTankBulkheadsPressure)
        break
      case 'Placas anti oleaje':
        setCurrentPlating(washPlatesPlating)
        setCurrentStiffener(washPlatesStiffener)
        setCurrentPressure(washPlatesPressure)
        break
      case 'Mamparos de colisión':
        setCurrentPlating(collisionBulkheadsPlating)
        setCurrentStiffener(collisionBulkheadsStiffener)
        setCurrentPressure(collisionBulkheadsPressure)
        break
      case 'Superestructura':
        setCurrentPlating(superstructuresDeckhousesPlating)
        setCurrentStiffener(superstructuresDeckhousesStiffener)
        setCurrentPressure(superstructuresDeckhousesPressure)
        break
      default:
        setCurrentPlating({})
        setCurrentStiffener({})
        setCurrentPressure(0)
    }
  }, [
    zone,
    bottomPlating, sideTransomPlating, deckPlating, watertightBulkheadsPlating, integralTankBulkheadsPlating,
    washPlatesPlating, collisionBulkheadsPlating, superstructuresDeckhousesPlating,
    bottomStiffener, sideTransomStiffener, deckStiffener, watertightBulkheadsStiffener, integralTankBulkheadsStiffener,
    washPlatesStiffener, collisionBulkheadsStiffener, superstructuresDeckhousesStiffener,
    bottomPressure, sideTransomPressure, deckPressure, watertightBulkheadsPressure, integralTankBulkheadsPressure,
    washPlatesPressure, collisionBulkheadsPressure, superstructuresDeckhousesPressure,
    material,
    skinExterior,
    skinInterior
  ])

  const generalData = [
    { 'Datos Generales y Dimensiones de la Embarcación': 'Tipo de análisis', Valor: 'Escantillonado' },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Norma', Valor: 'ISO 12215-5' },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Nombre de la Embarcación', Valor: 'X' },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Constructor', Valor: 'X' },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Numero del casco', Valor: 'X' },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Tipo de embarcación', Valor: 'X' },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Categoria', Valor: category },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Material', Valor: material },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Tipo de Fibra', Valor: (material === 'Fibra laminada' || material === 'Fibra con nucleo (Sandwich)') ? material : 'N/A' },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Fibra Exterior', Valor: material === 'Fibra con nucleo (Sandwich)' ? skinExterior : 'N/A' },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Fibra Interna', Valor: material === 'Fibra con nucleo (Sandwich)' ? skinInterior : 'N/A' },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Eslora del casco "LH" (metros)', Valor: LH },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Eslora en la linea de flotación "LWL" (metros)', Valor: LWL },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Manga en la linea de flotación "BWL" (metros)', Valor: BWL },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Manga entre pantoques o "chine" "BC" (metros)', Valor: BC },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Velocidad max de diseño "V" (nudos)', Valor: V },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Desplazamiento "mLDC" (Toneladas)', Valor: mLDC },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Angulo de astilla muerta en LCG "B04" (grados)', Valor: B04 }
  ]

  const pressureData: PressureData[] = [{
    Zona: zone,
    'Factor de categoria kDC': designCategoryKDC(),
    'Factor de carga dinámica nCG': dynamicLoadNCG(),
    'Factor de distribución longitudinal de presión kL': longitudinalPressureDistributionKL(),
    'Factor de reducción de presión de área kAR': areaPressureReductionKAR(),
    'Factor de reducción de la presión de los costados kZ': hullSidePressureReductionKZ()
  }]

  const platingData: PlatingData[] = [{
    Zona: zone,
    'Espesor mínimo para el Enchapado (mm)': tFinal,
    'Masa mínima de la Fibra Seca (kg/m^2)': wMin,
    'Masa mínima de la fibra exterior (kg/m^2)': 'N/A',
    'Masa mínima de la fibra interior (kg/m^2)': 'N/A',
    'Módulo de Sección mínimo del laminado exterior (cm^3/cm)': smOuter,
    'Módulo de Sección mínimo del laminado interior (cm^3/cm)': smInner,
    'Segundo momento de inercia mínimo (cm^4/cm)': secondI,
    'Presión de diseño para el Enchapado (MPa)': currentPressure
  }]

  const stiffenerData: StiffenerData[] = [{
    Zona: zone,
    'Módulo de Sección mínimo para Refuerzos (cm^3)': currentStiffener?.SM as number,
    'Área del Alma mínima para Refuerzos (cm^2)': currentStiffener?.AW as number,
    'Rigidez secundaria para Refuerzos FRP (cm^4)': (currentStiffener?.type === 'FrpSandwich' || currentStiffener?.type === 'SingleSkin') ? currentStiffener.I : 'N/A',
    'Presión de diseño para los Refuerzos (MPa)': currentPressure
  }]

  const handleExportToExcel = () => {
    context === 'Plating' && exportToExcel('Test', { generalData, platingData, pressureData })
    context === 'Stiffeners' && exportToExcel('Test', { generalData, stiffenerData, pressureData })
  }

  const handleOpenExcel = () => {
    // Specify the path to your Excel file in the public folder
    const excelFilePath = '/Base de datos perfiles.xlsx'

    // Open the Excel file in a new tab or window
    window.open(excelFilePath, '_blank')
  }

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

      <section className='grid lg:grid-cols-3 lg:justify-between justify-center lg:gap-4'>
        <div className='lg:col-span-2 flex-col flex justify-center items-center order-2'>
          <FormContainer handleSubmit={handleSubmit}>

            {
              context === 'Plating' && <PlatingForm />
            }

            {
              context === 'Stiffeners' && <StiffenersForm />
            }

            <ZoneFormContainer />

            <div className='flex gap-4 w-full col-span-2 flex-col sm:flex-row items-center'>
              <PrimaryButton handleClick={goBack} text='Ir Atras'/>
              <PrimaryButton handleClick={handleExportToExcel} text='Exportar Excel'/>
              <PrimaryButton handleClick={handleReset} text='Nuevo calculo'/>
              <PrimaryButton handleClick={handleOpenExcel} text='Base de datos'/>
            </div>

          </FormContainer>
        </div>

        <figure className='lg:col-span-1 flex flex-col gap-6 order-1 my-4 lg:mb-0 items-center'>
          <img className='border-2 rounded-lg bg-white p-3 border-[#9ac400] max-w-xs sm:max-w-sm w-full' src="/MER-4296-117-01-CUADERNA-MAESTRA-Model (1).png" alt="" />
          <img className='border-2 rounded-lg bg-white p-3 border-[#9ac400] max-w-xs sm:max-w-sm w-full' src="/MER-4296-130-01A-ESTRUCTURA-GENERAL-Model (1).png" alt="" />
        </figure>
      </section>

      <section className='mt-8'>
        <h3 className='font-semibold'>Resultados</h3>
        {renderZoneResults()}
      </section>

    </>

  )
}
