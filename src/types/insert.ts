import { IOperation, TData } from "./awesomeSql";

export interface IInsertArgs {
  /**
   * model = "posts"
   */
  model: string;
  /**
   * data = [{ "name": "name", "email": "email", "password": "password" }]
   * ```sql
   * (`name`, `email`, `password`) VALUES ("name", "email", "password")
   * ```
   */
  data: TData[];
}

export interface IAwesomeInsert<T> extends IOperation<T> {
  args: IInsertArgs;
}