"use client";

import { create } from "zustand";

/**
 * This is the controller of drawer for creating, editing project
 */
export const useProjectDrawerStore = create((set) => ({
  /**
   * Boolean flag indicating whether the create project drawer is currently open.
   * @type {boolean}
   */
  isCreateDrawerOpen: false,

  /**
   * Boolean flag indicating whether the edit project drawer is currently open.
   * @type {boolean}
   */
  isEditDrawerOpen: false,

  /**
   * Sets the create project drawer's open state.
   * If the drawer is open, it will close, and if it's closed, it will open.
   */
  setIsCreateDrawerOpen: (open = true) => set({ isCreateDrawerOpen: Boolean(open) }),

  /**
   * Closes the create project drawer.
   */
  setIsCreateDrawerClose: () => set({ isCreateDrawerOpen: false }),

  /**
   * Sets the edit project drawer's open state.
   * If the drawer is open, it will close, and if it's closed, it will open.
   */
  setIsEditDrawerOpen: (open = true) => set({ isEditDrawerOpen: Boolean(open) }),

  /**
   * Closes the edit project drawer.
   */
  setIsEditDrawerClose: () => set({ isEditDrawerOpen: false }),
}));
