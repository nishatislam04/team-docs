"use client";

import { create } from "zustand";

/**
 * This is the controller of selected project
 */
export const useSelectedProjectStore = create((set) => ({
  /**
   * The currently active project object containing project details.
   * @type {Object|null}
   */
  selectedProject: null,

  /**
   * Updates the current project object.
   * @param {Object} project - The project object to set
   */
  setSelectedProject: (project) => set({ selectedProject: project }),

  /**
   * Resets the selected project to null.
   */
  reset: () => set({ selectedProject: null }),
}));
