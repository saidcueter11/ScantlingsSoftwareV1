import { useScantlingsContext } from '../../Context/ScantlingsContext'
import { Input } from '../Input'
import { Label } from '../Label'

export const StiffenersForm = () => {
  const { s, lu, setLu, cu, setCu, x, setX, setS, LWL, material, tau, setTau, sigmaCt, setSigmaCt, etc, setEtc, sigmaUf, setSigmaUf, zone, z, hs, setZ, setHs } = useScantlingsContext()
  return (
    <>
      <Label question="Ingrese la separación entre refuerzos 's' (mm): " htmlFor="s"/>
      <Input min={0} name="s" setter={setS} key={'s'} value={s}/>

      <Label question="Ingrese la longitud no soportada de los refuerzos 'lu' (mm): " htmlFor="lu"/>
      <Input min={0} name="lu" setter={setLu} key={'lu'} value={lu}/>

      <Label question="Ingrese la corona o curvatura si el refuerzo es curvo 'cu': " htmlFor="cu"/>
      <Input min={0} name="cu" setter={setCu} key={'cu'} value={cu}/>

      <Label question="Distancia desde popa hasta el centro del panel o refuerzo 'x' (metros): " htmlFor="x"/>
      <Input min={0} name="x" setter={setX} key={'x'} value={x} max={LWL}/>

      {
        (material === 'Fibra laminada' || material === 'Fibra con nucleo (Sandwich)') &&
          <>

            <Label question={`Ingrese el promedio del módulo de compresión y de tensión de la ${material} para el refuerzo: `} htmlFor="etc"/>
            <Input min={0} name="etc" setter={setEtc} key={'etc'} value={etc}/>

            <Label question={`Ingrese la resistencia última mínima al cortante de la ${material} para el refuerzo: `} htmlFor="tau"/>
            <Input min={0} name="tau" setter={setTau} key={'tau'} value={tau}/>

            <Label question={`Ingrese esfuerzo último (compresión o tracción) de la ${material} según el tipo de carga presente en el refuerzo: `} htmlFor="sigmaCt"/>
            <Input min={0} name="sigmaCt" setter={setSigmaCt} key={'sigmaCt'} value={sigmaCt}/>

          </>
      }

      {
        material === 'Madera (laminada y plywood)' &&
          <>
            <Label question={`Ingrese la resistencia última mínima al cortante de la ${material} para el refuerzo: `} htmlFor="tau"/>
            <Input min={0} name="tau" setter={setTau} key={'tau'} value={tau}/>

            <Label question={`Ingrese la esfuerzo último a la flexión de la ${material} para el refuerzo: `} htmlFor="sigmaUf"/>
            <Input min={0} name="sigmaUf" setter={setSigmaUf} key={'sigmaUf'} value={sigmaUf}/>
          </>

      }

{
        zone === 'Costados y Espejo' &&
          <>
            <Label question='Ingrese la altura de la cubierta, medida desde la linea de flotación (metros): ' htmlFor='z'/>
            <Input value={z} setter={setZ} min={0} key={'z'} name='z'/>

            <Label question='Ingrese la altura del centro del refuerzo por encima de la linea de flotación (metros): ' htmlFor='hs'/>
            <Input value={hs} setter={setHs} min={0} key={'hs'} name='hs'/>

          </>
      }
    </>
  )
}
