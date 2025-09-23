"use client";

import { create } from "zustand";

/**
 * This is the controller of drawers for creating, editing project and deleting project
 */
export const useProjectDrawerStore = create((set) => ({
  isCreateDrawerOpen: false,

  isEditDrawerOpen: false,

  isDeleteDialogOpen: false,

  setIsCreateDrawerOpen: (open = true) => set({ isCreateDrawerOpen: Boolean(open) }),

  setIsCreateDrawerClose: (open = false) => set({ isCreateDrawerOpen: Boolean(open) }),

  setIsEditDrawerOpen: (open = true) => set({ isEditDrawerOpen: Boolean(open) }),

  setIsEditDrawerClose: (open = false) => set({ isEditDrawerOpen: Boolean(open) }),

  setIsDeleteDialogOpen: (open = true) => set({ isDeleteDialogOpen: Boolean(open) }),

  setIsDeleteDialogClose: (open = false) => set({ isDeleteDialogOpen: Boolean(open) }),
}));
