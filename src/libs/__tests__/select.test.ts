import { describe, test, expect } from "vitest";
import AwesomeSelect from "../select";
import database from "../../test-utils/database";

describe("Awesome Select", async () => {
  const connection = await database.connection();

  test("Select a post", async () => {
    const result = new AwesomeSelect(connection, {
      model: "posts",
      where: {
        id: 1,
      },
    }).generateStatement();

    expect(result, "expected query").toBe(
      [
        `SELECT \`posts\`.*`,
        `FROM \`my-awesome-sql\`.\`posts\` AS \`posts\``,
        `WHERE (\`posts\`.\`id\` = \"1\")`,
      ].join("\n")
    );
  });

  test("Select many posts", async () => {
    const result = new AwesomeSelect(connection, {
      model: "posts",
      columns: ["id", "title", "describtion"],
    }).generateStatement();

    expect(result, "expected query").toBe(
      [
        `SELECT ` +
          `\`posts\`.\`id\` AS \`id\`, \`posts\`.\`title\` AS \`title\`, \`posts\`.\`describtion\` AS \`describtion\``,
        `FROM \`my-awesome-sql\`.\`posts\` AS \`posts\``,
      ].join("\n")
    );
  });

  test("Select posts limit skip ", async () => {
    const result = new AwesomeSelect(connection, {
      model: "posts",
      columns: ["id", "title", "describtion"],
      where: {
        userId: 1,
      },
      orderBy: { columns: ["id"]},
      limit: 2,
      skip: 1,
    }).generateStatement();

    expect(result, "expected query").toBe(
      [
        `SELECT ` +
          `\`posts\`.\`id\` AS \`id\`, \`posts\`.\`title\` AS \`title\`, \`posts\`.\`describtion\` AS \`describtion\``,
        `FROM \`my-awesome-sql\`.\`posts\` AS \`posts\``,
        `WHERE (\`posts\`.\`userId\` = \"1\")`,
        `ORDER BY \`posts\`.\`id\` DESC`,
        `LIMIT 2`,
        `OFFSET 1`,
      ].join("\n")
    );
  });

  test("Select posts with left join user", async () => {
    const result = new AwesomeSelect(connection, {
      model: "posts",
      columns: ["id", "title", "describtion"],
      where: {
        userId: 1,
      },
      joins: [
        {
          type: "LEFT",
          model: "users",
          columns: ["id", "name", "email"],
          on: { id: "userId" },
        },
      ],
    }).generateStatement();

    expect(result, "expected query").toBe(
      [
        `SELECT ` +
          `\`posts\`.\`id\` AS \`id\`, \`posts\`.\`title\` AS \`title\`, \`posts\`.\`describtion\` AS \`describtion\`, ` +
          `\`users\`.\`id\` AS \`users.id\`, \`users\`.\`name\` AS \`users.name\`, \`users\`.\`email\` AS \`users.email\``,
        `FROM \`my-awesome-sql\`.\`posts\` AS \`posts\``,
        `LEFT JOIN \`my-awesome-sql\`.\`users\` AS \`users\``,
        `ON (\`users\`.\`id\` = \`posts\`.\`userId\`)`,
        `WHERE (\`posts\`.\`userId\` = \"1\")`,
      ].join("\n")
    );
  });
});
