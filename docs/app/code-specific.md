# code specific

## layer issues

- [] `model layer` should NOT exist on `actions layer`. here is the dataflow

- [] actions > services > models. `service layer` re-throw erorrs which will be caught in `actions layer`.

## For Form

1. data from form will go to action layer.
2. action layer perform authorization and validate the data & early return if anything goes wrong.
3. then action layer will call service layer and pass data.
4. service layer will call model layer and perform database mutation.
5. model layer interact with database
   **service layer conatins some common works. but it can also directly call model layer. but we should not call model layer directly**

## For Client Component

in same directory, we create an actions directory.
export an async function from there.
then on the parent server component. we go like this

```js
import { getWorkspaceFn } from "./_components/actions/getWorkspace";

const workspace = getWorkspaceFn();
<Suspense fallback={<Loading />}>
  <ChildComponent workspace={workspace} />;
</Suspense>;
```

we suspense the last children who will consume the promise. not the immediate children like above.
then in child component we go like this

```js
export default function ChildComponent({ workspace }) {
  const workspace = use(workspace);
}
```
