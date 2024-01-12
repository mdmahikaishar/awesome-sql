export interface IQueryArgs {}

export interface IAwesomeQuery<T> {
  exec(): Promise<T[]>;
}
