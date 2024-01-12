import { describe, test, expect } from "vitest";
import AwesomeInsert from "../insert";
import database from "../../test-utils/database";
import data from "../../test-utils/data";

describe("Awesome Insert", async () => {
  const connection = await database.connection();

  test("Insert a user", async () => {
    const user = data.users[0];
    const result = new AwesomeInsert(connection, {
      model: "users",
      data: [user],
    }).generateStatement();

    expect(result, "expected query").toBe(
      [
        `INSERT INTO \`my-awesome-sql\`.\`users\``,
        `(\`name\`, \`email\`, \`password\`)`,
        `VALUES (\"${user.name}\", \"${user.email}\", \"${user.password}\")`,
      ].join("\n")
    );
  });

  test("Insert many posts", async () => {
    const posts = data.posts.slice(0, 2);
    const result = new AwesomeInsert(connection, {
      model: "posts",
      data: posts,
    }).generateStatement();

    expect(result, "expected query").toBe(
      [
        `INSERT INTO \`my-awesome-sql\`.\`posts\``,
        `(\`title\`, \`describtion\`, \`userId\`)`,
        `VALUES (\"${posts[0].title}\", \"${posts[0].describtion}\", \"${posts[0].userId}\"), ` +
          `(\"${posts[1].title}\", \"${posts[1].describtion}\", \"${posts[1].userId}\")`,
      ].join("\n")
    );
  });
});
