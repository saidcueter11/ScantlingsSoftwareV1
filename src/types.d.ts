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
