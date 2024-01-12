import { IAwesomeQuery } from "../types/query";
import { TDatabase } from "../types";
import dottie from "dottie";

export default class AwesomeQuery<T> implements IAwesomeQuery<T> {
  public model: string = "";
  public as: string = "";
  public statements: string[] = [];

  public constructor(
    public database: TDatabase,
    query: string,
    public logging?: boolean
  ) {
    this.statements.push(query);
  }

  public generateStatement() {
    return this.statements.join("\n");
  }

  public async exec(): Promise<T[]> {
    const statement = this.generateStatement();
    if (this.logging) console.log(statement);

    try {
      const [rows, fields] = await this.database.connection
        .promise()
        .query(statement);
      return Array.isArray(rows)
        ? (rows.map((row) => dottie.transform(row)) as T[])
        : [];
    } catch (error: any) {
      throw error;
    }
  }
}
