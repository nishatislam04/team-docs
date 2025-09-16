"use client";

import { create } from "zustand";

/**
 * This is the controller of drawer for creating project
 */
export const useProjectDrawerStore = create((set) => ({
  isDrawerOpen: false,

  setIsDrawerOpen: (open = true) => set({ isDrawerOpen: Boolean(open) }),

  setIsDrawerClose: () => set({ isDrawerOpen: false }),
}));
