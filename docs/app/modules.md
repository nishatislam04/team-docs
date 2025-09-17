# Here i am going to show you how the data-flow for an module

## Project Module

### page.jsx (parent, server component)

This is the parent component. where we will create promises & pass it down to client component. we will also resolve search-params here.

- There may be multiple authorization checks. so we resolve it here like this

```js
await Promise.all([requireWorkspaceActive(), canViewProjectsAuth()]);
```

This way this both promise will execute parallly & if one fails, the whole promise will fail anyway

- we will invoke all the promise here that will be used in the client component. like this

```js
const params = await searchParams;
const hasProjectsPromise = getHasProjects();
const projectPromise = getAllProjectsFn({
  page: Number(params.page) || 1,
  pageSize: Number(params.pageSize) || 10,
  sortBy: params.sortBy || "name",
  sortOrder: params.sortOrder || "asc",
});
```

- we will pass it down to client component like this

```js
return (
  <Suspense fallback={<ProjectsLoading />}>
    <ProjectListings hasProjectsPromise={hasProjectsPromise} projectPromise={projectPromise} />
  </Suspense>
);
```

### ProjectListings.jsx (child, client component)

- Client component will receive these promises & resolve them. like this

```js
const { hasProjects, projects } = await Promise.all([hasProjectsPromise, projectPromise]);
```

- we will lazy load not necessary components. like this

```js
const ProjectListingsLazy = dynamic(() => import("./components/ProjectListings"), {
  ssr: false,
});
```

- we will resolve the promises as later as possible. so that only small part of the ui may show loading state

### table.jsx (child, client component)

- so we will have a new table component.
- but this table component will have a parent component. so that we can show no data found ui.
- for reference, check `projects` component directory

### helper hooks

- we will have a helper hooks that will perform updating url as we interact with table. like `useProjects`
