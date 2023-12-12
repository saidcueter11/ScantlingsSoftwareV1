import { useEffect, useState } from 'react'
import { useScantlingsContext } from '../Context/ScantlingsContext'
import { PrimaryButton } from '../components/PrimaryButton'
import { usePlating } from '../hooks/usePlating'
import { type PlatingResult } from '../types'
import { exportToExcel } from '../utils/exportToExcel'

interface ExportingDataItem {
  Zona: string
  'Espesor para el Enchapado (mm)': string
  'Módulo de Sección para Refuerzos (cm^3)': string
  'Área del Alma para Refuerzos (cm^2)': string
  'Rigidez secundaria para Refuerzos FRP (cm^4)': string
  'Presión para el Enchapado (MPa)': string
  'Presión para los Refuerzos (MPa)': string
}

export const Results = () => {
  const { zone } = useScantlingsContext()
  const goBack = () => { history.back() }
  const [exportingData, setExportingData] = useState<ExportingDataItem[]>([])

  useEffect(() => {
    const newData = {
      Zona: zone,
      'Espesor para el Enchapado (mm)': 'X',
      'Módulo de Sección para Refuerzos (cm^3)': 'X',
      'Área del Alma para Refuerzos (cm^2)': 'X',
      'Rigidez secundaria para Refuerzos FRP (cm^4)': 'X',
      'Presión para el Enchapado (MPa)': 'X',
      'Presión para los Refuerzos (MPa)': 'X'
    }
    setExportingData(prev => [...prev, newData])
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
    { 'Datos Generales y Dimensiones de la Embarcación': 'Categoria', Valor: 'X' },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Material', Valor: 'X' },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Tipo de Fibra', Valor: 'X' },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Fibra Exterior', Valor: 'X' },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Fibra Interna', Valor: 'X' },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Nucleo', Valor: 'X' },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Eslora del casco "LH" (metros)', Valor: 'X' },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Eslora en la linea de flotación "LWL" (metros)', Valor: 'X' },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Manga en la linea de flotación "BWL" (metros)', Valor: 'X' },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Manga entre pantoques o "chine" "BC" (metros)', Valor: 'X' },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Velocidad max de diseño "V" (nudos)', Valor: 'X' },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Desplazamiento "mLDC" (Toneladas)', Valor: 'X' },
    { 'Datos Generales y Dimensiones de la Embarcación': 'Angulo de astilla muerta en LCG "B04" (grados)', Valor: 'X' }
  ]

  const handleExportToExcel = () => { exportToExcel('Test', GeneralData, exportingData) }

  const renderPlatingResults = (platingData: PlatingResult) => {
    switch (platingData.type) {
      case 'Metal':
        return <p>El espesor (Metal) es: {platingData.tFinal?.toFixed(3)}</p>
      case 'SingleSkin':
        return (
          <div>
            <p>El espesor (Fibra Laminada) es: {platingData.tFinal?.toFixed(3)}</p>
            <p>Minimo espesor requerido: {platingData.wMin as number}</p>
          </div>
        )
      case 'FrpSandwich':
        return (
          <div>
            <p>El espesor (Sandwich de FRP) es: {platingData.thickness?.toFixed(3)}</p>
            <p>Interior SM: {platingData.smInner?.toFixed(3)}</p>
            <p>Exterior SM: {platingData.smOuter?.toFixed(3)}</p>
            <p>Segundo momento de área I: {platingData.secondI?.toFixed(3)}</p>
            <p>Minimo espesor requerido: {platingData.wMin as number}</p>
          </div>
        )
      case 'Wood':
        return <p>El espesor (Madera) es: {platingData.tFinal?.toFixed(3)}</p>
      default:
        return <p>No hay datos disponibles para este material.</p>
    }
  }

  const renderZoneResults = () => {
    switch (zone) {
      case 'Fondo':
        return (
          <>
            {renderPlatingResults(bottomPlating)}
          </>
        )
      case 'Costado y Trasom':
        return (
          <>
            {renderPlatingResults(sideTransomPlating)}
          </>
        )
      case 'Cubierta':
        return (
          <>
            {renderPlatingResults(deckPlating)}
          </>
        )
      case 'Mamparos Estancos':
        return (
          <>
            {renderPlatingResults(watertightBulkheadsPlating)}
          </>
        )
      case 'Mamparos de Tanques Integrales':
        return (
          <>
            {renderPlatingResults(integralTankBulkheadsPlating)}
          </>
        )
      case 'Placas de Lavado':
        return (
          <>
            {renderPlatingResults(washPlatesPlating)}
          </>
        )
      case 'Mamparos de Colisión':
        return (
          <>
            {renderPlatingResults(collisionBulkheadsPlating)}
          </>
        )
      default:
        return <p>Seleccione una zona para ver los resultados.</p>
    }
  }

  return (
    <section className='lg:grid lg:grid-cols-2 min-h-full max-w-xs sm:max-w-xl lg:max-w-4xl xl:max-w-none mt-5'>
      <h2 className='font-semibold tracking-wider text-lg text-center text-[#5c7f63]'>RESULTADOS</h2>
      <div className='text-center'>
        {renderZoneResults()}
      </div>

      <div className='flex gap-4'>
        <PrimaryButton text='Nuevo Calculo'/>
        <PrimaryButton text='Agregar Calculo'/>
      </div>

      <div className='flex flex-col justify-center items-center'>
        <PrimaryButton handleClick={goBack} text='Ir Atras'/>
        <PrimaryButton handleClick={handleExportToExcel} text='Exportar a Excel'/>
      </div>
    </section>
  )
}
