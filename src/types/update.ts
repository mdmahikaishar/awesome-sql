import { IOperation, TData } from "./awesomeSql";

export interface IUpdateArgs {
  /**
   * model = "posts"
   */
  model: string;
  /**
   * data = { "name": "name", "email": "email", "password": "password" }
   * ```sql
   * (`name`, `email`, `password`) VALUES ("name", "email", "password")
   * ```
   */
  data: TData;
  /**
   * where = { id: 1 }
   * ```sql
   * WHERE `posts`.id = 1
   * ```
   */
  where: TData;
}

export interface IAwesomeUpdate<T> extends IOperation<T> {
  args: IUpdateArgs;
}
