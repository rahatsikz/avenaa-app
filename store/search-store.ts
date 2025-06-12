import { create } from "zustand";

export type Range = { start: Date | null; end: Date | null };

type SearchState = {
  range: Range;
  setRange: (r: Range) => void;

  adults: number;
  setAdults: (n: number) => void;

  children: number;
  setChildren: (n: number) => void;

  rooms: number;
  setRooms: (n: number) => void;

  destination: string;
  setDestination: (d: string) => void;

  searchEnable: boolean;
  setSearchEnable: (b: boolean) => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  range: { start: null, end: null },
  setRange: (range) => set({ range }),

  adults: 2,
  setAdults: (adults) => set({ adults }),

  children: 0,
  setChildren: (children) => set({ children }),

  rooms: 1,
  setRooms: (rooms) => set({ rooms }),

  destination: "",
  setDestination: (destination) => set({ destination }),

  searchEnable: true,
  setSearchEnable: (searchEnable) => set({ searchEnable }),
}));
