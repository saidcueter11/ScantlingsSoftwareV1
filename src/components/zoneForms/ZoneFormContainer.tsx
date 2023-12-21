import { useScantlingsContext } from '../../Context/ScantlingsContext'
import { Input } from '../Input'
import { Label } from '../Label'
import { MetalForm } from '../materialForms/MetalForm'
import { SingleSkinForm } from '../materialForms/SingleSkinForm'
import { SkinSandwichForm } from '../materialForms/SkinSandwichForm'
import { WoodForm } from '../materialForms/WoodForm'

export const ZoneFormContainer = () => {
  const { material, zone, hB, setHB, setHeight, height, setBase, base } = useScantlingsContext()
  return (
    <>

      {
        material === 'Fibra laminada' && <SingleSkinForm />
      }

      {
        (material === 'Acero' || material === 'Aluminio') && <MetalForm />
      }

      {
        material === 'Madera (laminada y plywood)' && <WoodForm />
      }

      {
        material === 'Fibra con nucleo (Sandwich)' && <SkinSandwichForm />
      }

      {
        (zone === 'Mamparos estancos' || zone === 'Mamparos de tanques integrales' || zone === 'Placas anti oleaje' || zone === 'Mamparos de colisión') &&
          <>
            <Label question='Ingrese la altura de la columna de agua (en metros): ' htmlFor='hb'/>
            <Input min={0} name='hb' setter={setHB} value={hB}/>
          </>
      }

      {
        zone === 'Placas anti oleaje' &&
          <>
            <Label question='Ingrese la altura del mamparo de tanque integral: ' htmlFor='height'/>
            <Input min={0} name='height' setter={setHeight} value={height}/>

            <Label question='Ingrese la base del mamparo de tanque integral: ' htmlFor='base'/>
            <Input min={0} name='base' setter={setBase} value={base}/>
          </>
      }

    </>
  )
}
