import { create } from "zustand";

type BankDetailProps = {
  accountHolder?: string;
  accountType?: string;
  accountNumber?: string;
  permanentaccountNumber?: string;
  bankName?: string;
  ifscCode?: string;
  userStreetAddress?: string;
  userFlat?: string;
  userCity?: string;
  userState?: string;
  userCountry?: string;
  userPostcode?: string;
};

interface BankDetailState {
  bankDetails: BankDetailProps | null;
  updateBankDetails: (data: Partial<BankDetailProps>) => void;
  deleteBankDetails: () => void;
}

export const useBankDetailsStore = create<BankDetailState>((set) => ({
  bankDetails: null,
  updateBankDetails: (data) =>
    set((state) => ({
      bankDetails: state.bankDetails
        ? { ...state.bankDetails, ...data }
        : { ...data },
    })),
  deleteBankDetails: () => set({ bankDetails: null }),
}));
