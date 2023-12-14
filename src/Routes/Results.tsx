import { useEffect, useState } from 'react'
import { useScantlingsContext } from '../Context/ScantlingsContext'
import { PrimaryButton } from '../components/PrimaryButton'
import { usePlating } from '../hooks/usePlating'
import { type StiffenerResult, type PlatingResult } from '../types'
import { exportToExcel } from '../utils/exportToExcel'
import { useStiffener } from '../hooks/useStiffeners'
import { usePressures } from '../hooks/usePressures'
import { useNavigate } from 'react-router-dom'

interface PressureData {
  Zona: string
  'Factor de categoria kDC': number
  'Factor de carga dinámica nCG': number
  'Factor de distribución longitudinal de presión kL': number
  'Factor de reducción de presión de área kAR': number
  'Factor de reducción de la presión de los costados kZ': number
}

interface PlatingData {
  Zona: string
  'Espesor mínimo para el Enchapado (mm)': 'N/A' | number | undefined
  'Masa mínima de la Fibra Seca (kg/m^2)': number | {
    wos: number
    wis: number
    wMin: number
  } | 'N/A' | undefined
  'Masa mínima de la fibra exterior (kg/m^2)': 'N/A' | number | undefined
  'Masa mínima de la fibra interior (kg/m^2)': 'N/A' | number | undefined
  'Módulo de Sección mínimo del laminado exterior (cm^3/cm)': 'N/A' | number | undefined
  'Módulo de Sección mínimo del laminado interior (cm^3/cm)': 'N/A' | number | undefined
  'Segundo momento de inercia mínimo (cm^4/cm)': 'N/A' | number | undefined
  'Presión de diseño para el Enchapado (MPa)': 'N/A' | number | undefined
}

interface StiffenerData {
  Zona: string
  'Módulo de Sección mínimo para Refuerzos (cm^3)': number
  'Área del Alma mínima para Refuerzos (cm^2)': number
  'Rigidez secundaria para Refuerzos FRP (cm^4)': number | string | undefined
  'Presión de diseño para los Refuerzos (MPa)': number
}

export const Results = () => {
  const { zone, context, material, category, LH, LWL, BC, BWL, mLDC, V, B04, skinExterior, skinInterior, resetStates } = useScantlingsContext()

  const {
    bottomStiffener,
    sideTransomStiffener,
    deckStiffener,
    watertightBulkheadsStiffener,
    integralTankBulkheadsStiffener,
    washPlatesStiffener,
    collisionBulkheadsStiffener
  } = useStiffener()

  const navigate = useNavigate()

  const { designCategoryKDC, dynamicLoadNCG, longitudinalPressureDistributionKL, hullSidePressureReductionKZ, areaPressureReductionKAR } = usePressures()

  const goBack = () => { history.back() }
  const [exportingDataPressure, setExportingDataPressure] = useState<PressureData[]>([])
  const [exportingDataPlating, setExportingDataPlating] = useState<PlatingData[]>([])
  const [exportingDataStiffeners, setExportingDataStiffeners] = useState<StiffenerData[]>([])
  const [currentPlating] = useState<PlatingResult>({})
  const [currentStiffener] = useState<StiffenerResult>({})
  const [currentPressure] = useState(0)

  const handleReset = () => {
    resetStates()
    navigate('/')
  }

  useEffect(() => {
    const newDataPressure: PressureData = {
      Zona: zone,
      'Factor de categoria kDC': designCategoryKDC(),
      'Factor de carga dinámica nCG': dynamicLoadNCG(),
      'Factor de distribución longitudinal de presión kL': longitudinalPressureDistributionKL(),
      'Factor de reducción de presión de área kAR': areaPressureReductionKAR(),
      'Factor de reducción de la presión de los costados kZ': hullSidePressureReductionKZ()
    }

    const tFinal = (currentPlating?.type === 'Metal' || currentPlating?.type === 'SingleSkin' || currentPlating?.type === 'Wood') ? currentPlating?.tFinal : 'N/A'
    const wMin = currentPlating?.type === 'SingleSkin' ? currentPlating.wMin : 'N/A'
    const wos = currentPlating?.type === 'FrpSandwich' ? currentPlating.wos : 'N/A'
    const wis = currentPlating?.type === 'FrpSandwich' ? currentPlating.wis : 'N/A'
    const smOuter = currentPlating?.type === 'FrpSandwich' ? currentPlating.smOuter : 'N/A'
    const smInner = currentPlating?.type === 'FrpSandwich' ? currentPlating.smInner : 'N/A'
    const secondI = currentPlating?.type === 'FrpSandwich' ? currentPlating.secondI : 'N/A'

    const newPlatingData: PlatingData = {
      Zona: zone,
      'Espesor mínimo para el Enchapado (mm)': tFinal,
      'Masa mínima de la Fibra Seca (kg/m^2)': wMin,
      'Masa mínima de la fibra exterior (kg/m^2)': wos,
      'Masa mínima de la fibra interior (kg/m^2)': wis,
      'Módulo de Sección mínimo del laminado exterior (cm^3/cm)': smOuter,
      'Módulo de Sección mínimo del laminado interior (cm^3/cm)': smInner,
      'Segundo momento de inercia mínimo (cm^4/cm)': secondI,
      'Presión de diseño para el Enchapado (MPa)': currentPressure
    }

    const newStiffenerData: StiffenerData = {
      Zona: zone,
      'Módulo de Sección mínimo para Refuerzos (cm^3)': currentStiffener?.SM as number,
      'Área del Alma mínima para Refuerzos (cm^2)': currentStiffener?.AW as number,
      'Rigidez secundaria para Refuerzos FRP (cm^4)': (currentStiffener?.type === 'FrpSandwich' || currentStiffener?.type === 'SingleSkin') ? currentStiffener.I : 'N/A',
      'Presión de diseño para los Refuerzos (MPa)': currentPressure
    }

    setExportingDataPressure(prev => [...prev, newDataPressure])
    setExportingDataStiffeners(prev => [...prev, newStiffenerData])
    setExportingDataPlating(prev => [...prev, newPlatingData])
  }, [zone])

  const {
    bottomPlating,
    sideTransomPlating,
    deckPlating,
    watertightBulkheadsPlating,
    integralTankBulkheadsPlating,
    washPlatesPlating,
    collisionBulkheadsPlating
  } = usePlating()

  const GeneralData = [
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

  const handleExportToExcel = () => { exportToExcel('Test', { generalData: GeneralData, platingData: exportingDataPlating, pressureData: exportingDataPressure, stiffenerData: exportingDataStiffeners }) }

  const renderResults = ({ platingData, stiffenerData }: { platingData?: PlatingResult, stiffenerData?: StiffenerResult }) => {
    const flag = context === 'Plating' ? platingData : stiffenerData

    const isPlating = (data: PlatingResult | StiffenerResult): data is PlatingResult => {
      return context === 'Plating' && 'type' in data && data.type !== undefined
    }

    switch (flag?.type) {
      case 'Metal':
        if (isPlating(flag)) {
          return <p>El espesor (Metal) es: {flag.tFinal?.toFixed(3)}</p>
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
            <p>El espesor (Fibra Laminada) es: {flag.tFinal?.toFixed(3)}</p>
            <p>Minimo espesor requerido: {flag.wMin as number}</p>
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
            <p>El espesor (Sandwich de FRP) es: {flag.thickness?.toFixed(3)}</p>
            <p>Interior SM: {flag.smInner?.toFixed(3)}</p>
            <p>Exterior SM: {flag.smOuter?.toFixed(3)}</p>
            <p>Segundo momento de área I: {flag.secondI?.toFixed(3)}</p>
            <p>Minimo espesor requerido: {flag.wMin as number}</p>
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
          return <p>El espesor (Madera) es: {flag.tFinal?.toFixed(3)}</p>
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
      default:
        return <p>Seleccione una zona para ver los resultados.</p>
    }
  }

  return (
    <section className='lg:grid min-h-full max-w-xs sm:max-w-xl lg:max-w-4xl xl:max-w-none mt-5'>
      <h2 className='font-semibold tracking-wider text-lg text-center text-[#5c7f63]'>RESULTADOS</h2>
      <div className='text-center'>
        {renderZoneResults()}
      </div>

      <div className='flex gap-4'>
        <PrimaryButton text='Nuevo Calculo' handleClick={handleReset}/>
        <PrimaryButton text='Agregar Zona'/>
      </div>

      <div className='flex flex-col justify-center items-center'>
        <PrimaryButton handleClick={goBack} text='Ir Atras'/>
        <PrimaryButton handleClick={handleExportToExcel} text='Exportar a Excel'/>
      </div>
    </section>
  )
}
