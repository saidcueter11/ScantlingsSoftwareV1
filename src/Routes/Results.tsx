import { useScantlingsContext } from '../Context/ScantlingsContext'
import { GoBackArrow } from '../components/GoBackArrow'
import { usePlating } from '../hooks/usePlating'

export const Results = () => {
  const { zone } = useScantlingsContext()
  const { bottomPlating } = usePlating()

  const isMetal = bottomPlating.type === 'Metal'
  const isSingleSkin = bottomPlating.type === 'SingleSkin'

  return (
    <>
      <GoBackArrow />
      <h1>Resultados</h1>
      {
        (zone === 'Fondo') && isMetal && <p>El espesor del fondo (Metal) es: {bottomPlating.tFinal}</p>
      }

      {
        (zone === 'Fondo' && isSingleSkin) &&
        <div>
          <p>El espesor del fondo (Fibra Laminada) es: </p>
          <p>{bottomPlating.tFinal}</p>
          <p>{bottomPlating.wMin as number}</p>
        </div>
      }
    </>
  )
}
