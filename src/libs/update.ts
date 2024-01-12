import { IAwesomeUpdate, IUpdateArgs } from "../types/update";
import { TDatabase } from "../types";
import AwesomeSelect from "./select";

export default class AwesomeUpdate<T> implements IAwesomeUpdate<T> {
  public model: string = "";
  public as: string = "";
  public statements: string[] = [];

  public constructor(
    public database: TDatabase,
    public args: IUpdateArgs,
    public logging?: boolean
  ) {
    const modelName = `\`${this.args.model}\``;
    this.model = `\`${this.database.name}\`.${modelName}`;
    this.as = modelName;
  }

  /**
   * ```sql
   * SET `{key}` = "{value}", `{key}` = "{value}"
   * ```
   */
  public generateSetData() {
    const data = this.args.data;
    const keyValueString = Object.keys(data)
      .map((key) => `\`${key}\` = \"${data[key]}\"`)
      .join(", ");

    this.statements.push(`SET ${keyValueString}`);
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
   * UPDATE {model} AS {as}
   * SET {column=value, }
   * WHERE {where}
   * ```
   */
  public generateStatement() {
    this.statements.push(`UPDATE ${this.model} AS ${this.as}`);
    this.generateSetData();
    this.generateWhere();
    return this.statements.join("\n");
  }

  public async exec(): Promise<T[]> {
    const statement = this.generateStatement();
    if (this.logging) console.log(statement);

    try {
      const [] = await this.database.connection.promise().query(statement);

      // const { affectedRows } = fields as any;
      // affectedRows: 1,
      // find it by where
      const select = new AwesomeSelect<T>(this.database, {
        model: this.args.model,
        where: this.args.where,
      });
      return await select.exec();
    } catch (error: any) {
      throw error;
    }
  }
}
