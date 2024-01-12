import { IAwesomeDelete, IDeleteArgs } from "../types/delete";
import { TDatabase } from "../types";
import AwesomeSelect from "./select";

export default class AwesomeDelete<T> implements IAwesomeDelete<T> {
  public model: string = "";
  public as: string = "";
  public statements: string[] = [];

  public constructor(
    public database: TDatabase,
    public args: IDeleteArgs,
    public logging?: boolean
  ) {
    const modelName = `\`${this.args.model}\``;
    this.model = `\`${this.database.name}\`.${modelName}`;
    this.as = modelName;
  }

  /**
   * ```sql
   * WHERE (`posts`.`userId` = "1")
   * ```
   */
  public generateWhere() {
    if (!this.args.where) return;

    const whereString = Object.keys(this.args.where)
      .map((key) => `${this.as}.\`${key}\` = \"${this.args.where![key]}\"`)
      .join(" AND ");

    this.statements.push(`WHERE (${whereString})`);
  }

  /**
   * ```sql
   * DELETE FROM {model} AS {as}
   * WHERE {where}
   * ```
   */
  public generateStatement() {
    this.statements.push(`DELETE FROM ${this.model} AS ${this.as}`);
    this.generateWhere();
    return this.statements.join("\n");
  }

  public async exec(): Promise<T[]> {
    const statement = this.generateStatement();
    if (this.logging) console.log(statement);

    try {
      const select = new AwesomeSelect<T>(this.database, {
        model: this.args.model,
        where: this.args.where,
      });
      const rows = await select.exec();

      const [] = await this.database.connection.promise().query(statement);

      return rows;
    } catch (error: any) {
      throw error;
    }
  }
}
