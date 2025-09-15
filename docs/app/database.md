# Database configuring locally

We are using prisma postgres locally. before we use cloud prisma postgres. but now it is locally!

## Architecture

- we run `make dev` which would spin up our
  - local nextjs server
  - prisma studio
  - local prisma postgres database

- we can view our database locally with `http://localhost:5555`

- we can normally execute db related commands with our makefile command. nothing really changed.

### Benefits

- now our local & production database will be different.
- and i belive local db interaction will be much faster.
