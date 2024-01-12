import { describe, test, expect } from "vitest";
import AwesomeDelete from "../delete";
import database from "../../test-utils/database";
import data from "../../test-utils/data";

describe("Awesome Delete", async () => {
  const connection = await database.connection();

  test("Delete a user", async () => {
    const user = data.users[0];
    const result = new AwesomeDelete(connection, {
      model: "users",
      where: {
        name: user.name,
      },
    }).generateStatement();

    expect(result, "expected query").toBe(
      [
        `DELETE FROM \`my-awesome-sql\`.\`users\` AS \`users\``,
        `WHERE (\`users\`.\`name\` = \"${user.name}\")`,
      ].join("\n")
    );
  });
});
