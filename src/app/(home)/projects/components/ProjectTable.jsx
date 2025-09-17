import SortIcon from "@/components/shared/SortIcon";
import TablePagination from "@/components/shared/TablePagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, LayoutTemplate, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useProjects } from "../hooks/useProjects";
import { useProjectDrawerStore } from "../store/useProjectDrawerStore";
import { useSelectedProjectStore } from "../store/useSelectedProjectStore";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

const ProjectTable = ({ projectsPromise }) => {
  const router = useRouter();
  const projects = use(projectsPromise);
  const { sortBy, sortOrder, handleSort } = useProjects();

  return (
    <>
      <section className="mt-8 space-y-4">
        <div className="bg-background relative overflow-auto rounded-2xl border shadow-lg">
          <Table className="overflow-scroll">
            <TableHeader className="bg-muted sticky top-0 z-10">
              <TableRow className="text-lg font-semibold tracking-wide">
                <TableHead
                  className="hover:bg-muted/80 w-[160px] cursor-pointer px-6 py-4 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Name
                    <SortIcon columnName="name" sortBy={sortBy} sortOrder={sortOrder} />
                  </div>
                </TableHead>
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex cursor-pointer items-center gap-1"
                      onClick={() => {
                        router.push(`/projects/${project.slug}/editor`);
                        router.refresh();
                      }}
                    >
                      <LayoutTemplate className="h-4 w-4" /> View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex cursor-pointer items-center gap-1 bg-yellow-100"
                      onClick={() => {
                        useProjectDrawerStore.getState().setIsEditDrawerOpen(true);
                        useSelectedProjectStore.getState().setSelectedProject(project);
                      }}
                    >
                      <Edit className="h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex cursor-pointer items-center gap-1 bg-green-100"
                      onClick={() => {
                        router.push(`/projects/${project.slug}/assign-dev`);
                      }}
                    >
                      <UsersRound className="h-4 w-4" /> Assign Dev
                    </Button>
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
