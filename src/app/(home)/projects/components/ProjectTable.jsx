import TablePagination from "@/components/shared/TablePagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { use } from "react";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import ProjectAssignButton from "./sub/ProjectAssignButton";
import ProjectEditButton from "./sub/ProjectEditButton";
import ProjectTableSort from "./sub/ProjectTableSort";
import ProjectViewButton from "./sub/ProjectViewButton";

const ProjectTable = ({ projectsPromise }) => {
  const projects = use(projectsPromise);

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
              {projects.data.map((project) => (
                <TableRow
                  key={project.id}
                  className="hover:bg-muted transition-colors duration-200"
                >
                  <TableCell className="px-6 py-5 text-base font-semibold">
                    {project.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate overflow-hidden px-6 py-5 text-base whitespace-nowrap">
                    {project.description || (
                      <span className="text-sm text-gray-400 italic">No description</span>
                    )}
                  </TableCell>

                  <TableCell className="flex items-center justify-center gap-3 px-6 py-5">
                    <ProjectViewButton project={project} />
                    <ProjectEditButton project={project} />
                    <ProjectAssignButton project={project} />
                    <DeleteConfirmationDialog project={project} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {projects.data.length > 0 && (
        <TablePagination
          totalItems={projects.totalItems}
          itemsPerPage={projects.pageSize}
          className="mt-6 mb-8"
        />
      )}
    </>
  );
};

export default ProjectTable;
