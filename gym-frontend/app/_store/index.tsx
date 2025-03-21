import { createContext, useContext } from "react"
// import { makePersistable } from "mobx-persist-store"
import { makeAutoObservable } from "mobx"

class StoreValue {
	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
		// makePersistable(this, {})
	}
}

export const storeValue = new StoreValue()

const StoreContext = createContext<StoreValue>(storeValue)
interface StoreProps {
	children: React.ReactElement
}

export const Store = ({ children }: StoreProps) => {
	return <StoreContext.Provider value={storeValue}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
