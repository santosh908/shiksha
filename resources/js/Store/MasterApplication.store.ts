import config from '@/helpers/config'
import { create } from 'zustand'


interface MasterState {
    appTitle: string
    setAppTitle: (title: string) => void
}

const useMasterApplicationStore = create<MasterState>((set) => ({
    appTitle: config.applicationTitle,
    setAppTitle: (title: string) => set({ appTitle: title })
}))

export default useMasterApplicationStore