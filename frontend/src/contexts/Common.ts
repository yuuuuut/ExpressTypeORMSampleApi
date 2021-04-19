import { createContext, useContext } from 'react'

export function createContextType<T>(): readonly [
  () => T,
  React.Provider<T | undefined>
] {
  const ctx = createContext<T | undefined>(undefined)

  function useCtx() {
    const c = useContext(ctx)

    if (!c) throw new Error('must be inside a Provider with a value')

    return c
  }
  return [useCtx, ctx.Provider] as const
}
