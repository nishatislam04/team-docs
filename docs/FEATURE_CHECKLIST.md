# need to fix [code-quality]

- [] assigdev need heavy-editing

- [] to trigger fetch, we will use zustand store instead of using react state

- [] heavy client components will be dynamic import with `ssr: false` which may or may not render. for example create, edit dialog

- [] normal client components will be dynamic import without `ssr`. like table or listings component

- [] code split with `next/dynamic ssr: false` for create, edit, delete component AND listings component without `ssr: false`

- [] next/cache common components like loading component

- [x] need to explore nextjs docs next.config.js section & update my section accordingly

- [] instead of awaiting in server component. we will pass the data via props to client component. and then use `use()` hook to resolve the promise. which would be more performant. because, server wont wait for the data.

- [] we will use react optimistic for super admin > workspace > permissions > management

- [] after creating first project, ui does not refresh automatically. so, we dont see the project in the list.

- [] there is some issue unlocking permission create submit button. even when there is enough data. probably need to update `useServerFormAction` hook

- [] role table, permission assign is not working

- [] user create, status make it 'ACTIVE' by default. right now 'inactive'
- [] user create, does not show form error message
- [] user status need to updated from user table

- [] on dev assign, right side drop down, if there are no permission, show appropriate message
  -- [] add right side drop down label saying, its project permission
  -- [] on delete, show meaningful message. like it will only remove the records but not remove them

- [] section, we can not create section
- [] page, we can not create page
- [] updating page, re order the file listings. make it appropriate
  -- [] make sure, section & page are listed properly

- [] update all form inputs to follow shadcn docs guide
  -- [] check shadcn docs guide how to properly integrate form inputs for [React-Hook-Form]

## feature workflow

### super admin to workspace permissions

(1) after approving a workspace, all related permissions auto generated!!
(2) then on super admin panel, we will have a workspace route. which will held necessary actions for a workspace.
(3) we will have a permissions button for each workspace. clicking on it, will render all the permissions for the workspace
(4) we can activate/deactivate permissions here!

### workspace to member permissions

(1) on permissions page, we will have a button saying, generate default permissions
(2) clicking on it, will generate default permissions for the workspace to be applied to members
(3) we can assign some or one permissions to a role
(4) then we will assign the role to a member

### build optimize

`first load js` refer to if the user directly load the page.

- but lets say user navigate from / to /users then only 18kb will be downloaded as 18kb is this route size
- `first load js` include `First Load JS shared by all` + `size`
- `first load js` should be 200kb-25kb
