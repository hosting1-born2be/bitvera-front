"use client";

import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

export type FormsPopupType =
  | "market-research"
  | "property-consultation"
  | "request"
  | "custom-solution-request";

type FormsPopupStore = {
  popupType: FormsPopupType | null;
  requestName: string;
  openMarketResearch: () => void;
  openPropertyConsultation: () => void;
  openRequest: (name: string) => void;
  openCustomSolutionRequest: () => void;
  closePopup: () => void;
};

export const useFormsPopupStore = create<FormsPopupStore>((set) => ({
  popupType: null,
  requestName: "",

  openMarketResearch: () => set({ popupType: "market-research" }),

  openPropertyConsultation: () => set({ popupType: "property-consultation" }),

  openRequest: (name: string) => set({ requestName: name, popupType: "request" }),

  openCustomSolutionRequest: () =>
    set({ popupType: "custom-solution-request", requestName: "" }),

  closePopup: () => set({ popupType: null, requestName: "" }),
}));

/** Hook with only actions (for components that only open/close popups). */
export function useFormsPopup() {
  return useFormsPopupStore(
    useShallow((state) => ({
      openMarketResearch: state.openMarketResearch,
      openPropertyConsultation: state.openPropertyConsultation,
      openRequest: state.openRequest,
      openCustomSolutionRequest: state.openCustomSolutionRequest,
      closePopup: state.closePopup,
    }))
  );
}
