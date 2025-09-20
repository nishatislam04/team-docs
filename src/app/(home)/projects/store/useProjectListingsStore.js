"use client";

import { create } from "zustand";

export const ProjectListingsStore = create((set) => ({
  projects: {
    data: [],
    pageSize: 10,
    sortBy: "name",
    sortOrder: "asc",
    totalItems: 0,
    totalPages: 0,
  },

  // set projects
  setProjects: (projects) => set({ projects }),

  // add new project
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),

  // remove project
  removeProject: (projectId) =>
    set((state) => ({ projects: state.projects.filter((project) => project.id !== projectId) })),

  // update project
  updateProject: (projectId, updatedProject) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId ? updatedProject : project
      ),
    })),

  // clear projects
  clearProjects: () => set({ projects: [] }),
}));
