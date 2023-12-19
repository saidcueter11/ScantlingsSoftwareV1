import { useScantlingsContext } from '../../Context/ScantlingsContext'
import { Input } from '../Input'
import { Label } from '../Label'

export const SkinSandwichForm = () => {
  const { sigmaUt, sigmaUc, setSigmaUc, setSigmaUt, eio, setEio, tauU, setTauU } = useScantlingsContext()

  return (
    <>
      <Label question="Ingrese el esfuerzo último a la tracción de la fibra externa:" htmlFor='sigmaUt' />
      <Input value={sigmaUt} setter={setSigmaUt} min={0} key={'sigmaUt'} name='sigmaUt' />

      <Label question="Ingrese el esfuerzo último a la compresión de la fibra interna:" htmlFor='sigmaUc' />
      <Input value={sigmaUc} setter={setSigmaUc} min={0} key={'sigmaUc'} name='sigmaUc' />

      <Label question="Ingrese el promedio de los módulos de Young de las caras interna y externa (MPa):" htmlFor='Eio' />
      <Input value={eio} setter={setEio} min={0} key={'Eio'} name='Eio' />

      <Label question="Ingrese el esfuerzo último al cortante del núcleo:" htmlFor='tauU' />
      <Input value={tauU} setter={setTauU} min={0} key={'tauU'} name='tauU' />
    </>
  )
}
