"use client";

import TablePagination from "@/components/shared/TablePagination";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { use, useEffect } from "react";
import { useProjectsStore } from "../store/useProjectsStore";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import ProjectAssignButton from "./sub/ProjectAssignButton.client";
import ProjectEditButton from "./sub/ProjectEditButton.client";
import ProjectTableSort from "./sub/ProjectTableSort.client";
import ProjectViewButton from "./sub/ProjectViewButton.client";

const ProjectTable = ({ projectsPromise }) => {
  const serverProjects = use(projectsPromise);

  const { setProjects } = useProjectsStore();
  const projects = useProjectsStore((s) => s.projects);

  // Initialize/refresh store with server list when promise resolves
  useEffect(() => {
    if (serverProjects?.data) {
      setProjects(serverProjects.data);
    }
  }, [serverProjects, setProjects]);

  return (
    <>
      <section className="mt-8 space-y-4">
        <div className="bg-background relative overflow-auto rounded-2xl border shadow-lg">
          <Table className="overflow-scroll">
            <TableHeader className="bg-muted sticky top-0 z-10">
              <TableRow className="text-lg font-semibold tracking-wide">
                <ProjectTableSort columnName="name" />
                <TableHead className="w-[300px] px-6 py-4">Description</TableHead>
                <TableHead className="w-[320px] px-6 py-4 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {projects.map((project, idx) => (
                <TableRow
                  key={`${project?.id ?? project?.slug ?? project?.name ?? "row"}-${idx}`}
                  className={`${project.__optimistic ? "border-l-4 border-amber-300/70" : ""} hover:bg-muted transition-colors duration-200`}
                >
                  <TableCell className="px-6 py-5 text-base font-semibold">
                    <div className="flex items-center gap-2">
                      <span>{project.name}</span>
                      {project.__optimistic && (
                        <Badge
                          variant="secondary"
                          className="inline-flex h-5 items-center gap-1 rounded-full border border-amber-200 bg-amber-100 px-2 py-0 text-[10px] text-amber-700"
                        >
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Creating
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate overflow-hidden px-6 py-5 text-base whitespace-nowrap">
                    {project.description || (
                      <span className="text-sm text-gray-400 italic">No description</span>
                    )}
                  </TableCell>

                  <TableCell className="flex items-center justify-center gap-3 px-6 py-5">
                    <ProjectViewButton project={project} disabled={project.__optimistic} />
                    <ProjectEditButton project={project} disabled={project.__optimistic} />
                    <ProjectAssignButton project={project} disabled={project.__optimistic} />
                    <DeleteConfirmationDialog project={project} disabled={project.__optimistic} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {serverProjects.data.length > 0 && (
        <TablePagination
          totalItems={serverProjects.totalItems}
          itemsPerPage={serverProjects.pageSize}
          className="mt-6 mb-8"
        />
      )}
    </>
  );
};

export default ProjectTable;
