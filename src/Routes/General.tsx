import { Label } from '../components/Label'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { useState, type SyntheticEvent, useEffect } from 'react'
import { CATEGORIA_EMBARCACION, CONTEXT, CORE_MATERIALS, PLATING_MATERIALS, SKIN_TYPE, ZONES } from '../constants'
import { useScantlingsContext } from '../Context/ScantlingsContext'
import { useNavigate } from 'react-router-dom'
import { CollapsibleRow } from '../components/CollapsibleContainer'
import { FormContainer } from '../components/FormContainer'
import { PrimaryButton } from '../components/PrimaryButton'

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
    category,
    skin,
    skinExterior,
    skinInterior,
    context,
    core,
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

  const [isOpenSingleSkin, setIsOpenSingleSkin] = useState(false)
  const [isOpenSandwich, setIsOpenSandwich] = useState(false)

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setType(V / Math.sqrt(LWL) < 5 ? 'Displacement' : 'Planning')
    setmLDC(mLDC * 1000)
    navigate(`zone/${zone}`)
  }

  useEffect(() => {
    if (material === 'Fibra laminada') {
      setIsOpenSandwich(false)
      setIsOpenSingleSkin(true)
    } else if (material === 'Fibra con nucleo (Sandwich)') {
      setIsOpenSingleSkin(false)
      setIsOpenSandwich(true)
    } else {
      setIsOpenSingleSkin(false)
      setIsOpenSandwich(false)
    }
  }, [material])

  return (
    <>
      <FormContainer handleSubmit={handleSubmit}>
        <Label question='Eslora del casco "LH" (metros): ' htmlFor='LH'/>
        <Input min={2.5} max={24} value={LH} setter={setLH} name='LH'/>

        <Label question='Eslora en linea de flotación "LWL" (metros): 'htmlFor='LWL'/>
        <Input min={2.5} max={LH} value={LWL} setter={setLWL} name='LWL'/>

        <Label question='Manga en linea de flotación "BWL" (metros): ' htmlFor='BWL'/>
        <Input min={0} value={BWL} setter={setBWL} name='BWL'/>

        <Label question='Manga entre pantoques o "chine" "BC" (metros): ' htmlFor='BC'/>
        <Input min={0} value={BC} setter={setBC} name='BC'/>

        <Label question='Velocidad maxima "V" (Nudos): ' htmlFor='V'/>
        <Input min={2.36 * Math.sqrt(LWL)} value={V} setter={setV} name='V'/>

        <Label question='Desplazamiento "mLDC" (Toneladas): ' htmlFor='mLDC'/>
        <Input min={0} value={mLDC} setter={setmLDC} name='mLDC'/>

        <Label question={`Ángulo de astilla muerta "B04" en el LCG, o a ${0.4 * LWL >= 0 ? (0.4 * LWL).toFixed(3) : 0} metros de la popa (°grados):`} htmlFor='B04'/>
        <Input min={0} value={B04} setter={setB04} name='B04'/>

        <Label question='Categoria de diseño:' htmlFor='categoria'/>
        <Select array={CATEGORIA_EMBARCACION} setterCategory={setCategory} selectedValue={category}/>

        <Label question='Material general de la embarcación' htmlFor='material'/>
        <Select array={PLATING_MATERIALS} setter={setMaterial} selectedValue={material}/>

        <CollapsibleRow title='' isOpen={isOpenSingleSkin}>

          <Label question='Tipo de fibra de diseño' htmlFor='skin'/>
          <Select array={SKIN_TYPE} setter={setSkin} selectedValue={skin}/>

        </CollapsibleRow>

        <CollapsibleRow title='' isOpen={isOpenSandwich}>

            <Label question='Tipo de fibra exterior' htmlFor='skinExterior'/>
            <Select array={SKIN_TYPE} setter={setSkinExterior} selectedValue={skinExterior}/>

            <Label question='Tipo de fibra interior' htmlFor='skinInterior'/>
            <Select array={SKIN_TYPE} setter={setSkinInterior} selectedValue={skinInterior}/>

            <Label question='Tipo de nucleo del sandwich' htmlFor='core'/>
            <Select array={CORE_MATERIALS} setter={setCore} selectedValue={core}/>

        </CollapsibleRow>

        <Label question='Zona de escantillonado' htmlFor='zona'/>
        <Select array={ZONES} setter={setZone} selectedValue={zone}/>

        <Label question='Tipo de analisis' htmlFor='context'/>
        <Select array={CONTEXT} setter={setContext} selectedValue={context}/>

        <div>
          <PrimaryButton text='Aceptar'/>
        </div>
      </FormContainer>
    </>
  )
}
