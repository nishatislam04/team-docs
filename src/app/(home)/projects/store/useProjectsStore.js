import { create } from "zustand";

/**
 * Project Listings
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
      p.id === tempId ? { ...realProject, __optimistic: false } : p,
    );
    set({ projects: next });
  },

  /** Remove optimistic project (on failure) */
  revertOptimistic: (tempId) => {
    const next = get().projects.filter((p) => p.id !== tempId);
    set({ projects: next });
  },

  // ---- Optimistic Deletion Helpers ----
  /**
   * Start an optimistic deletion by removing the project immediately.
   * Returns context for potential revert/commit with the removed project and its original index.
   * @param {string} projectId
   * @returns {{ removed: Project, index: number } | null}
   */
  startDeleteOptimistic: (projectId) => {
    const list = get().projects;
    const index = list.findIndex((p) => p.id === projectId);
    if (index === -1) return null;
    const removed = list[index];
    const next = list.filter((p) => p.id !== projectId);
    set({ projects: next });
    return { removed, index };
  },

  /**
   * Commit optimistic deletion. No-op by default, but ensures the item stays removed.
   * @param {{ removed: Project, index: number } | null} ctx
   */
  commitDeleteOptimistic: (ctx) => {
    if (!ctx) return;
    const next = get().projects.filter((p) => p.id !== ctx.removed.id);
    set({ projects: next });
  },

  /**
   * Revert optimistic deletion by restoring the project at its original index.
   * @param {{ removed: Project, index: number } | null} ctx
   */
  revertDeleteOptimistic: (ctx) => {
    if (!ctx) return;
    const next = [...get().projects];
    const safeIndex = Math.max(0, Math.min(ctx.index, next.length));
    next.splice(safeIndex, 0, ctx.removed);
    set({ projects: next });
  },
}));
