import { useScantlingsContext } from '../../Context/ScantlingsContext'
import { Input } from '../Input'
import { Label } from '../Label'

export const SingleSkinForm = () => {
  const { material, sigmaUf, setSigmaUf } = useScantlingsContext()
  return (
    <>
      <Label question={`Ingrese la resistencia ultima a la flexión de la ${material} `} htmlFor='sigmaUfSingleSK'/>
      <Input value={sigmaUf} setter={setSigmaUf} min={0} key={'sigmaUfSingleSK'} name='sigmaUfSingleSK'/>
    </>
  )
}
