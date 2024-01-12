import { describe, test, expect } from "vitest";
import database from "../test-utils/database";
import data from "../test-utils/data";

type Result<T, T2 = {}> = {
  [K in keyof T]: T[K];
} & { [K2 in keyof T2]: T2[K2] } & {
  id: number;
  createdAt: string;
};

describe("Awesome Insert", async () => {
  const awesomeSql = await database.awesomeSql();
  let state = {
    dataUserIndex: 0,
    dataPostLenght: 3,
    userId: 0,
    firstPostId: 0,
    lastPostId: 0,
  };

  test("Insert a user", async () => {
    const user = data.users[state.dataUserIndex];
    const result = await awesomeSql.insert<Result<typeof user>>({
      model: "users",
      data: [user],
    });

    expect(result, "result must be a array").toBeInstanceOf(Array);
    expect(result[0].id, "contains a id").toBeDefined();
    expect(result[0].createdAt, "contains a createdAt").toBeDefined();
    expect(result[0].name, "expected name").toBe(user.name);
    expect(result[0].email, "expected email").toBe(user.email);
    expect(result[0].password, "expected password").toBe(user.password);

    state.userId = result[0].id;
  });

  test("Update the user", async () => {
    const user = data.users[state.dataUserIndex];
    const updatedUser = { password: "new password" };
    const result = await awesomeSql.update<Result<typeof user>>({
      model: "users",
      data: updatedUser,
      where: {
        id: state.userId,
      },
    });

    expect(result, "result must be a array").toBeInstanceOf(Array);
    expect(result[0].id, "contains a id").toBeDefined();
    expect(result[0].createdAt, "contains a createdAt").toBeDefined();
    expect(result[0].name, "expected name").toBe(user.name);
    expect(result[0].email, "expected email").toBe(user.email);
    expect(result[0].password, "expected password").toBe(updatedUser.password);
  });

  test("Insert many posts", async () => {
    const posts = data.posts.slice(0, state.dataPostLenght).map((post) => {
      post.userId = state.userId;
      return post;
    });
    const result = await awesomeSql.insert<Result<(typeof posts)[0]>>({
      model: "posts",
      data: posts,
    });

    expect(result, "result must be a array").toBeInstanceOf(Array);
    posts.forEach((post, index) => {
      expect(result[index].id, "contains a id").toBeDefined();
      expect(result[index].createdAt, "contains a createdAt").toBeDefined();
      expect(result[index].title, "expected title").toBe(post.title);
      expect(result[index].describtion, "expected describtion").toBe(
        post.describtion
      );
      expect(result[index].userId, "expected userId").toBe(post.userId);
    });

    state.firstPostId = result[0].id;
    state.lastPostId = result[result.length - 1].id;
  });

  test("Select a post", async () => {
    const post = data.posts[0];
    const result = await awesomeSql.select<Result<typeof post>>({
      model: "posts",
      where: {
        id: state.firstPostId,
      },
    });

    expect(result, "result must be a array").toBeInstanceOf(Array);
    expect(result[0].id, "contains a id").toBeDefined();
    expect(result[0].createdAt, "contains a createdAt").toBeDefined();
    expect(result[0].title, "expected title").toBe(post.title);
    expect(result[0].describtion, "expected describtion").toBe(
      post.describtion
    );
    expect(result[0].userId, "expected userId").toBe(state.userId);
  });

  test("Select many posts with user", async () => {
    const posts = data.posts.slice(0, state.dataPostLenght);
    const result = await awesomeSql.select<
      Result<(typeof data.posts)[0], { user: Result<(typeof data.users)[0]> }>
    >({
      model: "posts",
      columns: ["id", "title", "createdAt"],
      where: {
        userId: state.userId,
      },
      joins: [
        {
          model: "users",
          as: "user",
          columns: ["id", "name", "email"],
          on: { id: "userId" },
        },
      ],
    });

    expect(result, "result must be a array").toBeInstanceOf(Array);
    posts.forEach((post, index) => {
      const user = data.users[state.dataUserIndex];

      expect(result[index].id, "contains a id").toBeDefined();
      expect(result[index].createdAt, "contains a createdAt").toBeDefined();
      expect(result[index].title, "expected title").toBe(post.title);

      expect(result[index].user.id, "expected user id").toBe(state.userId);
      expect(result[index].user.name, "expected user name").toBe(user.name);
      expect(result[index].user.email, "expected user email").toBe(user.email);
    });
  });

  test("Delete a post", async () => {
    const post = data.posts[state.dataPostLenght - 1];
    const result = await awesomeSql.select<Result<typeof post>>({
      model: "posts",
      where: {
        id: state.lastPostId,
      },
    });

    expect(result, "result must be a array").toBeInstanceOf(Array);
    expect(result[0].id, "contains a id").toBeDefined();
    expect(result[0].createdAt, "contains a createdAt").toBeDefined();
    expect(result[0].title, "expected title").toBe(post.title);
    expect(result[0].describtion, "expected describtion").toBe(
      post.describtion
    );
    expect(result[0].userId, "expected userId").toBe(state.userId);
  });
});
