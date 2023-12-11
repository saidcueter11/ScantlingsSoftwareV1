import { Label } from '../components/Label'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { useState, type SyntheticEvent, useEffect } from 'react'
import { CATEGORIA_EMBARCACION, CONTEXT, CORE_MATERIALS, PLATING_MATERIALS, SKIN_TYPE, ZONES } from '../constants'
import { useScantlingsContext } from '../Context/ScantlingsContext'
import { useNavigate } from 'react-router-dom'
import { CollapsibleRow } from '../components/CollapsibleContainer'
import { FormContainer } from '../components/FormContainer'

export const GeneralPage = () => {
  const {
    LH,
    LWL,
    BWL,
    BC,
    V,
    mLDC,
    B04,
    zone,
    material,
    setSkinExterior,
    setSkinInterior,
    setCore,
    setLH,
    setBWL,
    setBC,
    setLWL,
    setB04,
    setV,
    setmLDC,
    setCategory,
    setMaterial,
    setZone,
    setType,
    setSkin,
    setContext
  } = useScantlingsContext()

  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setType(V / Math.sqrt(LWL) < 5 ? 'Displacement' : 'Planning')
    setmLDC(mLDC * 1000)
    navigate(`zone/${zone}`)
  }

  useEffect(() => {
    if (material === 'Fibra laminada' || material === 'Fibra con nucleo (Sandwich)') setIsOpen(true)
    else setIsOpen(false)
  }, [material])

  return (
    <>
      <FormContainer handleSubmit={handleSubmit}>
        <Label question="Ingrese la eslora maxima 'LH' de su embarcación (metros):" htmlFor='LH'/>
        <Input min={2.5} max={24} value={LH} setter={setLH} name='LH'/>

        <Label question="Ingrese la eslora de la linea de flotación o eslora de escantillón 'LWL' (metros):" htmlFor='LWL'/>
        <Input min={2.5} max={LH} value={LWL} setter={setLWL} name='LWL'/>

        <Label question="Ingrese la manga de la linea de flotación 'BWL' (metros): " htmlFor='BWL'/>
        <Input min={0} value={BWL} setter={setBWL} name='BWL'/>

        <Label question="Ingrese la manga del lomo o 'chine' 'BC' (metros): " htmlFor='BC'/>
        <Input min={0} value={BC} setter={setBC} name='BC'/>

        <Label question="Ingrese la velocidad maxima de diseño 'V' de la embarcación (Nudos): " htmlFor='V'/>
        <Input min={2.36 * Math.sqrt(LWL)} value={V} setter={setV} name='V'/>

        <Label question="Ingrese el desplazamiento de la embarcación 'mLDC' (Toneladas): " htmlFor='mLDC'/>
        <Input min={0} value={mLDC} setter={setmLDC} name='mLDC'/>

        <Label question={`Ingrese el ángulo de astilla muerta 'B04' en el LCG, o a ${0.4 * LWL >= 0 ? (0.4 * LWL).toFixed(3) : 0} metros de la popa (°grados):`} htmlFor='B04'/>
        <Input min={0} value={B04} setter={setB04} name='B04'/>

        <Label question="Seleccione la categoria para el diseño de su embarcación:" htmlFor='categoria'/>
        <Select array={CATEGORIA_EMBARCACION} setterCategory={setCategory}/>

        <Label question="Seleccione el material para el escantillonado de su embarcación" htmlFor='material'/>
        <Select array={PLATING_MATERIALS} setter={setMaterial}/>

        <CollapsibleRow title='' isOpen={isOpen}>
          {
            material === 'Fibra laminada' &&
              <>
                <Label question="Seleccione el tipo de fibra de diseño" htmlFor='skin'/>
                <Select array={SKIN_TYPE} setter={setSkin}/>
              </>
          }

          {
            material === 'Fibra con nucleo (Sandwich)' &&
              <>
                <Label question="Seleccione el tipo de fibra de diseño de la fibra *exterior*" htmlFor='skinExterior'/>
                <Select array={SKIN_TYPE} setter={setSkinExterior}/>

                <Label question="Seleccione el tipo de fibra de diseño de la fibra *interior*" htmlFor='skinInterior'/>
                <Select array={SKIN_TYPE} setter={setSkinInterior}/>

                <Label question="Seleccione el tipo de nucleo del sandwich" htmlFor='core'/>
                <Select array={CORE_MATERIALS} setter={setCore}/>
              </>
          }
        </CollapsibleRow>

        <Label question="Seleccione la zona donde desea realizar los calculos" htmlFor='zona'/>
        <Select array={ZONES} setter={setZone}/>

        <Label question='Seleccione el tipo escantillonado a calcular' htmlFor='context'/>
        <Select array={CONTEXT} setter={setContext}/>

        <button className={'bg-slate-600 rounded-lg p-3 mt-5 text-slate-50 transition-opacity col-span-2 w-44 justify-self-center hover:opacity-75'}>Siguiente</button>
      </FormContainer>
    </>
  )
}
