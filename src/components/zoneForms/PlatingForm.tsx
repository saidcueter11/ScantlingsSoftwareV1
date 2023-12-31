import { useScantlingsContext } from '../../Context/ScantlingsContext'
import { Input } from '../Input'
import { Label } from '../Label'

export const PlatingForm = () => {
  const { b, setB, l, setL, LH, x, setX, LWL, c, setC, zone, material, z, setZ, hp, setHp } = useScantlingsContext()
  return (
    <>
      <Label question='Ingrese la dimensión más corta o base del panel de la lamina "b" (mm): ' htmlFor='b'/>
      <Input value={b} setter={setB} min={0} key={'b'} name='b'/>

      <Label question='Digite el lado más largo del panel de la lamina "l" (mm): ' htmlFor='l'/>
      <Input value={l} setter={setL} min={b} key={'l'} name='l' max={330 * LH}/>

      {
        (zone === 'Fondo' || zone === 'Cubierta' || zone === 'Costados y Espejo') &&
          <>
            <Label question='Distancia desde popa hasta el centro del panel o refuerzo "x" (metros): ' htmlFor='x'/>
            <Input value={x} setter={setX} min={0} key={'x'} name='x' max={LWL}/>
          </>
      }

      {
        material !== 'Madera (laminada y plywood)' &&
          <>
            <Label question='Ingrese la corona o curvatura del panel "c" (mm): ' htmlFor='c'/>
            <Input value={c} setter={setC} min={0} key={'c'} name='c' max={LWL}/>
          </>
      }

      {
        zone === 'Costados y Espejo' &&
          <>
            <Label question='Ingrese la altura de la cubierta, medida desde la linea de flotación (metros): ' htmlFor='z'/>
            <Input value={z} setter={setZ} min={0} key={'z'} name='z'/>

            <Label question='Ingrese la altura del centro del panel por encima de la linea de flotación (metros): ' htmlFor='hp'/>
            <Input value={hp} setter={setHp} min={0} key={'hp'} name='hp'/>

          </>
      }

    </>
  )
}
