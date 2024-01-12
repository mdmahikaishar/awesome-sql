import { IAwesomeSelect, ISelectArgs, ISelectJoin } from "../types/select";
import { TDatabase } from "../types";
import dottie from "dottie";

export default class AwesomeSelect<T> implements IAwesomeSelect<T> {
  public model: string = "";
  public as: string = "";
  public statements: string[] = [];

  public constructor(
    public database: TDatabase,
    public args: ISelectArgs,
    public logging?: boolean
  ) {
    const modelName = `\`${this.args.model}\``;
    this.model = `\`${this.database.name}\`.${modelName}`;
    this.as = this.args.as ? `\`${this.args.as}\`` : modelName;
    this.args.columns = this.args.columns || ["*"];

    this.args.joins?.map((join) => {
      const joinName = `\`${join.model}\``;
      join.model = `\`${this.database.name}\`.${joinName}`;
      join.as = join.as ? `\`${join.as}\`` : joinName;

      join.type = join.type || "LEFT";
      join.columns = join.columns || [];

      return join;
    });
  }

  /**
   * ```sql
   * # without as
   * `post`.`name` AS `name`, `post`.`img` AS `img`
   *
   * # with as
   * `post`.`name` AS `post.name`, `post`.`img` AS `post.img`
   * ```
   */
  private selectColumnsAs(keys: string[], model: string, as?: string): string {
    const asName = as ? `${as}.` : "";

    return keys
      .map((key) => {
        if (key === "*") {
          return `${model}.*`;
        }
        return `${model}.\`${key}\` AS \`${asName + key}\``;
      })
      .join(", ");
  }

  /**
   * ```sql
   * `post`.`name` AS `name`, `post`.`img` AS `post.img`
   * ```
   */
  public getColumns(): string {
    const columns = [this.selectColumnsAs(this.args.columns!, this.as)];

    this.args.joins?.forEach((join) => {
      if (!join.columns) return;

      const columnsString = this.selectColumnsAs(
        join.columns!,
        join.as!,
        join.as!.replace(/\`/g, "")
      );
      columns.push(columnsString);
    });

    return columns.join(", ");
  }

  /**
   * ```sql
   * LEFT JOIN {model} AS {model.as}
   * ON {on}
   * ```
   */
  public generateJoinInsert() {
    if (!this.args.joins) return;

    this.args.joins.forEach((join) => {
      this.statements.push(`${join.type} JOIN ${join.model} AS ${join.as}`);

      if (join.on) {
        this.statements.push(`ON (${this.getJoinOn(join)})`);
      }
    });
  }

  /**
   * ```sql
   * ON `users`.`id` = `posts`.`userId
   * ```
   */
  private getJoinOn(join: ISelectJoin): string {
    return Object.keys(join.on!)
      .map((key) => `${join.as}.\`${key}\` = ${this.as}.\`${join.on![key]}\``)
      .join(" AND ");
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
   * LIMIT 5
   * ```
   */
  public generateLimit() {
    if (!this.args.limit) return;

    this.statements.push(`LIMIT ${this.args.limit}`);
  }

  /**
   * ```sql
   * OFFSET 5
   * ```
   */
  public generateSkip() {
    if (!this.args.skip) return;

    this.statements.push(`OFFSET ${this.args.skip}`);
  }

  /**
   * ```sql
   * ORDER BY `posts`.`createdAt` DESC
   * ```
   */
  public generateOrderBy() {
    if (!this.args.orderBy) return;

    const orderType = this.args.orderBy.type || "DESC";
    const orderBy = this.args.orderBy.columns
      .map((column) => `${this.as}.\`${column}\``)
      .join(", ");

    this.statements.push(`ORDER BY ${orderBy} ${orderType}`);
  }

  /**
   * ```sql
   * SELECT {cols} FROM {{model} AS {as}}
   * LEFT JOIN {join} as {join.as}
   * ON {}
   * WHERE {}
   * ORDER BY {}
   * LIMIT {}
   * OFFSET {}
   * ```
   */
  public generateStatement() {
    this.statements.push(`SELECT ${this.getColumns()}`);
    this.statements.push(`FROM ${this.model} AS ${this.as}`);
    this.generateJoinInsert();
    this.generateWhere();
    this.generateOrderBy();
    this.generateLimit();
    this.generateSkip();

    return this.statements.join("\n");
  }

  public async exec(): Promise<T[]> {
    const statement = this.generateStatement();
    if (this.logging) console.log(statement);

    try {
      const [rows] = await this.database.connection.promise().query(statement);
      return Array.isArray(rows)
        ? (rows.map((row) => dottie.transform(row)) as T[])
        : [];
    } catch (error: any) {
      throw error;
    }
  }
}
