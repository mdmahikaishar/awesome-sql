import AwesomeSql from "..";

const awesomeSql = async () => {
  return await AwesomeSql.getInstance({
    host: process.env.DATABASE_HOST || "127.0.0.1",
    port: parseInt(process.env.DATABASE_PORT || "3306"),
    user: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || "2023",
    database: process.env.DATABASE_NAME || "my-awesome-sql",
  });
};

const connection = async () => ({
  name: process.env.DATABASE_NAME || "my-awesome-sql",
  connection: (await awesomeSql()).getConnection(),
});

export default { awesomeSql, connection };
