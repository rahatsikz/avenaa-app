import { create } from "zustand";

type StepType = string;
type UploadType = string;

interface VerifyFlowState {
  type: UploadType | null;
  step: StepType;
  setType: (type: UploadType) => void;
  setStep: (step: StepType) => void;
  reset: () => void;
}

export const useVerifyFlowStore = create<VerifyFlowState>((set) => ({
  type: null,
  step: "choose-id-type",

  setType: (type) => set({ type }),
  setStep: (step) => set({ step }),
  reset: () => set({ type: null, step: "choose-id-type" }),
}));
