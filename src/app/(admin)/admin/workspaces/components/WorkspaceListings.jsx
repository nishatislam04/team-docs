import TableLoading from "@/components/loading/TableLoading";
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
import { Pencil } from "lucide-react";
import { useWorkspaces } from "../hooks/useWorkspaces";
import ClientErrorUI from "@/components/abstracts/clientErrorUI";
import TablePagination from "@/components/shared/TablePagination";
import DeleteWorkspace from "./DeleteWorkspace";
import PermissionManage from "./PermissionManage";
import { useState } from "react";

export default function WorkspaceListings({
  hasWorkspaces,
  permissionDialogOpen,
  setIsPermissionDialogOpen,
  startFetchWorkspaces,
  setStartFetchWorkspaces,
  startFetchPermissions,
  setStartFetchPermissions,
}) {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
  const {
    data: workspaces,
    totalItems,
    pageSize,
    sortBy,
    sortOrder,
    handleSort,
    showSkeleton,
    fetchError,
  } = useWorkspaces(startFetchWorkspaces, setStartFetchWorkspaces);

  if (fetchError)
    return <ClientErrorUI errorMessage={fetchError} retry={setStartFetchWorkspaces} />;

  return (
    <>
      {permissionDialogOpen && (
        <PermissionManage
          isPermissionDialogOpen={permissionDialogOpen}
          setIsPermissionDialogOpen={setIsPermissionDialogOpen}
          workspaceId={selectedWorkspaceId}
        />
      )}
      <section className="flex justify-between items-start mb-8 w-full max-h-14 mt-4 ml-2">
        <h1 className="text-3xl font-bold">Workspaces</h1>
      </section>
      <div className="overflow-auto relative rounded-2xl border shadow-lg bg-background">
        <Table className="overflow-scroll">
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow className="text-lg font-semibold tracking-wide">
              <TableHead
                className="w-[160px] px-6 py-4 cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Workspace Name
                  <SortIcon columnName="name" sortBy={sortBy} sortOrder={sortOrder} />
                </div>
              </TableHead>
              <TableHead className="w-[160px] px-6 py-4 cursor-pointer hover:bg-muted/80 transition-colors">
                <div className="flex items-center">
                  Owner Username
                  <SortIcon columnName="scope" sortBy={sortBy} sortOrder={sortOrder} />
                </div>
              </TableHead>
              <TableHead className="w-[320px] text-center px-6 py-4">Permission</TableHead>
              <TableHead className="w-[320px] text-center px-6 py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!hasWorkspaces ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-lg text-center text-muted-foreground">
                  No Workspaces found.
                </TableCell>
              </TableRow>
            ) : showSkeleton || workspaces.length === 0 ? (
              <TableLoading />
            ) : (
              workspaces.map((workspace) => (
                <TableRow
                  key={workspace.id}
                  className="transition-colors duration-200 hover:bg-muted"
                >
                  <TableCell className="px-6 py-5 text-base font-semibold">
                    {workspace.name}
                  </TableCell>

                  <TableCell className="px-6 py-5 text-base font-semibold">
                    {workspace.owner.username}
                  </TableCell>

                  <TableCell className="px-6 py-5 text-base font-semibold">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setSelectedWorkspaceId(workspace.id);
                        setIsPermissionDialogOpen(true);
                      }}
                      className="text-yellow-700 bg-yellow-50 hover:text-yellow-500 hover:bg-yellow-100 border border-yellow-200 py-2.5 text-base cursor-pointer flex justify-center items-center mx-auto"
                    >
                      <Pencil className="mr-2 w-5 h-5 text-yellow-600" />
                      Permission
                    </Button>
                  </TableCell>

                  <TableCell className="flex gap-3 justify-center items-center px-6 py-5">
                    <DeleteWorkspace
                      workspace={workspace}
                      setStartFetchWorkspaces={setStartFetchWorkspaces}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {hasWorkspaces && !showSkeleton && workspaces.length > 0 && (
          <TablePagination totalItems={totalItems} itemsPerPage={pageSize} className="mb-8" />
        )}
      </div>
    </>
  );
}
