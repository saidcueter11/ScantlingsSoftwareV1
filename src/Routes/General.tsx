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
    <main className='flex lg:gap-10 gap-4 flex-col lg:flex-row lg:mt-5'>
      <img src='/WhatsApp Image 2023-12-21 at 12.50.55 AM.jpeg' className='border-2 rounded-lg bg-white p-3 border-[#9ac400] max-h-[588px] w-full max-w-xl'/>
      <FormContainer handleSubmit={handleSubmit}>
        <Label question='Eslora del casco "LH" (metros): ' htmlFor='LH' title='Distancia entre dos planos, uno de ellos situado en la parte más a Proa de la embarcación y otro en la parte más a Popa.'/>
        <Input min={2.5} max={24} value={LH} setter={setLH} name='LH'/>

        <Label question='Eslora en linea de flotación "LWL" (metros): 'htmlFor='LWL' title='Longitud del eje longitudinal del plano de flotación considerado'/>
        <Input min={2.5} max={LH} value={LWL} setter={setLWL} name='LWL'/>

        <Label question='Manga en linea de flotación "BWL" (metros): ' htmlFor='BWL' title='Distancia transversal en el punto mas ancho de la linea de flotación'/>
        <Input min={0} value={BWL} setter={setBWL} name='BWL'/>

        <Label question='Manga entre pantoques o "chine" "BC" (metros): ' htmlFor='BC' title='Distancia transversal en el angulo de astilla muerta de fondo'/>
        <Input min={0} value={BC} setter={setBC} name='BC'/>

        <Label question='Velocidad maxima "V" (Nudos): ' htmlFor='V' title='Velocidad maxima de diseño de la embarcación'/>
        <Input min={2.36 * Math.sqrt(LWL)} value={V} setter={setV} name='V'/>

        <Label question='Desplazamiento "mLDC" (Kilogramos): ' htmlFor='mLDC' title='Masa de agua desplazada por la embarcación, cuando está completamente cargada y lista para su uso'/>
        <Input min={0} value={mLDC} setter={setmLDC} name='mLDC'/>

        <Label question={'Ángulo de astilla muerta "B04" en el LCG (°grados):'} htmlFor='B04' title={`Se mide a ${0.4 * LWL >= 0 ? (0.4 * LWL).toFixed(3) : 0} metros de la popa (°grados):`}/>
        <Input min={0} value={B04} setter={setB04} name='B04'/>

        <Label question='Categoria de diseño:' htmlFor='categoria'/>
        <Select array={CATEGORIA_EMBARCACION} setterCategory={setCategory} selectedValue={category}/>

        <Label question='Material general de la embarcación' htmlFor='material'/>
        <Select array={PLATING_MATERIALS} setter={setMaterial} selectedValue={material}/>

        {
          (isOpenSandwich || isOpenSingleSkin) &&
            <div className='col-span-2'>
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
            </div>
        }

        <Label question='Zona de escantillonado' htmlFor='zona'/>
        <Select array={ZONES} setter={setZone} selectedValue={zone}/>

        <Label question='Tipo de analisis' htmlFor='context'/>
        <Select array={CONTEXT} setter={setContext} selectedValue={context}/>

        <div className='col-start-1'>
          <PrimaryButton text='Aceptar'/>
        </div>
      </FormContainer>
    </main>
  )
}
