# Optimistic Project Creation (Step-by-Step)

This doc explains how project creation uses React optimistic updates in our Next.js v15 App Router app, and how you can reuse the same pattern for other resources (edit, delete).

- Server interactions stay out of components.
- A reusable form hook (`useServerFormAction`) drives the flow.
- A colocated Zustand store renders the table from a local list so optimistic items appear immediately.

Referenced files:

- Hook: `src/hooks/useServerFormAction.js`
- Store: `src/app/(home)/projects/store/useProjectsStore.js`
- Drawer (create form): `src/app/(home)/projects/components/ProjectCreateDrawer.jsx`
- Table (list): `src/app/(home)/projects/components/ProjectTable.jsx`

---

## 1) Reusable form hook with optimistic lifecycle

`useServerFormAction` now accepts two optional options:

- `onStart(formData)`: non-optimistic pre-submit (e.g., close drawer)
- `optimistic`: lifecycle with 3 callbacks
  - `start(formData) -> context`: insert optimistic item and return context (e.g., `{ tempId }`)
  - `commit(context, serverData)`: reconcile optimistic item with server result
  - `revert(context, errorResult)`: undo optimistic changes on failure

The hook handles the flow and error mapping for you:

```
submit
  → onStart(formData)
  → optimistic.start(formData) -> context
  → actionFn(formData) // server action
    • failure → set field errors → optimistic.revert(context)
    • success → optimistic.commit(context) → toast → reset → onSuccess
```

Implementation (simplified):

```js
// src/hooks/useServerFormAction.js (excerpt)
const onSubmit = handleSubmit(async (formData) => {
  fireOnStart(formData);
  const optimisticContext = await runOptimisticStart(formData);

  const result = await actionFn(formData);

  if (result?.success === false) {
    applyServerErrors(result);
    await runOptimisticRevert(optimisticContext, result);
    return;
  }

  if (result?.type === "success") {
    await runOptimisticCommit(optimisticContext, result.data);
    handleSuccess(result);
  }
});
```

Internal helpers keep complexity low and the behavior clear:

- `fireOnStart`, `runOptimisticStart`, `applyServerErrors`, `runOptimisticRevert`, `runOptimisticCommit`, `handleSuccess`

---

## 2) Colocated Zustand store for projects

We colocate a store under the route to manage the project list and optimistic items.

File: `src/app/(home)/projects/store/useProjectsStore.js`

Key API:

- `setProjects(list)`: seed/replace from server data
- `addOptimistic({ name, slug, description }) -> tempProject`: inserts an item with `id: "temp-..."` and `__optimistic: true`
- `commitOptimistic(tempId, realProject)`: replaces temp with server project and unsets `__optimistic`
- `revertOptimistic(tempId)`: removes temp item on failure
- `upsert(project)`: helper for non-optimistic inserts/updates

Notes:

- Uses `crypto.randomUUID()` (fallback to `Math.random()`), no extra deps.
- When operating imperatively (inside lifecycle callbacks), use `useProjectsStore.getState()` to avoid unnecessary re-renders.

---

## 3) Wire the Create Drawer to the optimistic lifecycle

File: `src/app/(home)/projects/components/ProjectCreateDrawer.jsx`

We pass `onStart` and `optimistic` to `useServerFormAction`:

```js
const form = useServerFormAction({
  schema: ProjectSchema,
  actionFn: createProjectAction,
  defaultValues,
  onStart: () => {
    // Close drawer immediately for optimistic UX
    setIsCreateDrawerClose();
  },
  onSuccess: () => {
    form.reset();
    // Drawer already closed in onStart
  },
  optimistic: {
    start: (formData) => {
      const { addOptimistic } = useProjectsStore.getState();
      const temp = addOptimistic({
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
      });
      return { tempId: temp.id };
    },
    commit: (ctx, serverData) => {
      const { commitOptimistic } = useProjectsStore.getState();
      commitOptimistic(ctx.tempId, serverData);
    },
    revert: (ctx) => {
      const { revertOptimistic } = useProjectsStore.getState();
      revertOptimistic(ctx.tempId);
      setIsCreateDrawerOpen(true); // reopen to let user fix inputs
    },
  },
  successToast: {
    title: "Project created successfully",
    description: "Your new project is ready to use!",
  },
});
```

---

## 4) Render the table from the store and show optimistic state

File: `src/app/(home)/projects/components/ProjectTable.jsx`

- Resolve the server promise
- Seed the store with server data on mount/update
- Render rows from the store so optimistic items appear immediately
- Disable actions on optimistic rows and show a subtle badge

```js
const serverProjects = use(projectsPromise);
const { setProjects } = useProjectsStore();
const projects = useProjectsStore((s) => s.projects);

useEffect(() => {
  if (serverProjects?.data) setProjects(serverProjects.data);
}, [serverProjects, setProjects]);

<TableBody>
  {projects.map((project) => (
    <TableRow /* key etc. */>
      <TableCell>
        <div className="flex items-center gap-2">
          <span>{project.name}</span>
          {project.__optimistic && (
            <Badge className="inline-flex h-5 items-center gap-1 rounded-full border border-amber-200 bg-amber-100 px-2 py-0 text-[10px] text-amber-700">
              <Loader2 className="h-3 w-3 animate-spin" />
              Creating
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>{/* ... */}</TableCell>
    </TableRow>
  ))}
</TableBody>;
```

Pagination continues to use `serverProjects` values so counts remain authoritative.

---

## End-to-end flow (Create)

1. User submits the form.
2. `onStart` closes the drawer immediately.
3. `optimistic.start` inserts a temporary project into the store.
4. Server action runs in the background.
5. Success → `optimistic.commit` replaces temp with server result → show toast → reset.
6. Failure → field errors set → `optimistic.revert` removes temp → reopen the drawer.

---

## Reusing for other resources

Create a colocated store per resource with the same trio of helpers and render its list/table from that store.

- Store API to implement:
  - `set<ResourcePlural>(list)`
  - `addOptimistic(partial) -> tempItem`
  - `commitOptimistic(tempId, realItem)`
  - `revertOptimistic(tempId)`
  - Optional: `upsert`, `updateOptimistic`, `restore`

- Wire the resource drawer/dialog/page with:

  ```js
  useServerFormAction({
    schema,
    actionFn,
    defaultValues,
    onStart,
    onSuccess,
    optimistic: { start, commit, revert },
  });
  ```

- Seed the store in the list/table component with server data (promise result) and render from the store.

---

## Adapting for Edit

Two common options:

- **In-place optimistic patch** (recommended)
  - `optimistic.start(formData)`: capture snapshot of the current item and patch optimistic fields in-place
    - return `{ id, prev: oldItem }`
  - `optimistic.commit(ctx, serverData)`: finalize with server data
  - `optimistic.revert(ctx)`: restore from `ctx.prev`
  - Store helpers you may need: `updateOptimistic(id, partial)`, `restore(id, prev)`

- **Temporary shadow item**
  - Rarely needed for edits; in-place patch is simpler UX.

UI tips:

- Show a subtle badge: “Updating” with a spinner
- Disable row actions while updating

---

## Adapting for Delete

- `optimistic.start({ id })`: remove the item from the store immediately (or mark as deleting)
  - return `{ id, prev }` if you want revert capability
- `optimistic.commit(ctx)`: nothing (item is already gone)
- `optimistic.revert(ctx)`: reinsert `ctx.prev` into the store if server fails

UI tips:

- Disable actions while deleting
- Optionally lower opacity or show a small “Deleting…” badge

---

## Pitfalls & Tips

- **Render source**: The list must render from the store, not directly from the server response, or you won’t see the optimistic item.
- **Unique keys**: Optimistic items use `temp-...` ids. For extra safety, use a fallback like `id || slug || name` + index when rendering.
- **Avoid re-renders**: Use `useStore.getState()` for imperative changes inside optimistic callbacks. In UI, select slices: `useStore((s) => s.slice)`.
- **Server errors**: Always surface field-level errors via the hook’s `applyServerErrors` path.
- **Team rules**: Client comps only where needed; keep server actions out of components; colocate store near the route; Tailwind + Shadcn.

---

## Quick checklist when adding a new optimistic flow

- [ ] Add a colocated Zustand store with `addOptimistic`, `commitOptimistic`, `revertOptimistic`
- [ ] Render the list from the store and seed it from the server promise
- [ ] Pass `onStart` and `optimistic` callbacks to `useServerFormAction`
- [ ] Show subtle UI indicators (badge/spinner) and disable actions for optimistic items
- [ ] Handle errors: field messages + revert + reopen the editing surface (if applicable)

---

## Example: Minimal optimistic wiring

```js
// In your drawer/dialog
useServerFormAction({
  schema,
  actionFn,
  defaultValues,
  onStart: () => ui.close(),
  onSuccess: () => form.reset(),
  optimistic: {
    start: (data) => {
      const { addOptimistic } = useMyResourceStore.getState();
      const temp = addOptimistic(data);
      return { tempId: temp.id };
    },
    commit: (ctx, serverItem) => {
      const { commitOptimistic } = useMyResourceStore.getState();
      commitOptimistic(ctx.tempId, serverItem);
    },
    revert: (ctx) => {
      const { revertOptimistic } = useMyResourceStore.getState();
      revertOptimistic(ctx.tempId);
      ui.reopen();
    },
  },
});
```

That’s it. This pattern is repeatable for create, edit, and delete across resources while keeping components thin and interactions predictable.
