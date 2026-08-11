"use client";

import {
  Building2,
  FileText,
  FolderKanban,
  KeyRound,
  Loader2,
  PanelsTopLeft,
  Shield,
  ShieldCheck,
  ShieldOff,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getAllWorkspacePermissions } from "../actions/getAllWorkspacePermissions";
import { managePermissionStatusBatch } from "../actions/managePermissionStatus";

// Fixed resource metadata — these are the system resources permissions are
// generated for, so the section structure is deterministic.
const RESOURCE_META = {
  WORKSPACE: {
    label: "Workspace",
    icon: Building2,
    iconClass: "text-blue-600 bg-blue-50 dark:bg-blue-950/50",
  },
  PROJECT: {
    label: "Project",
    icon: FolderKanban,
    iconClass: "text-violet-600 bg-violet-50 dark:bg-violet-950/50",
  },
  SECTION: {
    label: "Section",
    icon: PanelsTopLeft,
    iconClass: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950/50",
  },
  PAGE: {
    label: "Page",
    icon: FileText,
    iconClass: "text-sky-600 bg-sky-50 dark:bg-sky-950/50",
  },
  USER: {
    label: "User",
    icon: Users,
    iconClass: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50",
  },
  ROLE: {
    label: "Role",
    icon: Shield,
    iconClass: "text-amber-600 bg-amber-50 dark:bg-amber-950/50",
  },
  PERMISSION: {
    label: "Permission",
    icon: KeyRound,
    iconClass: "text-purple-600 bg-purple-50 dark:bg-purple-950/50",
  },
};

const RESOURCE_ORDER = ["WORKSPACE", "PROJECT", "SECTION", "PAGE", "USER", "ROLE", "PERMISSION"];
const ACTION_ORDER = ["CREATE", "READ", "UPDATE", "DELETE"];

const ACTION_META = {
  CREATE: {
    label: "Create",
    badgeClass: "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400",
    description: "Create and add new items",
  },
  READ: {
    label: "Read",
    badgeClass: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
    description: "View and access existing items",
  },
  UPDATE: {
    label: "Update",
    badgeClass: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
    description: "Modify and edit existing items",
  },
  DELETE: {
    label: "Delete",
    badgeClass: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400",
    description: "Remove and delete items",
  },
};

export default function PermissionManage({
  isPermissionDialogOpen,
  setIsPermissionDialogOpen,
  workspaceId,
}) {
  // `permissions` holds the server-side truth; `draft` holds the checkbox state
  // the admin is editing. Toggling a checkbox only updates `draft` locally —
  // nothing is written to the database until "Confirm Permission" is clicked.
  const [permissions, setPermissions] = useState([]);
  const [draft, setDraft] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isPermissionDialogOpen || !workspaceId) return;

    async function fetchPermissions() {
      setIsLoading(true);
      const data = await getAllWorkspacePermissions(workspaceId);
      const list = data || [];
      setPermissions(list);
      setDraft(
        Object.fromEntries(
          list.map((permission) => [permission.id, permission.status === "ACTIVE"]),
        ),
      );
      setIsLoading(false);
    }
    fetchPermissions();
  }, [isPermissionDialogOpen, workspaceId]);

  const groups = useMemo(() => {
    const byResource = new Map();
    for (const permission of permissions) {
      const resource = permission.resource || "PERMISSION";
      if (!byResource.has(resource)) byResource.set(resource, []);
      byResource.get(resource).push(permission);
    }

    const ordered = RESOURCE_ORDER.filter((resource) => byResource.has(resource));
    const extras = [...byResource.keys()].filter((resource) => !RESOURCE_ORDER.includes(resource));

    return [...ordered, ...extras].map((resource) => ({
      resource,
      permissions: byResource
        .get(resource)
        .sort((a, b) => ACTION_ORDER.indexOf(a.action) - ACTION_ORDER.indexOf(b.action)),
    }));
  }, [permissions]);

  const { toActivate, toInactivate, changedCount } = useMemo(() => {
    const toActivate = [];
    const toInactivate = [];
    for (const permission of permissions) {
      const currentActive = permission.status === "ACTIVE";
      const desiredActive = draft[permission.id] ?? currentActive;
      if (desiredActive && !currentActive) toActivate.push(permission.id);
      else if (!desiredActive && currentActive) toInactivate.push(permission.id);
    }
    return { toActivate, toInactivate, changedCount: toActivate.length + toInactivate.length };
  }, [permissions, draft]);

  function togglePermission(id) {
    setDraft((prev) => ({ ...prev, [id]: !(prev[id] ?? false) }));
  }

  function toggleSection(resource) {
    const sectionPermissions =
      groups.find((group) => group.resource === resource)?.permissions ?? [];
    if (sectionPermissions.length === 0) return;

    const allChecked = sectionPermissions.every((permission) => draft[permission.id]);
    setDraft((prev) => {
      const next = { ...prev };
      for (const permission of sectionPermissions) next[permission.id] = !allChecked;
      return next;
    });
  }

  async function applyBatch(ids, status) {
    const response = await managePermissionStatusBatch(workspaceId, ids, status);
    if (!response.success) {
      throw new Error(response.errors?._form?.[0] || "Failed to update permissions");
    }
    return response;
  }

  async function handleConfirm() {
    if (changedCount === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (toActivate.length > 0) await applyBatch(toActivate, "ACTIVE");
      if (toInactivate.length > 0) await applyBatch(toInactivate, "INACTIVE");

      toast.success(
        changedCount === 1 ? "1 permission updated" : `${changedCount} permissions updated`,
      );
      // Sync server state with the confirmed draft so the UI reflects reality.
      setPermissions((prev) =>
        prev.map((permission) => ({
          ...permission,
          status: draft[permission.id] ? "ACTIVE" : "INACTIVE",
        })),
      );
      setIsPermissionDialogOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to update permissions");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handlePermitFullPermission() {
    if (permissions.length === 0) return;

    // Toggle: if everything is granted, revoke all; otherwise grant all.
    // Changes stay in the draft until "Confirm Permission" is clicked.
    const allChecked = permissions.every((permission) => draft[permission.id]);
    setDraft((prev) => Object.fromEntries(Object.keys(prev).map((id) => [id, !allChecked])));
  }

  const allGranted =
    permissions.length > 0 && permissions.every((permission) => draft[permission.id]);

  const busy = isLoading || isSubmitting;

  return (
    <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
      <DialogContent className="sm:max-w-[760px]">
        <DialogHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <DialogTitle>Workspace Permissions</DialogTitle>
            <DialogDescription>
              Tick the permissions to grant, untick to revoke, then confirm your changes.
            </DialogDescription>
          </div>
          <Button
            variant="green"
            size="sm"
            onClick={handlePermitFullPermission}
            disabled={busy || permissions.length === 0}
            className="shrink-0 self-start sm:mr-10"
          >
            {allGranted ? <ShieldOff className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
            {allGranted ? "Revoke All" : "Permit Full Permission"}
          </Button>
        </DialogHeader>

        <div className="max-h-[55vh] space-y-6 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Fetching permissions...</span>
            </div>
          ) : groups.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No permissions found for this workspace.
            </div>
          ) : (
            groups.map((group) => (
              <PermissionSection
                key={group.resource}
                group={group}
                draft={draft}
                onTogglePermission={togglePermission}
                onToggleSection={toggleSection}
              />
            ))
          )}
        </div>

        <DialogFooter className="items-center gap-3 sm:justify-between">
          <p className="text-sm">
            {changedCount > 0 ? (
              <span className="font-medium text-yellow-700 dark:text-yellow-500">
                {changedCount} pending change{changedCount > 1 ? "s" : ""}
              </span>
            ) : (
              <span className="text-muted-foreground">No pending changes</span>
            )}
          </p>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => setIsPermissionDialogOpen(false)}
                disabled={busy}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleConfirm} disabled={changedCount === 0 || busy}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
              Confirm Permission
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PermissionSection({ group, draft, onTogglePermission, onToggleSection }) {
  const meta = RESOURCE_META[group.resource] ?? {
    label: group.resource,
    icon: KeyRound,
    iconClass: "text-muted-foreground bg-muted",
  };
  const Icon = meta.icon;

  const allChecked = group.permissions.every((permission) => draft[permission.id]);
  const someChecked = group.permissions.some((permission) => draft[permission.id]);
  const grantedCount = group.permissions.filter((permission) => draft[permission.id]).length;

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <header className="flex items-center justify-between gap-3 border-b bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.iconClass}`}
          >
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-base font-semibold leading-tight">{meta.label} Permissions</h3>
            <p className="text-xs text-muted-foreground">
              {grantedCount}/{group.permissions.length} granted
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label
            htmlFor={`select-all-${group.resource}`}
            className="cursor-pointer text-xs text-muted-foreground"
          >
            Select all
          </Label>
          <Checkbox
            id={`select-all-${group.resource}`}
            checked={allChecked}
            indeterminate={someChecked && !allChecked}
            onCheckedChange={() => onToggleSection(group.resource)}
          />
        </div>
      </header>

      <ul className="divide-y">
        {group.permissions.map((permission) => {
          const actionMeta = ACTION_META[permission.action] ?? {
            label: permission.action,
            badgeClass: "bg-muted text-muted-foreground",
            description: "",
          };
          const resourceLabel = meta.label;
          const checked = draft[permission.id];

          return (
            <li key={permission.id}>
              <Label
                htmlFor={`permission-${permission.id}`}
                className="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3 font-normal leading-none transition-colors hover:bg-accent/50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`w-16 shrink-0 rounded-md px-1.5 py-1 text-center text-xs font-semibold uppercase tracking-wide ${actionMeta.badgeClass}`}
                  >
                    {actionMeta.label}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {actionMeta.label} {resourceLabel}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {permission.description || actionMeta.description}
                    </p>
                  </div>
                </div>
                <Checkbox
                  id={`permission-${permission.id}`}
                  checked={checked}
                  onCheckedChange={() => onTogglePermission(permission.id)}
                />
              </Label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
