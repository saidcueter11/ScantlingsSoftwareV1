import { useScantlingsContext } from '../../Context/ScantlingsContext'
import { MetalForm } from '../materialForms/MetalForm'
import { SingleSkinForm } from '../materialForms/SingleSkinForm'
import { SkinSandwichForm } from '../materialForms/SkinSandwichForm'
import { WoodForm } from '../materialForms/WoodForm'

export const ZoneFormContainer = () => {
  const { material } = useScantlingsContext()
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

    </>
  )
}
