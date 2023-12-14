import { useEffect, useState } from 'react'
import { useScantlingsContext } from '../Context/ScantlingsContext'

export const usePressures = () => {
  const { mLDC, LWL, BC, category, V, B04, context, material, z, l, s, lu, b, hB, x, hp, hs, height, base, areaPerforation } = useScantlingsContext()

  const [PBMDBASE, setPBMDBASE] = useState<number>(0)
  const [PBMPBASE, setPBMPBASE] = useState<number>(0)
  const [PBMMIN, setPBMMIN] = useState<number>(0)
  const [PSMMIN, setPSMMIN] = useState<number>(0)
  const [PDMBASE, setPDMBASE] = useState<number>(0)
  const PDMMIN = 5

  const [bottomPressure, setBottomPressure] = useState<number>(0)
  const [sideTransomPressure, setSideTransomPressure] = useState<number>(0)
  const [deckPressure, setDeckPressure] = useState<number>(0)
  const [superstructuresDeckhousesPressure, setSuperstructuresDeckhousesPressure] = useState(0)
  const [watertightBulkheadsPressure, setWatertightBulkheadsPressure] = useState<number>(0)
  const [integralTankBulkheadsPressure, setIntegralTankBulkheadsPressure] = useState<number>(0)
  const [washPlatesPressure, setWashPlatesPressure] = useState<number>(0)
  const [collisionBulkheadsPressure, setCollisionBulkheadsPressure] = useState<number>(0)

  useEffect(() => {
    setBottomPressure(calculateBottomPressure())
    setSideTransomPressure(calculateSideTransomPressure())
    setDeckPressure(calculateDeckPressure())
    setSuperstructuresDeckhousesPressure(calculateSuperstructuresDeckhousesPressure())
    setWatertightBulkheadsPressure(calculateWatertightBulkheadsPressure())
    setIntegralTankBulkheadsPressure(calculateIntegralTankBulkheadsPressure())
    setWashPlatesPressure(calculateWashPlatesPressure())
    setCollisionBulkheadsPressure(calculateCollisionBulkheadsPressure())

    const newPBMDBASE = 2.4 * Math.pow(mLDC, 0.33) + 20
    setPBMDBASE(newPBMDBASE)

    const newPBMPBASE = (0.1 * mLDC) / (LWL * BC) * ((1 + designCategoryKDC() ** 0.5) * dynamicLoadNCG())
    setPBMPBASE(newPBMPBASE)

    const newPBMMIN = 0.45 * Math.pow(mLDC, 0.33) + (0.9 * LWL * designCategoryKDC())
    setPBMMIN(newPBMMIN)

    const newPSMMIN = 0.9 * LWL * designCategoryKDC()
    setPSMMIN(newPSMMIN)

    const newPDMBASE = 0.35 * LWL + 14.6
    setPDMBASE(newPDMBASE)
  }, [mLDC, LWL, BC, category, V, B04, context, material, z, l, s, lu, b, hB, x, hp, hs, height, base, areaPerforation])

  function designCategoryKDC () {
    let kDC = 0
    if (category === 'Oceano') { kDC = 1 } else if (category === 'Offshore') { kDC = 0.8 } else if (category === 'Inshore') { kDC = 0.6 } else { kDC = 0.4 }
    return kDC
  }

  function dynamicLoadNCG () {
    let nCG = 0
    // Primero calculamos nCG usando la ecuación (1)
    const nCG1 = 0.32 * ((LWL / (10 * BC)) + 0.084) * (50 - B04) * ((V ** 2 * BC ** 2) / mLDC)
    // Luego calculamos nCG usando la ecuación (2)
    const nCG2 = (0.5 * V) / (mLDC ** 0.17)
    // Si nCG1 es mayor que 3, usamos el menor entre nCG1 y nCG2
    if (nCG1 > 3) { nCG = Math.min(nCG1, nCG2) } else { nCG = nCG1 } // # Si nCG_1 es menor o igual a 3, lo usamos directamente
    // Nos aseguramos de que nCG no sea mayor que 7
    nCG = Math.min(nCG, 7)
    // Si nCG es mayor que 7, imprimimos una advertencia
    return nCG
  }

  function longitudinalPressureDistributionKL (): number {
    const xLWL = x / LWL
    let kL: number

    if (xLWL > 0.6) {
      kL = 1
    } else {
      const nCGClamped = Math.min(Math.max(dynamicLoadNCG(), 3), 6)
      kL = ((1 - 0.167 * nCGClamped) * xLWL / 0.6) + (0.167 * nCGClamped)
    }

    return kL
  }

  function areaPressureReductionKAR (): number {
    let AD: number
    if (context === 'Plating') {
      AD = Math.min((l * b) * 1e-6, 2.5 * Math.pow(b, 2) * 1e-6)
    } else { // 'Stiffeners'
      AD = Math.max((lu * s) * 1e-6, 0.33 * Math.pow(lu, 2) * 1e-6)
    }

    let kR = context === 'Plating' ? 1.5 - 3e-4 * b : 1 - 2e-4 * lu
    kR = Math.max(kR, 1.0)

    let kAR = (kR * 0.1 * Math.pow(mLDC, 0.15)) / Math.pow(AD, 0.3)
    kAR = Math.min(kAR, 1) // kAR should not be greater than 1

    const minKAR = material === 'Fibra con nucleo (Sandwich)' ? 0.4 : 0.25
    kAR = Math.max(minKAR, kAR)

    return kAR
  }

  function hullSidePressureReductionKZ () {
    if (context === 'Plating') return (z - hp) / z
    if (context === 'Stiffeners') return (z - hs) / z
    return 0
  }

  function calculateBottomPressure (): number {
    const kAR = areaPressureReductionKAR()
    const kL = longitudinalPressureDistributionKL()
    const kDC = designCategoryKDC()

    const PBMD = Math.max(PBMMIN, PBMDBASE * kAR * kDC * kL)
    const PBMP = Math.max(PBMMIN, PBMPBASE * kAR * kDC * kL)

    return Math.max(PBMD, PBMP)
  }

  function calculateSideTransomPressure (): number {
    const kZ = hullSidePressureReductionKZ()
    const kAR = areaPressureReductionKAR()
    const kL = longitudinalPressureDistributionKL()
    const kDC = designCategoryKDC()

    const PSMD = Math.max(PSMMIN, (PDMBASE + kZ * (PBMDBASE - PDMBASE)) * kAR * kDC * kL)
    const PSMP = Math.max(PSMMIN, (PDMBASE + kZ * (0.25 * PBMPBASE - PDMBASE)) * kAR * kDC * kL)

    return Math.max(PSMD, PSMP)
  }

  function calculateDeckPressure () {
    const kAR = areaPressureReductionKAR()
    const kDC = designCategoryKDC()
    const kL = longitudinalPressureDistributionKL()
    const PDM_BASE = 0.35 * LWL + 14.6
    const PDM_MIN = 5
    let PDM = PDM_BASE * kAR * kDC * kL
    PDM = Math.max(PDM_MIN, PDM)
    return PDM
  }

  function calculateSuperstructuresDeckhousesPressure () {
    const kAR = areaPressureReductionKAR()
    const kDC = designCategoryKDC()
    const kSUP = 1

    // Calculate and return a dictionary with the design pressures for each possible location
    const PSUPM = Math.max(PDMBASE * kDC * kAR * kSUP, PDMMIN)

    return PSUPM
  }

  function calculateWatertightBulkheadsPressure (): number {
    return 7 * hB
  }

  function calculateIntegralTankBulkheadsPressure (): number {
    return 10 * hB
  }

  function calculateWashPlatesPressure (): number {
    const areaTankBulkhead = height * base
    const factorReduccion = (areaTankBulkhead - areaPerforation) / areaTankBulkhead
    return 10 * hB * factorReduccion
  }

  function calculateCollisionBulkheadsPressure (): number {
    return 10 * hB
  }

  function structuralBulkheadsPressure (): string {
    return 'Verificar norma ISO 12215-5, inciso 8.3.5 & 11.8'
  }

  function transmissionPillarLoadsPressure (): string {
    return 'Verificar norma ISO 12215-5, inciso 8.3.6'
  }

  return {
    designCategoryKDC,
    dynamicLoadNCG,
    longitudinalPressureDistributionKL,
    areaPressureReductionKAR,
    hullSidePressureReductionKZ,
    bottomPressure,
    sideTransomPressure,
    deckPressure,
    superstructuresDeckhousesPressure,
    watertightBulkheadsPressure,
    integralTankBulkheadsPressure,
    washPlatesPressure,
    collisionBulkheadsPressure,
    structuralBulkheadsPressure,
    transmissionPillarLoadsPressure
  }
}
