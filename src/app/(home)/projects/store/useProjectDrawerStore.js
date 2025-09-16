"use client";

import { create } from "zustand";

/**
 * This is the controller of drawer
 */
export const useProjectDrawerStore = create((set) => ({
  isDrawerOpen: false,

  setIsDrawerOpen: () => set({ isDrawerOpen: true }),

  setIsDrawerClose: () => set({ isDrawerOpen: false }),
}));
