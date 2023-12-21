export type PLATING_MATERIALS = ['Acero', 'Aluminio', 'Madera (laminada y plywood)', 'Fibra laminada', 'Fibra con nucleo (Sandwich)']
export type CATEGORIA_EMBARCACION = ['Oceano', 'Offshore', 'Inshore', 'Aguas protegidas']
export type ZONES = ['Fondo', 'Costados y Espejo', 'Cubierta', 'Superestructura', 'Mamparos estancos', 'Mamparos de tanques integrales', 'Placas anti oleaje', 'Mamparos de colisión']
export type SKIN_TYPE = ['Fibra de vidrio E con filamentos cortados', 'Fibra de vidrio tejida', 'Fibra tejida de carbono, aramida(kevlar) o híbrida']
export type CORE_MATERIALS = ['Madera Balsa', 'Núcleo con elongación al corte en rotura < 35 % (PVC entrecruzado, etc.)', 'Núcleo con elongación al corte en rotura > 35 % (PVC lineal, SAN, etc.)', 'Núcleos tipo panal de abeja (compatibles con aplicaciones marinas)']
export type CONTEXT = ['Plating', 'Stiffeners']
export type PlatingType = 'SingleSkin' | 'Metal' | 'Wood' | 'FrpSandwich'

export interface SingleSkinPlating {
  type?: 'SingleSkin'
  tFinal?: number
  wMin?: number | {
    wos: number
    wis: number
    wMin: number
  }
}

export interface MetalPlating {
  type?: 'Metal'
  tFinal?: number
}

export interface WoodPlating {
  type?: 'Wood'
  tFinal?: number
}

export interface FrpSandwichPlating {
  type?: 'FrpSandwich'
  smInner?: number
  smOuter?: number
  secondI?: number
  thickness?: number
  wos?: number
  wis?: number
  wMin?: number | {
    wos: number
    wis: number
    wMin: number
  }
}

export type StiffenerType = 'SingleSkin' | 'Metal' | 'Wood' | 'FrpSandwich'

export interface SingleSkinStiffener {
  type?: 'SingleSkin'
  AW?: number
  SM?: number
  I?: number
}

export interface MetalStiffener {
  type?: 'Metal'
  AW?: number
  SM?: number
}

export interface WoodStiffener {
  type?: 'Wood'
  AW?: number
  SM?: number
}

export interface FrpSandwichStiffener {
  type?: 'FrpSandwich'
  AW?: number
  SM?: number
  I?: number
}

export type StiffenerResult =
  | SingleSkinStiffener
  | MetalStiffener
  | WoodStiffener
  | FrpSandwichStiffener

type PlatingResult = SingleSkinPlating | MetalPlating | WoodPlating | FrpSandwichPlating

export interface ScantlingsContextType {
  LH: number
  LWL: number
  BWL: number
  BC: number
  V: number
  mLDC: number
  B04: number
  sigmaU: number
  sigmaY: number
  sigmaUf: number
  sigmaUt: number
  sigmaUc: number
  tauU: number
  tau: number
  tauNu: number
  eio: number
  ei: number
  eo: number
  category: 'Oceano' | 'Offshore' | 'Inshore' | 'Aguas protegidas'
  material: string
  zone: string
  core: string
  b: number
  l: number
  lu: number
  s: number
  c: number
  cu: number
  xp: number
  xs: number
  type: 'Displacement' | 'Planning'
  skin: string
  skinExterior: string
  skinInterior: string
  z: number
  hp: number
  hs: number
  context: string
  hB: number
  x: number
  height: number
  base: number
  areaPerforation: number
  sigmaCt: number
  etc: number
  setEtc: (value: number) => void
  setSigmaCt: (value: number) => void
  setAreaPerforation: (value: number) => void
  setBase: (value: number) => void
  setHeight: (value: number) => void
  setX: (value: number) => void
  setHB: (value: number) => void
  setContext: (value: string) => void
  setCore: (value: string) => void
  setZ: (value: number) => void
  setHp: (value: number) => void
  setHs: (value: number) => void
  setSkin: (value: string) => void
  setSkinExterior: (value: string) => void
  setSkinInterior: (value: string) => void
  setType: (value: 'Displacement' | 'Planning') => void
  setXs: (value: number) => void
  setXp: (value: number) => void
  setLH: (value: number) => void
  setLWL: (value: number) => void
  setBWL: (value: number) => void
  setBC: (value: number) => void
  setV: (value: number) => void
  setmLDC: (value: number) => void
  setB04: (value: number) => void
  setSigmaU: (value: number) => void
  setSigmaY: (value: number) => void
  setSigmaUf: (value: number) => void
  setSigmaUt: (value: number) => void
  setSigmaUc: (value: number) => void
  setTauU: (value: number) => void
  setTau: (value: number) => void
  setTauNu: (value: number) => void
  setEio: (value: number) => void
  setEi: (value: number) => void
  setEo: (value: number) => void
  setCategory: (value: 'Oceano' | 'Offshore' | 'Inshore' | 'Aguas protegidas') => void
  setMaterial: (value: string) => void
  setZone: (value: string) => void
  setB: (value: number) => void
  setL: (value: number) => void
  setLu: (value: number) => void
  setS: (value: number) => void
  setC: (value: number) => void
  setCu: (value: number) => void
  handleChangeInput: (e: SyntheticEvent<HTMLInputElement>, setter: (value: number) => void) => void
  handleChangeSelect: (e: SyntheticEvent<HTMLSelectElement>, setter: (value: string) => void) => void
  handleChangeSelectCategory: (e: SyntheticEvent<HTMLSelectElement>, setterCategory: (value: 'Oceano' | 'Offshore' | 'Inshore' | 'Aguas protegidas') => void) => void
  resetStates: () => void
}

export interface PressureData {
  Zona: string
  'Factor de categoria kDC': number
  'Factor de carga dinámica nCG': number
  'Factor de distribución longitudinal de presión kL': number
  'Factor de reducción de presión de área kAR': number
  'Factor de reducción de la presión de los costados kZ': number
}

export interface PlatingData {
  Zona: string
  'Espesor mínimo para el Enchapado (mm)': 'N/A' | number | undefined
  'Masa mínima de la Fibra Seca (kg/m^2)': number | {
    wos: number
    wis: number
    wMin: number
  } | 'N/A' | undefined
  'Masa mínima de la fibra exterior (kg/m^2)': 'N/A' | number | undefined
  'Masa mínima de la fibra interior (kg/m^2)': 'N/A' | number | undefined
  'Módulo de Sección mínimo del laminado exterior (cm^3/cm)': 'N/A' | number | undefined
  'Módulo de Sección mínimo del laminado interior (cm^3/cm)': 'N/A' | number | undefined
  'Segundo momento de inercia mínimo (cm^4/cm)': 'N/A' | number | undefined
  'Presión de diseño para el Enchapado (MPa)': 'N/A' | number | undefined
}

export interface StiffenerData {
  Zona: string
  'Módulo de Sección mínimo para Refuerzos (cm^3)': number
  'Área del Alma mínima para Refuerzos (cm^2)': number
  'Rigidez secundaria para Refuerzos FRP (cm^4)': number | string | undefined
  'Presión de diseño para los Refuerzos (MPa)': number
}
