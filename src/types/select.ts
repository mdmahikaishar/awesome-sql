import { IOperation, TData } from "./awesomeSql";

export interface ISelectJoin {
  /**
   * type = "LEFT"
   * ```sql
   * LEFT JOIN
   * ```
   */
  type?: "LEFT" | "RIGHT" | "CROSS" | "SELF";
  /**
   * model = "users"
   */
  model: string;
  /**
   * as = "author"
   * ```sql
   * `db`.`users` AS `author`
   * ```
   */
  as?: string;
  /**
   * columns = ["name", "email", "password"]
   * ```sql
   * `name`, `email`, `password`
   * ```
   */
  columns?: string[];
  /**
   * on = { id: "userId" } // { joinTableKey: mainTableKey }
   * ```sql
   * ON `users`.`id` = `posts`.`userId`
   * ```
   */
  on?: Record<string, string>;
}

export interface ISelectArgs {
  /**
   * model = "posts"
   */
  model: string;
  /**
   * as = "article"
   * ```sql
   * `db`.`posts` AS `article`
   * ```
   */
  as?: string;
  /**
   * columns = ["name", "email", "password"]
   * ```sql
   * `name`, `email`, `password`
   * ```
   */
  columns?: string[];
  /**
   * where = { id: 1 }
   * ```sql
   * WHERE `posts`.`id` = 1
   * ```
   */
  where?: TData;
  /**
   * skip = 5
   * ```sql
   * OFSET 5
   * ```
   */
  skip?: number;
  /**
   * limit = 5
   * ```sql
   * LIMIT 5
   * ```
   */
  limit?: number;
  /**
   * orderBy = { type: "ASC", columns: ["id"] }
   * ```sql
   * ORDER BY `posts`.`id` ASEC
   * ```
   */
  orderBy?: {
    type?: "ASC" | "DESC",
    columns: string[]
  };
  joins?: ISelectJoin[];
}

export interface IAwesomeSelect<T> extends IOperation<T> {
  args: ISelectArgs;
}
