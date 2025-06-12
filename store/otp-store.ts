import { create } from "zustand";

type OtpState = {
  mobile: string | null;
  setMobile: (mobile: string | null) => void;
};

export const useOTPStore = create<OtpState>((set) => ({
  mobile: null,
  setMobile: (mobile) => set({ mobile }),
}));
