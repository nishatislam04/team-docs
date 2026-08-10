"use client";
import { useState } from "react";
import NoWorkspaceUI from "./components/NoWorkspaceUI";
import WorkspaceListings from "./components/WorkspaceListings";

export default function WorkspaceShell({ hasWorkspaces }) {
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [startFetchWorkspaces, setStartFetchWorkspaces] = useState(hasWorkspaces ? true : false);

  return (
    <>
      {hasWorkspaces ? (
        <WorkspaceListings
          hasWorkspaces={hasWorkspaces}
          permissionDialogOpen={permissionDialogOpen}
          setIsPermissionDialogOpen={setPermissionDialogOpen}
          startFetchWorkspaces={startFetchWorkspaces}
          setStartFetchWorkspaces={setStartFetchWorkspaces}
        />
      ) : (
        <NoWorkspaceUI setIsDialogOpen={() => {}} />
      )}
    </>
  );
}
