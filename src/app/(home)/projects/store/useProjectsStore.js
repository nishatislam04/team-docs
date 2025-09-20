import { create } from "zustand";

/**
 * Project entity shape used in UI
 * @typedef {Object} Project
 * @property {string} id - Stable id from DB or temporary id starting with "temp-"
 * @property {string} name
 * @property {string} slug
 * @property {string} description
 * @property {boolean} [__optimistic] - Marks item as optimistic
 */

/**
 * Zustand store for projects with optimistic helpers.
 * Co-located near the projects route per team rules.
 */
export const useProjectsStore = create((set, get) => ({
  projects: /** @type {Project[]} */ ([]),

  /** Initialize/replace full list (e.g., server data) */
  setProjects: (list) => set({ projects: list || [] }),

  /** Add a new optimistic project and return its temp id */
  addOptimistic: (partial) => {
    const tempId = `temp-${typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10)}`;
    const tempProject = {
      id: tempId,
      name: partial?.name ?? "",
      slug: partial?.slug ?? "",
      description: partial?.description ?? "",
      __optimistic: true,
    };
    set({ projects: [tempProject, ...get().projects] });
    return tempProject;
  },

  /** Replace optimistic temp project with real project */
  commitOptimistic: (tempId, realProject) => {
    const next = get().projects.map((p) =>
      p.id === tempId ? { ...realProject, __optimistic: false } : p
    );
    set({ projects: next });
  },

  /** Remove optimistic project (on failure) */
  revertOptimistic: (tempId) => {
    const next = get().projects.filter((p) => p.id !== tempId);
    set({ projects: next });
  },

  /** Upsert (non-optimistic) helper */
  upsert: (project) => {
    const exists = get().projects.some((p) => p.id === project.id);
    if (exists) {
      set({ projects: get().projects.map((p) => (p.id === project.id ? project : p)) });
    } else {
      set({ projects: [project, ...get().projects] });
    }
  },
}));
