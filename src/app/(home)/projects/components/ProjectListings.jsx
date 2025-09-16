"use client";

import DrawerLoading from "@/components/loading/DrawerLoading";
import PaginationLoading from "@/components/loading/PaginationLoading";
import TableLoading from "@/components/loading/TableLoading";
import CreateButtonShared from "@/components/shared/CreateButtonShared";
import SortIcon from "@/components/shared/SortIcon";
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
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useProjects } from "../hooks/useProjects";
import { useProjectDrawerStore } from "../store/useProjectDrawerStore";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

const ProjectEditDrawerLazy = dynamic(() => import("./ProjectEditDrawer"), {
  ssr: false,
  loading: () => <DrawerLoading />,
});

const TablePaginationLazy = dynamic(() => import("@/components/shared/TablePagination"), {
  ssr: false,
  loading: () => <PaginationLoading />,
});

// ! so we can pass full projects from server component & consume the promise in this child component. its working just fine
// ! the thing is the pagination does not works yet

export default function ProjectListings({
  hasProjects,
  startFetchProjects,
  setStartFetchProjects,
  projects,
}) {
  const router = useRouter();
  const { setIsDrawerOpen } = useProjectDrawerStore();
  const {
    // data: projects,
    totalItems,
    pageSize,
    sortBy,
    sortOrder,
    handleSort,
    showSkeleton,
  } = useProjects(startFetchProjects, setStartFetchProjects);

  // State for editing project
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setIsEditDrawerOpen(true);
  };

  return (
    <section className="space-y-8">
      {/* Create Button */}
      <section className="flex max-h-14 w-full items-start justify-between border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Your Projects</h1>
        <div className="ml-auto">
          <CreateButtonShared onClick={() => setIsDrawerOpen(true)}>
            Create project
          </CreateButtonShared>
        </div>
      </section>

      {/* Project Edit Drawer */}
      {selectedProject && (
        <ProjectEditDrawerLazy
          isDrawerOpen={isEditDrawerOpen}
          setIsDrawerOpen={setIsEditDrawerOpen}
          setStartFetchProjects={setStartFetchProjects}
          project={selectedProject}
        />
      )}

      {/* Project Listings */}
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
              {/* If no roles exist */}
              {!hasProjects ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-muted-foreground py-10 text-center text-lg"
                  >
                    No projects found.
                  </TableCell>
                </TableRow>
              ) : showSkeleton || projects.data.length === 0 ? (
                /* If still loading */
                <TableLoading columns={3} />
              ) : (
                /* If roles are loaded */
                projects.data.map((project) => (
                  <TableRow
                    key={project.id}
                    className="hover:bg-muted transition-colors duration-200"
                  >
                    {/* Your table cells content */}
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
                        onClick={() => handleEditClick(project)}
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
                      <DeleteConfirmationDialog
                        project={project}
                        setStartFetchProjects={setStartFetchProjects}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Pagination */}
      {hasProjects && !showSkeleton && projects.data.length > 0 && (
        <TablePaginationLazy
          totalItems={projects.totalItems}
          itemsPerPage={projects.pageSize}
          className="mt-6 mb-8"
        />
      )}
    </section>
  );
}
