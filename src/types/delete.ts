import { IOperation, TData } from "./awesomeSql";

export interface IDeleteArgs {
  /**
   * model = "posts"
   */
  model: string;
  /**
   * where = { id: 1 }
   * ```sql
   * WHERE `posts`.id = 1
   * ```
   */
  where: TData;
}

export interface IAwesomeDelete<T> extends IOperation<T> {
  args: IDeleteArgs;
}