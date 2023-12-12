import { useCallback } from 'react'
import { useScantlingsContext } from '../Context/ScantlingsContext'

export const useStiffener = () => {
  const { material } = useScantlingsContext()
  const kSA = 5.0

  const curvatureFactorForStiffenersKCS = useCallback((cu: number, lu: number): number => {
    const culu = cu / lu
    let kCS = culu <= 0.03 ? 1.0 : culu <= 0.18 ? 1.1 - 3.33 * culu : 0.5
    kCS = Math.max(Math.min(kCS, 1.0), 0.5)
    return kCS
  }, [])

  const webAreaAW = useCallback((pressure: number, s: number, lu: number, tau: number): number => {
    const taud = 0.5 * tau
    return ((kSA * pressure * s * lu) / taud) * 1e-6
  }, [])

  const minSectionModulusSM = (
    pressure: number,
    s: number,
    lu: number,
    cu: number,
    sigma: number
  ): number => {
    const kCS = curvatureFactorForStiffenersKCS(cu, lu)
    const sigmad = 0.5 * sigma

    const SM = (83.33 * kCS * pressure * s * lu ** 2) / sigmad * 1e-9
    return SM
  }

  const supplementaryStiffnessRequirementsForFRP = (
    pressure: number,
    s: number,
    lu: number,
    cu: number,
    Etc: number
  ): number => {
    const kCS = curvatureFactorForStiffenersKCS(cu, lu)

    const I = (26 * Math.pow(kCS, 1.5) * pressure * s * Math.pow(lu, 3)) / (0.05 * Etc) * 1e-11
    return I
  }

  const stiffeners = (
    s: number,
    lu: number,
    cu: number,
    tau: number,
    sigma: number,
    pressure: number
  ) => {
    if (material === 'Fibra laminada' || material === 'Fibra con nucleo (Sandwich)') {
      const AW = webAreaAW(pressure, s, lu, tau)
      const SM = minSectionModulusSM(pressure, s, lu, cu, sigma)
      const I = supplementaryStiffnessRequirementsForFRP(pressure, s, lu, cu, sigma)
      return { AW, SM, I }
    } else if (material === 'Acero' || material === 'Aluminio') {
      const AW = webAreaAW(pressure, s, lu, sigma)
      const SM = minSectionModulusSM(pressure, s, lu, cu, sigma)
      return { AW, SM }
    } else { // Assuming craft.material === 'Madera (laminada y plywood)'
      const AW = webAreaAW(pressure, s, lu, tau)
      const SM = minSectionModulusSM(pressure, s, lu, cu, sigma)
      return { AW, SM }
    }
  }

  return {
    stiffeners
  }
}
