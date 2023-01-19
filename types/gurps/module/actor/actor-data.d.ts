export {}

declare global {
  export type Attribute = {
    value: number
    max: number
    import: number
    points: number
  }

  export type GurpsActorData = {
    migrationversion: string | null
    attributes: Record<string, Attribute>
    HP: Attribute
    FP: Attribute
    basicspeed: Attribute
    basicmove: Attribute
    dodge: Attribute
    thrust: string
    swing: string
    basiclift: number
    vision: number
    hearing: number
    tastesmell: number
    touch: number
    frightcheck: number
    currentmove: number
    currentflight: number
    currentdodge: number
    equippedparry: number
    equippedblock: number
    equipment: {
      carried: {}
      other: {}
    }
    skills: object
    spells: object
    melee: object
    ads: object
    eqtsummary: object
    hitlocations: object
    encumbrance: Record<string, any>
    ranged: object
    notes: object
    conditions: {
      maneuver: string
    }
    additionalresources: {
      isTired: boolean
      isReeling: boolean
      showflightmove: boolean
      importpath: string
      importname: string
      importversion: string
      ignoreinputbodyplan: boolean
      bodyplan: string
    }
    lastImport: string
  }
}
