# My Awesome Sql

A light weight awesome sql sdk with promises and typescript.

<br />
<br />

## Getting Started

To tnstall `AwesomeSql` in your project.

```bash
pnpm install awesome-sql
```

<br />

## Examples

### Create Connection

Create a connection with your database.

```ts
// database.ts
import awesomeSql from "awesome-sql";

export const sql = await awesomeSql.getInstance({
  host: "127.0.0.1",
  port: 3306,
  database: "awesome-sql",
  user: "root",
  password: "2023",
});
```

<br />

### Select

Selecting is the amazing fact of `AwesomeSql`.

#### Select a single data

```ts
import { sql } from "./database";

await sql.select({
  model: "posts",
  columns: ["id", "title", "createdAt"],
  where: {
    id: 1,
  },
});
```

#### Join tables

Unbelivealbe things of `awesomeSql` with awesome joining.

```ts
import { sql } from "./database";

await sql.select({
  model: "posts",
  columns: ["id", "title", "createdAt"],
  where: {
    id: 1,
  },
  joins: [
    {
      model: "users",
      as: "user",
      columns: ["name", "email"],
      on: { id: "userId" },
    },
  ],
});
```

<br />

### Insert

Inserting on `awesomeSql` is so easy.

#### Insert single data

```ts
import { sql } from "./database";

await sql.insert({
  model: "users",
  data: [{ name: "mahi", email: "mahi@gamil.com", password: "mahi" }],
});
```

#### Insert multiple data

```ts
import { sql } from "./database";

await sql.insert({
  model: "users",
  data: [
    { name: "mahi", email: "mahi@gamil.com", password: "mahi" },
    { name: "koishor", email: "koishor@gamil.com", password: "koishor" },
  ],
});
```

<br />

### Update

Update a data existing data

```ts
import { sql } from "./database";

await sql.update({
  model: "users",
  data: { name: "name updated" },
  where: {
    name: "mahi",
  },
});
```

<br />

### Delete

Delete a data with the easiest way

```ts
import { sql } from "./database";

await sql.delete({
  model: "users",
  where: {
    name: "name updated",
  },
});
```

<br />

## Inspiration

We get the inspiration of this project from Mongoose, Sequlize. There are an awesome ORM. They have a tungs of features to manupulate data.
