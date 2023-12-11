import { useScantlingsContext } from '../../Context/ScantlingsContext'
import { Input } from '../Input'
import { Label } from '../Label'

export const WoodForm = () => {
  const { material, sigmaUf, setSigmaUf } = useScantlingsContext()
  return (
    <>
      <Label question={`Ingrese la resistencia ultima a la flexión de la ${material} paralela al lado corto del panel: `} htmlFor='sigmaUf'/>
      <Input value={sigmaUf} setter={setSigmaUf} min={0} key={'sigmaUf'} name='sigmaUf'/>
    </>
  )
}
