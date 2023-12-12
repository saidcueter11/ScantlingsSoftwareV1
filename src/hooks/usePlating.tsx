import { useState, useEffect } from 'react'
import { useScantlingsContext } from '../Context/ScantlingsContext'
import { usePressures } from './usePressures'
import { type PlatingType, type PlatingResult } from '../types'

export const usePlating = () => {
  const {
    b, c, sigmaUf, sigmaU, sigmaY, sigmaUt, sigmaUc, eio, skinExterior, skinInterior, core, tauU, LH,
    material, V, mLDC, LWL, skin, l
  } = useScantlingsContext()

  const { designCategoryKDC, bottomPressure, deckPressure, sideTransomPressure, washPlatesPressure, watertightBulkheadsPressure, integralTankBulkheadsPressure, collisionBulkheadsPressure } = usePressures()

  const [bottomPlating, setBottomPlating] = useState<PlatingResult>({ type: 'FrpSandwich' })
  const [sideTransomPlating, setSideTransomPlating] = useState<PlatingResult>({})
  const [deckPlating, setDeckPlating] = useState<PlatingResult>({})
  // const [superstructuresDeckhousesPlating, setSuperstructuresDeckhousesPlating] = useState<PlatingResult>({})
  const [watertightBulkheadsPlating, setWatertightBulkheadsPlating] = useState<PlatingResult>({})
  const [integralTankBulkheadsPlating, setIntegralTankBulkheadsPlating] = useState<PlatingResult>({})
  const [washPlatesPlating, setWashPlatesPlating] = useState<PlatingResult>({})
  const [collisionBulkheadsPlating, setCollisionBulkheadsPlating] = useState<PlatingResult>({})

  useEffect(() => {
    setBottomPlating(calculateBottomPlating())
    setSideTransomPlating(calculateSideTransomPlating())
    setDeckPlating(calculateDeckPlating())
    // setSuperstructuresDeckhousesPlating(calculateSuperstructuresDeckhousesPlating())
    setWashPlatesPlating(calculateWashPlatesPlating())
    setWatertightBulkheadsPlating(calculateWatertightBulkheadsPlating())
    setIntegralTankBulkheadsPlating(calculateIntegralTankBulkheadsPlating())
    setCollisionBulkheadsPlating(calculateCollisionBulkheadsPlating())
  }, [b, c, sigmaUf, sigmaU, sigmaY, sigmaUt, sigmaUc, eio, skinExterior, skinInterior, core, tauU, LH,
    material, V, mLDC, LWL, skin, l, bottomPressure, deckPressure, sideTransomPressure, washPlatesPressure, watertightBulkheadsPressure, integralTankBulkheadsPressure, collisionBulkheadsPressure])

  function curvatureCorrectionKC (): number {
    const cb = c / b
    let kC: number

    if (cb <= 0.03) {
      kC = 1.0
    } else if (cb <= 0.18) {
      kC = 1.1 - (3.33 * c) / b
    } else { // cb > 0.18
      kC = 0.5
    }

    // Apply constraints that kC should not be less than 0.5 nor greater than 1.0
    kC = Math.max(Math.min(kC, 1.0), 0.5)
    return kC
  }

  // Plating equations based on different materials
  function frpSingleSkinPlating (k2: number, pressure: number): number {
    const sigmaD = 0.5 * sigmaUf
    const kC = curvatureCorrectionKC()
    const thickness = b * kC * Math.sqrt((pressure * k2) / (1000 * sigmaD))
    return thickness
  }

  function metalPlating (k2: number, pressure: number): number {
    const sigmaD = Math.min(0.6 * sigmaU, 0.9 * sigmaY)
    const kC = curvatureCorrectionKC()
    const thickness = b * kC * Math.sqrt((pressure * k2) / (1000 * sigmaD))
    return thickness
  }

  function woodPlating (k2: number, pressure: number): number {
    const sigmaD = 0.5 * sigmaUf
    const thickness = b * Math.sqrt((pressure * k2) / (1000 * sigmaD))
    return thickness
  }

  function frpSandwichPlating (ar: number, b: number, k2: number, k3: number, pressure: number) {
    const k1 = 0.017 // Bending deflection factor k1 for sandwich plating
    const sigmaDt = 0.5 * sigmaUt
    const sigmaDc = 0.5 * sigmaUc

    const smInner = Math.pow(b, 0.5) * Math.pow(curvatureCorrectionKC(), 0.5) * pressure * k2 / (6e5 * sigmaDt)
    const smOuter = Math.pow(b, 0.5) * Math.pow(curvatureCorrectionKC(), 0.5) * pressure * k2 / (6e5 * sigmaDc)
    let secondI = Math.pow(b, 3) * Math.pow(curvatureCorrectionKC(), 3) * pressure * k3 / (12e6 * k1 * eio)

    if (skinExterior !== skinInterior) {
      secondI = Math.pow(b, 3) * Math.pow(curvatureCorrectionKC(), 3) * pressure * k3 / (12e3 * k1) // EI
    }

    let tauD: number
    switch (core) {
      case 'Madera Balsa':
        tauD = tauU * 0.5
        break
      case 'Núcleo con elongación al corte en rotura < 35 % (PVC entrecruzado, etc.)':
        tauD = tauU * 0.55
        break
      case 'Núcleo con elongación al corte en rotura > 35 % (PVC lineal, SAN, etc.)':
        tauD = tauU * 0.65
        break
      default: // 'Núcleos tipo panal de abeja (compatibles con aplicaciones marinas)':
        tauD = tauU * 0.5
    }

    if (LH < 10) {
      tauD = Math.max(tauD, 0.25)
    } else if (LH <= 15) {
      tauD = Math.max(tauD, 0.25 + 0.03 * (LH - 10))
    } else {
      tauD = Math.max(tauD, 0.40)
    }

    const kSHC = ar < 2 ? 0.035 + 0.394 * ar - 0.09 * Math.pow(ar, 2) : 0.5
    const thickness = Math.pow(curvatureCorrectionKC(), 0.5) * ((kSHC * pressure * b) / (1000 * tauD))

    return { smInner, smOuter, secondI, thickness }
  }

  function minBottomThickness () {
    switch (material) {
      case 'Fibra laminada':
      case 'Fibra con nucleo (Sandwich)': {
        const k4 = 1.0
        const k5 = skin === 'Fibra de vidrio E con filamentos cortados'
          ? 1.0
          : skin === 'Fibra de vidrio tejida' ? 0.9 : 0.7 // Default for 'Fibra tejida de carbono, aramida(kevlar) o híbrida'
        const k6 = 1.0
        const wos = designCategoryKDC() * k4 * k5 * k6 * (0.1 * LWL + 0.15)
        const wis = 0.7 * wos
        const wMin = 0.43 * k5 * (1.5 + 0.03 * V + 0.15 * Math.pow(mLDC, 0.33))

        return material === 'Fibra con nucleo (Sandwich)' ? { wos, wis, wMin } : wMin
      }
      case 'Aluminio':
        return Math.sqrt(125 / sigmaY) * (1 + 0.02 * V + 0.1 * Math.pow(mLDC, 0.33))
      case 'Acero':
        return Math.sqrt(240 / sigmaY) * (1 + 0.015 * V + 0.08 * Math.pow(mLDC, 0.33))
      case 'Madera (laminada y plywood)':
        return Math.sqrt(30 / sigmaUf) * (3 + 0.05 * V + 0.3 * Math.pow(mLDC, 0.33))
      default:
        return 0 // Default case if material doesn't match any known types
    }
  }

  function minSideTransomThickness () {
    switch (material) {
      case 'Fibra laminada':
      case 'Fibra con nucleo (Sandwich)': {
        const k4 = 0.9
        const k5 = skin === 'Fibra de vidrio E con filamentos cortados'
          ? 1.0
          : skin === 'Fibra de vidrio tejida' ? 0.9 : 0.7 // Default for 'Fibra tejida de carbono, aramida(kevlar) o híbrida'
        const k6 = 1.0
        const wos = designCategoryKDC() * k4 * k5 * k6 * (0.1 * LWL + 0.15)
        const wis = 0.7 * wos
        const wMin = 0.43 * k5 * (1.5 + 0 * V + 0.15 * Math.pow(mLDC, 0.33))

        return material === 'Fibra con nucleo (Sandwich)' ? { wos, wis, wMin } : wMin
      }
      case 'Aluminio':
        return Math.sqrt(125 / sigmaY) * (1 + 0 * V + 0.1 * Math.pow(mLDC, 0.33))
      case 'Acero':
        return Math.sqrt(240 / sigmaY) * (1 + 0 * V + 0.08 * Math.pow(mLDC, 0.33))
      case 'Madera (laminada y plywood)':
        return Math.sqrt(30 / sigmaUf) * (3 + 0 * V + 0.3 * Math.pow(mLDC, 0.33))
      default:
        return 0 // Default case if material doesn't match any known types
    }
  }

  function minDeckThickness () {
    switch (material) {
      case 'Fibra laminada':
      case 'Fibra con nucleo (Sandwich)': {
        const k4 = 0.7
        const k5 = skin === 'Fibra de vidrio E con filamentos cortados'
          ? 1.0
          : skin === 'Fibra de vidrio tejida' ? 0.9 : 0.7 // Default for 'Fibra tejida de carbono, aramida(kevlar) o híbrida'
        const k6 = 1.0
        const wos = designCategoryKDC() * k4 * k5 * k6 * (0.1 * LWL + 0.15)
        const wis = 0.7 * wos
        const wMin = k5 * (1.45 + 0.14 * LWL)

        return material === 'Fibra con nucleo (Sandwich)' ? { wos, wis, wMin } : wMin
      }
      case 'Aluminio':
        return 1.35 + 0.06 * LWL
      case 'Acero':
        return 1.5 + 0.07 * LWL
      case 'Madera (laminada y plywood)':
        return 3.8 + 0.17 * LWL
      default:
        return 0 // Default case if material doesn't match any known types
    }
  }

  function calculateBottomPlating () {
    const ar = l / b
    const adjustB = Math.min(b, 330 * LH)
    return calculatePlating(bottomPressure, ar, adjustB, material, minBottomThickness)
  }

  function calculateSideTransomPlating () {
    const ar = l / b
    return calculatePlating(sideTransomPressure, ar, Math.min(b, 330 * LH), material, minSideTransomThickness)
  }

  function calculateDeckPlating () {
    const ar = l / b
    return calculatePlating(deckPressure, ar, Math.min(b, 330 * LH), material, minDeckThickness)
  }

  // function calculateSuperstructuresDeckhousesPlating () {
  //   const ar = l / b
  //   const k2 = Math.min(Math.max((0.271 * Math.pow(ar, 2) + 0.910 * ar - 0.554) / (Math.pow(ar, 2) - 0.313 * ar + 1.351), 0.308), 0.5)
  //   const pressure = pressures.superstructuresDeckhousesPressure

  //   switch (material) {
  //     case 'Fibra laminada': {
  //       const tFinal = frpSingleSkinPlating(k2, pressure)
  //       return { tFinal }
  //     }
  //     case 'Acero':
  //     case 'Aluminio': {
  //       const tFinal = metalPlating(k2, pressure)
  //       return { tFinal }
  //     }
  //     case 'Madera (laminada y plywood)': {
  //       const tFinal = woodPlating(k2, pressure)
  //       return { tFinal }
  //     }
  //     case 'Fibra con nucleo (Sandwich)': {
  //       const adjustB = Math.min(b, 330 * LH)
  //       const k3 = Math.min(Math.max((0.027 * Math.pow(ar, 2) - 0.029 * ar + 0.011) / (Math.pow(ar, 2) - 1.463 * ar + 1.108), 0.014), 0.028)
  //       const { smInner, smOuter, secondI, thickness } = frpSandwichPlating(ar, adjustB, k2, k3, pressure)
  //       return { thickness, smInner, smOuter, secondI }
  //     }
  //     default:
  //       return {} // Handle unknown materials
  //   }
  // }

  function calculateWatertightBulkheadsPlating () {
    const ar = l / b
    return calculatePlating(watertightBulkheadsPressure, ar, Math.min(b, 330 * LH), material)
  }

  function calculateIntegralTankBulkheadsPlating () {
    const ar = l / b
    return calculatePlating(integralTankBulkheadsPressure, ar, Math.min(b, 330 * LH), material)
  }

  function calculateWashPlatesPlating () {
    const ar = l / b
    return calculatePlating(washPlatesPressure, ar, Math.min(b, 330 * LH), material)
  }

  function calculateCollisionBulkheadsPlating () {
    const ar = l / b
    return calculatePlating(collisionBulkheadsPressure, ar, Math.min(b, 330 * LH), material)
  }

  function calculatePlating (
    pressure: number,
    ar: number,
    adjustB: number,
    material: string,
    minThicknessFunc?: () => number | { wos: number, wis: number, wMin: number }
  ): PlatingResult {
    const k2 = Math.min(Math.max((0.271 * Math.pow(ar, 2) + 0.910 * ar - 0.554) / (Math.pow(ar, 2) - 0.313 * ar + 1.351), 0.308), 0.5)
    let type: PlatingType
    let tFinal: number = 0
    let wMin: number = 0
    let k3: number
    let smInner: number = 0
    let smOuter: number = 0
    let secondI: number = 0
    let thickness: number = 0

    if (minThicknessFunc !== undefined) {
      const wMinResult = minThicknessFunc()
      if (typeof wMinResult === 'number') {
        wMin = wMinResult
      } else {
        wMin = wMinResult.wMin
      }
    }

    switch (material) {
      case 'Fibra laminada':
        tFinal = frpSingleSkinPlating(k2, pressure)
        type = 'SingleSkin'
        break
      case 'Acero':
      case 'Aluminio':
        tFinal = Math.max(metalPlating(k2, pressure), wMin)
        type = 'Metal'
        break
      case 'Madera (laminada y plywood)':
        tFinal = Math.max(woodPlating(k2, pressure), wMin)
        type = 'Wood'
        break
      case 'Fibra con nucleo (Sandwich)':
        k3 = Math.min(Math.max((0.027 * Math.pow(ar, 2) - 0.029 * ar + 0.011) / (Math.pow(ar, 2) - 1.463 * ar + 1.108), 0.014), 0.028);
        ({ smInner, smOuter, secondI, thickness } = frpSandwichPlating(ar, adjustB, k2, k3, pressure))
        type = 'FrpSandwich'
        break
      default:
        return {}
    }

    if (type === 'FrpSandwich') {
      return { thickness, smInner, smOuter, secondI, wMin, type }
    } else {
      return { tFinal, wMin, type }
    }
  }

  return {
    bottomPlating,
    sideTransomPlating,
    deckPlating,
    // superstructuresDeckhousesPlating,
    watertightBulkheadsPlating,
    integralTankBulkheadsPlating,
    washPlatesPlating,
    collisionBulkheadsPlating
  }
}
