import mysql from "mysql2";
import {
  AwesomeDelete,
  AwesomeInsert,
  AwesomeQuery,
  AwesomeSelect,
  AwesomeUpdate,
} from "./libs";
import {
  IDeleteArgs,
  IInsertArgs,
  ISelectArgs,
  IUpdateArgs,
  TConnectionOptions,
  TDatabase,
} from "./types";

export default class AwesomeSql {
  private static instance?: AwesomeSql;
  private constructor(private database: TDatabase, private logging?: boolean) {}
  static async getInstance(options: TConnectionOptions): Promise<AwesomeSql> {
    if (!this.instance) {
      const connection = mysql.createPool(options);
      const database = { name: options.database, connection };
      this.instance = new AwesomeSql(database, false);
    }

    return this.instance;
  }

  public getConnection() {
    return this.database.connection;
  }

  public async insert<T>(args: IInsertArgs): Promise<T[]> {
    const awesomeInsert = new AwesomeInsert<T>(
      this.database,
      args,
      this.logging
    );
    return await awesomeInsert.exec();
  }
  public async update<T>(args: IUpdateArgs): Promise<T[]> {
    const awesomeUpdate = new AwesomeUpdate<T>(
      this.database,
      args,
      this.logging
    );
    return await awesomeUpdate.exec();
  }
  public async delete<T>(args: IDeleteArgs): Promise<T[]> {
    const awesomeDelete = new AwesomeDelete<T>(
      this.database,
      args,
      this.logging
    );
    return await awesomeDelete.exec();
  }
  public async select<T>(args: ISelectArgs): Promise<T[]> {
    const awesomeSelect = new AwesomeSelect<T>(
      this.database,
      args,
      this.logging
    );
    return await awesomeSelect.exec();
  }
  public async query<T>(args: string): Promise<T[]> {
    const awesomeQuery = new AwesomeQuery<T>(this.database, args, this.logging);
    return await awesomeQuery.exec();
  }
}
