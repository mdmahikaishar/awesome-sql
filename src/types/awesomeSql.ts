import { Pool, PoolOptions } from "mysql2";

export type TDataTypes = string | number | boolean;
export type TData = Record<string, TDataTypes>;

export interface TConnectionOptions extends PoolOptions {
  database: string;
}

export type TDatabase = {
  name: string;
  connection: Pool;
};

export interface IOperation<T> {
  as: string;
  model: string;
  statements: string[];
  /**
   * log query
   */
  logging?: boolean;

  generateStatement(): string;
  exec(): Promise<T[]>;
}
