export {}

declare global {
  type GURPS = {
    // Hack to remember the last Actor sheet that was accessed... for the Modifier Bucket to work
    LastActor: GurpsActor | null

    SetLastActor: (actor: GurpsActor, tokenDocument: Token) => void
    ClearLastActor: (actor: GurpsActor) => void

    MobileGurpsActorSheet_rendered: boolean
    MobileGurpsActorSheet_root: any | null

    /* -------------------------------------------- */
    /*  Foundry VTT Initialization                  */
    /* -------------------------------------------- */
    // Hooks.once('init', async function () {
    // rangeObject: typeof GURPSRan

    // TODO: removed these, this file is for declarations of the original gurps repo
    __remaped_functions: Record<string, Function> | undefined

    // remembers last acessed actor, but value is not used com modifier bucket
    LastAccessedActor: GurpsActor | null
  }
}
