import { createContext, useContext } from 'react'

/** Shared bonus wallet: lets deep screens (checkout) read and spend the client's bonuses. */
export const BonusContext = createContext<{ balance: number; spend: (amount: number, label: string) => void }>({
  balance: 0,
  spend: () => {},
})

export const useBonus = () => useContext(BonusContext)
