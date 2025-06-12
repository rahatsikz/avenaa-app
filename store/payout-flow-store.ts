import { create } from "zustand";

type StepType = string;

interface PayoutFlowState {
  step: StepType;
  setStep: (step: StepType) => void;
  reset: () => void;
}

export const usePayoutFlowStore = create<PayoutFlowState>((set) => ({
  step: "payment-dashboard",

  setStep: (step) => set({ step }),
  reset: () => set({ step: "payment-dashboard" }),
}));
