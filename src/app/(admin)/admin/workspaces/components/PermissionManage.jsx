import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllWorkspacePermissions } from "../actions/getAllWorkspacePermissions";
import { managePermissionStatus } from "../actions/managePermissionStatus";

export default function PermissionManage({
  isPermissionDialogOpen,
  setIsPermissionDialogOpen,
  workspaceId,
}) {
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchPermissions() {
      setIsLoading(true);
      const permissions = await getAllWorkspacePermissions(workspaceId);
      setPermissions(permissions);
      setIsLoading(false);
    }
    fetchPermissions();
  }, [workspaceId]);

  function handleInactive(id) {
    async function inactivePermission() {
      const response = await managePermissionStatus(id, "INACTIVE");
      if (response.success) {
        toast.success(response.message);

        // ! need to refactor this duplicate code
        setIsLoading(true);
        const permissions = await getAllWorkspacePermissions(workspaceId);
        setPermissions(permissions);
        setIsLoading(false);
      } else {
        toast.error(response.message);
      }
    }
    inactivePermission();
  }

  function handleActive(id) {
    async function activePermission() {
      const response = await managePermissionStatus(id, "ACTIVE");
      if (response.success) {
        toast.success(response.message);

        // ! need to refactor this duplicate code
        setIsLoading(true);
        const permissions = await getAllWorkspacePermissions(workspaceId);
        setPermissions(permissions);
        setIsLoading(false);
      } else {
        toast.error(response.message);
      }
    }
    activePermission();
  }

  return (
    <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Workspace Permission</DialogTitle>
          <DialogDescription>Manage workspace permissions here.</DialogDescription>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px] font-bold">Permission Name</TableHead>
              <TableHead className="w-[100px] font-bold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="h-24 text-center flex justify-center items-center"
                >
                  <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Fetching Permissions...</span>
                </TableCell>
              </TableRow>
            ) : (
              permissions?.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="font-medium w-[200px]">{permission.name}</TableCell>
                  <TableCell className="w-[100px]">
                    {permission.status === "ACTIVE" ? (
                      <Button variant="destructive" onClick={() => handleInactive(permission.id)}>
                        Inactive
                      </Button>
                    ) : (
                      <Button variant="green" onClick={() => handleActive(permission.id)}>
                        Active
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => setIsPermissionDialogOpen(false)}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
