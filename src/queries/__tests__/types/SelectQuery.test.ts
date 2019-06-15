import {assert, Has, IsExact} from "conditional-type-checks";
import {IntColumn, StringColumn} from "../../../columntypes";
import ColumnWrapper from "../../../ColumnWrapper";
import Database from "../../../Database";
import Table from "../../../Table";
import TableWrapper from "../../../TableWrapper";
import SelectQueryBuilder, {PickSelectorSpecFromColumnNames, SelectQueryReturn, SelectRowResult} from "../../SelectQueryBuilder";

test("PickSelectorSpecFromColumnNames", () => {
  class User extends Table {
    id = new IntColumn();
    name = new StringColumn();
  }

  type UserWrapper = TableWrapper<"users", User>;
  type MyRow = PickSelectorSpecFromColumnNames<UserWrapper, "id" | "name">;
  assert<IsExact<
    MyRow,
    {id: ColumnWrapper<"id", number>, name: ColumnWrapper<"name", string>}
  >>(true);
});

test("SelectRowResult has correct type", () => {
  class User extends Table {
    id = new IntColumn();
    name = new StringColumn();
  }
  type MyDb = Database<{users: User}>;
  assert<IsExact<
    SelectRowResult<{id: MyDb["users"]["id"]}>,
    {id: number}
  >>(true);
});

test("SelectQueryReturn has correct type for fetch one", () => {
  class User extends Table {
    id = new IntColumn();
    name = new StringColumn();
  }
  type MyDb = Database<{users: User}>;
  type MyQueryReturn = SelectQueryReturn<{
    id: MyDb["users"]["id"],
  }, true>;
  assert<Has<
    MyQueryReturn,
    {id: number} | null
  >>(true);
});

test("SelectQueryReturn has correct type for fetch many", () => {
  class User extends Table {
    id = new IntColumn();
    name = new StringColumn();
  }
  type MyDb = Database<{users: User}>;
  type MyQueryReturn = SelectQueryReturn<{
    id: MyDb["users"]["id"],
  }, false>;
  assert<Has<
    MyQueryReturn,
    Array<{id: number}>
    >>(true);
});

test("SelectQueryBuilder has correct SelectRowResult type", () => {
  class User extends Table {
    id = new IntColumn();
    name = new StringColumn();
  }
  type MyDb = Database<{users: User}>;
  type MyQueryOne = SelectQueryBuilder<MyDb, {id: MyDb["users"]["id"]}, true>;
  assert<IsExact<
    MyQueryOne["$promise"],
    Promise<{id: number} | null>
  >>(true);

  // Check for extraneous properties.
  assert<Has<
    MyQueryOne["$promise"],
    Promise<{name: string}>
  >>(false);

  type MyQueryMany = SelectQueryBuilder<MyDb, {id: MyDb["users"]["id"]}, false>;
  assert<IsExact<
    MyQueryMany["$promise"],
    Promise<Array<{id: number}>>
  >>(true);
});

test("SelectQueryBuilder for column names has correct SelectRowResult type", async () => {
  class User extends Table {
    id = new IntColumn();
    name = new StringColumn();
  }
  const db = Database(null as any, {users: new User});
  const myQuery = db.select(db.users, "id", "name");
  assert<IsExact<
      typeof myQuery,
      SelectQueryBuilder<typeof db, any, any>
  >>(true);
  type QueryType = typeof myQuery;

  assert<IsExact<
    QueryType["$promise"],
    Promise<Array<{id: number, name: string}>>
  >>(true);
});
