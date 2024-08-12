import { create } from 'zustand' 

const useMenuStore = create((set) => ({
    mode: false,
    setMode: (data) => set((state) => ({ mode: data })),
    playerCount: false,
    setPlayerCount: (data)  => set((state) => ({ playerCount: data }))
}))

const useGridStore = create((set) => ({
  boxes: [],
  setBoxes: (data) => set((state) => ({ boxes: data })),
}));

const useEliminatedStore = create((set) => ({
  eliminated: [],
  setEliminated: (data) =>
    set((state) => ({ eliminated: [...state.eliminated, data] })),
}));


export { useMenuStore, useGridStore, useEliminatedStore }