"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { makeAutoObservable, runInAction } from "mobx"
import BookingStore from "./modules/bookingStore"
import { Skeleton } from "antd"

class StoreValue {
	BookingStore = new BookingStore()
	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}

const StoreContext = createContext<StoreValue | null>(null)

interface StoreProps {
	children: React.ReactElement
}

export const Store = ({ children }: StoreProps) => {
	const [store, setStore] = useState<StoreValue | null>(null)

	useEffect(() => {
		// 确保只在客户端初始化
		const initStore = () => {
			const newStore = new StoreValue()
			runInAction(() => {
				setStore(newStore)
			})
		}

		if (typeof window !== "undefined") {
			initStore()
		}
	}, [])

	if (!store) return <Skeleton />

	return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export const useStore = () => {
	const store = useContext(StoreContext)
	if (!store) throw new Error("Store 必须在 Provider 内使用")
	return store
}
