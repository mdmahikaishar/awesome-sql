import { describe, test, expect } from "vitest";
import AwesomeUpdate from "../update";
import database from "../../test-utils/database";
import data from "../../test-utils/data";

describe("Awesome Update", async () => {
  const connection = await database.connection();

  test("Update a user", async () => {
    const user = data.users[0];
    const updateUser = { name: "updated name", password: "updated pass" };
    const result = new AwesomeUpdate(connection, {
      model: "users",
      data: updateUser,
      where: {
        name: user.name,
      },
    }).generateStatement();

    const resultone = [
      `UPDATE \`my-awesome-sql\`.\`users\` AS \`users\``,
      `SET \`name\` = \"${updateUser.name}\", \`password\` = \"${updateUser.password}\"`,
      `WHERE (\`users\`.\`name\` = \"name\")`,
    ].join("\n");

    expect(result, "expected query").toBe(resultone);
  });
});
