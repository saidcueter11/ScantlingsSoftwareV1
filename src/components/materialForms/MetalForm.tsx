import { useScantlingsContext } from '../../Context/ScantlingsContext'
import { Input } from '../Input'
import { Label } from '../Label'

export const MetalForm = () => {
  const { material, setSigmaU, sigmaU, setSigmaY, sigmaY } = useScantlingsContext()
  return (
    <>
      <Label question={`Ingrese el esfuerzo último a la tracción del ${material}: `} htmlFor='sigmaU'/>
      <Input value={sigmaU} setter={setSigmaU} min={0} key={'sigmaU'} name='sigmaU'/>

      <Label question={`Ingrese el esfuerzo de fluencia a la tracción del ${material}: `} htmlFor='sigmaY'/>
      <Input value={sigmaY} setter={setSigmaY} min={0} key={'sigmaY'} name='sigmaY'/>
    </>
  )
}
