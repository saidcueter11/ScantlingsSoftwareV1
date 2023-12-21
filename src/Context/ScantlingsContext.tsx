import { createContext, useContext, type ReactNode, type SyntheticEvent, useState } from 'react'
import { type ScantlingsContextType } from '../types'

export const ScantlingsContext = createContext<ScantlingsContextType | undefined>(undefined)

interface MyContextProviderProps {
  children: ReactNode
}

export function ScantlingsContextProvider ({ children }: MyContextProviderProps) {
  const [LH, setLH] = useState(0)
  const [LWL, setLWL] = useState(0)
  const [BWL, setBWL] = useState(0)
  const [BC, setBC] = useState(0)
  const [V, setV] = useState(0)
  const [mLDC, setmLDC] = useState(0)
  const [B04, setB04] = useState(0)
  const [sigmaU, setSigmaU] = useState(0)
  const [sigmaY, setSigmaY] = useState(sigmaU)
  const [sigmaUf, setSigmaUf] = useState(0)
  const [sigmaUt, setSigmaUt] = useState(0)
  const [sigmaUc, setSigmaUc] = useState(0)
  const [tauU, setTauU] = useState(0)
  const [tau, setTau] = useState(0)
  const [tauNu, setTauNu] = useState(0)
  const [eio, setEio] = useState(0)
  const [ei, setEi] = useState(0)
  const [eo, setEo] = useState(0)
  const [b, setB] = useState(0)
  const [l, setL] = useState(0)
  const [lu, setLu] = useState(0)
  const [s, setS] = useState(0)
  const [c, setC] = useState(0)
  const [cu, setCu] = useState(0)
  const [xp, setXp] = useState(LWL)
  const [xs, setXs] = useState(LWL)
  const [z, setZ] = useState(0)
  const [hp, setHp] = useState(0)
  const [hs, setHs] = useState(0)
  const [hB, setHB] = useState(0)
  const [x, setX] = useState(0)
  const [etc, setEtc] = useState(0)
  const [sigmaCt, setSigmaCt] = useState(0)
  const [base, setBase] = useState(0)
  const [height, setHeight] = useState(0)
  const [areaPerforation, setAreaPerforation] = useState(0)
  const [skin, setSkin] = useState('Fibra de vidrio E con filamentos cortados')
  const [skinExterior, setSkinExterior] = useState('Fibra de vidrio E con filamentos cortados')
  const [skinInterior, setSkinInterior] = useState('Fibra de vidrio E con filamentos cortados')
  const [category, setCategory] = useState<'Oceano' | 'Offshore' | 'Inshore' | 'Aguas protegidas'>('Oceano')
  const [material, setMaterial] = useState('Acero')
  const [core, setCore] = useState('Madera Balsa')
  const [zone, setZone] = useState('Fondo')
  const [type, setType] = useState<'Displacement' | 'Planning'>('Planning')
  const [context, setContext] = useState('Plating')

  const resetStates = () => {
    setLH(0)
    setLWL(0)
    setBWL(0)
    setBC(0)
    setV(0)
    setmLDC(0)
    setB04(0)
    setSigmaU(0)
    setSigmaY(sigmaU)
    setSigmaUf(0)
    setSigmaUt(0)
    setSigmaUc(0)
    setTauU(0)
    setTauNu(0)
    setEio(0)
    setEi(0)
    setEo(0)
    setB(0)
    setL(0)
    setLu(0)
    setS(0)
    setC(0)
    setCu(0)
    setXp(LWL)
    setXs(LWL)
    setZ(0)
    setHp(0)
    setHs(0)
    setSkin('Fibra de vidrio E con filamentos cortados')
    setCategory('Oceano')
    setMaterial('Acero')
    setZone('Fondo')
    setType('Planning')
  }

  const handleChangeInput = (e: SyntheticEvent<HTMLInputElement>, setter: (value: number) => void) => {
    const value = e.currentTarget.value as unknown
    if (/^\d*\.?\d*$/.test(value as string)) {
      setter(value as number)
    }
  }

  const handleChangeSelect = (e: SyntheticEvent<HTMLSelectElement>, setter: (value: string) => void) => {
    const { value } = e.currentTarget
    setter(value)
  }

  const handleChangeSelectCategory = (
    e: SyntheticEvent<HTMLSelectElement>,
    setterCategory: (value: 'Oceano' | 'Offshore' | 'Inshore' | 'Aguas protegidas') => void
  ) => {
    const { value } = e.currentTarget
    setterCategory(value as 'Oceano' | 'Offshore' | 'Inshore' | 'Aguas protegidas')
  }

  const contextValue: ScantlingsContextType = {
    core,
    skin,
    skinExterior,
    skinInterior,
    LH,
    LWL,
    BWL,
    BC,
    V,
    mLDC,
    B04,
    category,
    material,
    zone,
    sigmaU,
    sigmaY,
    sigmaUf,
    sigmaUt,
    sigmaUc,
    tauU,
    tau,
    tauNu,
    eio,
    ei,
    eo,
    b,
    l,
    lu,
    s,
    c,
    cu,
    xp,
    xs,
    type,
    z,
    hp,
    hs,
    hB,
    context,
    x,
    height,
    base,
    areaPerforation,
    sigmaCt,
    etc,
    setEtc,
    setSigmaCt,
    setAreaPerforation,
    setBase,
    setHeight,
    setX,
    setHB,
    setContext,
    setSkinExterior,
    setSkinInterior,
    setCore,
    setHp,
    setHs,
    setZ,
    setSkin,
    setType,
    setXp,
    setXs,
    setLH,
    setLWL,
    setBWL,
    setBC,
    setV,
    setmLDC,
    setB04,
    setSigmaU,
    setSigmaY,
    setSigmaUf,
    setSigmaUt,
    setSigmaUc,
    setTauU,
    setTau,
    setTauNu,
    setEio,
    setEi,
    setEo,
    setCategory,
    setMaterial,
    setZone,
    setB,
    setL,
    setLu,
    setS,
    setC,
    setCu,
    handleChangeInput,
    handleChangeSelect,
    handleChangeSelectCategory,
    resetStates
  }

  return <ScantlingsContext.Provider value={contextValue}>{children}</ScantlingsContext.Provider>
}
export function useScantlingsContext () {
  const context = useContext(ScantlingsContext)
  if (context === undefined) {
    throw new Error('useMyContext must be used within a MyContextProvider')
  }
  return context
}
