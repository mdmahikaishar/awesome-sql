import { IAwesomeInsert, IInsertArgs } from "../types/insert";
import { TDatabase } from "../types";
import AwesomeSelect from "./select";

export default class AwesomeInsert<T> implements IAwesomeInsert<T> {
  public model: string = "";
  public as: string = "";
  public statements: string[] = [];

  public constructor(
    public database: TDatabase,
    public args: IInsertArgs,
    public logging?: boolean
  ) {
    const modelName = `\`${this.args.model}\``;
    this.model = `\`${this.database.name}\`.${modelName}`;
    this.as = modelName;
  }

  /**
   * ```sql
   * (`name`, `email`, `password`)
   * ```
   */
  public getColumns(): string {
    const keys = Object.keys(this.args.data[0]);
    const columnsString = keys.map((key) => `\`${key}\``).join(", ");
    return `(${columnsString})`;
  }

  /**
   * ```sql
   * ("name1", "email2", "password3")
   * ```
   */
  public generateValues() {
    const keys = Object.keys(this.args.data[0]);
    const values = this.args.data
      .map((data) => {
        const valuesString = keys
          .map((key) => `\"${data[key]}\"`)
          .join(", ");
        return `(${valuesString})`;
      })
      .join(", ");

    this.statements.push(`VALUES ${values}`);
  }

  /**
   * ```sql
   * INSERT INTO {model}
   * {columns}
   * VALUES {values}
   * ```
   */
  public generateStatement() {
    this.statements.push(`INSERT INTO ${this.model}`);
    this.statements.push(this.getColumns());
    this.generateValues();
    return this.statements.join("\n");
  }

  public async exec(): Promise<T[]> {
    const statement = this.generateStatement();
    if (this.logging) console.log(statement);

    try {
      const [fields] = await this.database.connection
        .promise()
        .query(statement);

      const { affectedRows, insertId } = fields as any;
      if (!insertId) return [];

      //  affectedRows: 2, insertId: 6,
      // // 1st insertId = 4 + 0 = 4
      // // 2nd insertId = 4 + 1 = 5
      let rows: T[] = [];
      for (let i = 0; i < affectedRows; i++) {
        const select = new AwesomeSelect<T>(this.database, {
          model: this.args.model,
          where: {
            id: insertId + i,
          },
        });
        const result = await select.exec();
        rows = [...rows, ...result];
      }

      return rows;
    } catch (error: any) {
      throw error;
    }
  }
}
