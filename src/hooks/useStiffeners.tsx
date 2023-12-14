import { useCallback, useEffect, useState } from 'react'
import { useScantlingsContext } from '../Context/ScantlingsContext'
import { usePressures } from './usePressures'
import { type StiffenerType, type StiffenerResult } from '../types'

export const useStiffener = () => {
  const {
    b, c, sigmaUf, sigmaU, sigmaY, sigmaUt, sigmaUc, eio, skinExterior, skinInterior, core, tauU, LH,
    material, V, mLDC, LWL, skin, l, cu, lu, s, tau, sigmaCt, etc
  } = useScantlingsContext()

  const { bottomPressure, deckPressure, sideTransomPressure, washPlatesPressure, watertightBulkheadsPressure, integralTankBulkheadsPressure, collisionBulkheadsPressure, superstructuresDeckhousesPressure } = usePressures()
  const kSA = 5.0

  const initialStiffenerState: StiffenerResult = {}

  const [bottomStiffener, setBottomStiffener] = useState<StiffenerResult>(initialStiffenerState)
  const [sideTransomStiffener, setSideTransomStiffener] = useState<StiffenerResult>(initialStiffenerState)
  const [deckStiffener, setDeckStiffener] = useState<StiffenerResult>(initialStiffenerState)
  const [superstructuresDeckhousesStiffener, setSuperstructuresDeckhousesStiffener] = useState<StiffenerResult>(initialStiffenerState)
  const [watertightBulkheadsStiffener, setWatertightBulkheadsStiffener] = useState<StiffenerResult>(initialStiffenerState)
  const [integralTankBulkheadsStiffener, setIntegralTankBulkheadsStiffener] = useState<StiffenerResult>(initialStiffenerState)
  const [washPlatesStiffener, setWashPlatesStiffener] = useState<StiffenerResult>(initialStiffenerState)
  const [collisionBulkheadsStiffener, setCollisionBulkheadsStiffener] = useState<StiffenerResult>(initialStiffenerState)
  const [sigma, setSigma] = useState(0)

  useEffect(() => {
    setBottomStiffener(calculateBottomStiffener())
    setSideTransomStiffener(calculateSideTransomStiffener())
    setDeckStiffener(calculateDeckStiffener())
    setSuperstructuresDeckhousesStiffener(calculateSuperstructuresDeckhousesStiffener())
    setWashPlatesStiffener(calculateWashPlatesStiffener())
    setWatertightBulkheadsStiffener(calculateWatertightBulkheadsStiffener())
    setIntegralTankBulkheadsStiffener(calculateIntegralTankBulkheadsStiffener())
    setCollisionBulkheadsStiffener(calculateCollisionBulkheadsStiffener())
    getSigmaByMaterial()
  }, [b, c, sigmaUf, sigmaU, sigmaY, sigmaUt, sigmaUc, eio, skinExterior, skinInterior, core, tauU, LH,
    material, V, mLDC, LWL, skin, l, bottomPressure, deckPressure, sideTransomPressure, washPlatesPressure, watertightBulkheadsPressure, integralTankBulkheadsPressure, collisionBulkheadsPressure, sigmaCt, superstructuresDeckhousesPressure])

  const getSigmaByMaterial = () => {
    switch (material) {
      case 'Acero':
      case 'Aluminio':
        setSigma(sigmaY)
        break
      case 'Fibra laminada':
        setSigma(sigmaCt)
        break
      case 'Fibra con nucleo (Sandwich)':
        setSigma(sigmaCt)
        break

      case 'Madera (laminada y plywood)':
        setSigma(sigmaUf)
        break

      default:
        return <p>No hay datos disponibles para este material.</p>
    }
  }

  function calculateBottomStiffener () {
    return calculateStiffeners(sigma, bottomPressure)
  }

  function calculateSideTransomStiffener () {
    return calculateStiffeners(sigma, sideTransomPressure)
  }

  function calculateDeckStiffener () {
    return calculateStiffeners(sigma, deckPressure)
  }

  function calculateSuperstructuresDeckhousesStiffener () {
    return calculateStiffeners(sigma, superstructuresDeckhousesPressure)
  }

  function calculateWatertightBulkheadsStiffener () {
    return calculateStiffeners(sigma, watertightBulkheadsPressure)
  }

  function calculateIntegralTankBulkheadsStiffener () {
    return calculateStiffeners(sigma, integralTankBulkheadsPressure)
  }

  function calculateWashPlatesStiffener () {
    return calculateStiffeners(sigma, washPlatesPressure)
  }

  function calculateCollisionBulkheadsStiffener () {
    return calculateStiffeners(sigma, collisionBulkheadsPressure)
  }

  const curvatureFactorForStiffenersKCS = useCallback((): number => {
    const culu = cu / lu
    let kCS = culu <= 0.03 ? 1.0 : culu <= 0.18 ? 1.1 - 3.33 * culu : 0.5
    kCS = Math.max(Math.min(kCS, 1.0), 0.5)
    return kCS
  }, [])

  const webAreaAW = useCallback((pressure: number, tauD: number): number => {
    return ((kSA * pressure * s * lu) / tauD) * 1e-6
  }, [])

  const minSectionModulusSM = (pressure: number, sigmaD: number): number => {
    const kCS = curvatureFactorForStiffenersKCS()

    const SM = (83.33 * kCS * pressure * s * lu ** 2) / sigmaD * 1e-9
    return SM
  }

  const supplementaryStiffnessRequirementsForFRP = (pressure: number): number => {
    const kCS = curvatureFactorForStiffenersKCS()

    const I = (26 * Math.pow(kCS, 1.5) * pressure * s * Math.pow(lu, 3)) / (0.05 * etc) * 1e-11
    return I
  }

  const calculateStiffeners = (sigma: number, pressure: number): StiffenerResult => {
    let type: StiffenerType
    if (material === 'Fibra laminada' || material === 'Fibra con nucleo (Sandwich)') {
      type = material === 'Fibra laminada' ? 'SingleSkin' : 'FrpSandwich'
      const sigmaD = 0.5 * sigma
      const tauD = 0.5 * tau
      const AW = webAreaAW(pressure, tauD)
      const SM = minSectionModulusSM(pressure, sigmaD)
      const I = supplementaryStiffnessRequirementsForFRP(pressure)
      return { AW, SM, I, type }
    } else if (material === 'Acero' || material === 'Aluminio') {
      type = 'Metal'
      const sigmaD = material === 'Acero' ? 0.8 * sigma : 0.7 * sigma
      const tauD = material === 'Acero' ? 0.45 * sigma : 0.4 * sigma
      const AW = webAreaAW(pressure, tauD)
      const SM = minSectionModulusSM(pressure, sigmaD)
      return { AW, SM, type }
    } else { // Assuming craft.material === 'Madera (laminada y plywood)'
      type = 'Wood'
      const sigmaD = 0.4 * sigma
      const tauD = 0.4 * tau
      const AW = webAreaAW(pressure, tauD)
      const SM = minSectionModulusSM(pressure, sigmaD)
      return { AW, SM, type }
    }
  }

  return {
    bottomStiffener,
    sideTransomStiffener,
    deckStiffener,
    superstructuresDeckhousesStiffener,
    watertightBulkheadsStiffener,
    integralTankBulkheadsStiffener,
    washPlatesStiffener,
    collisionBulkheadsStiffener
  }
}
