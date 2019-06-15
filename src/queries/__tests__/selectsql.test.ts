import {IntColumn, StringColumn} from "../../columntypes";
import Table from "../../Table";
import TableWrapper from "../../TableWrapper";
import Database from "../../Database";

test("SelectQuery with spec object", () => {
  class User extends Table {
    id = new IntColumn();
    name = new StringColumn().nullable();
  }

  // Use null b/c we don't actually us Postgres here
  const db = Database(null as any, {users: new User});
  const sql = db
    .selectOne({
      id: db.users.id,
      name: db.users.name,
    })
    .from(db.users)
    .$SQL();

  expect(sql).toContain("SELECT ");
  expect(sql).toContain(" FROM users ");
  expect(sql).toContain(" id ");
  expect(sql).toContain(" name ");
  expect(sql).toContain(" LIMIT 1");
});

test("SelectQuery with column names", () => {
  class User extends Table {
    id = new IntColumn();
    name = new StringColumn().nullable();
  }

  // Use null b/c we don't actually us Postgres here
  const db = Database(null as any, {users: new User});
  const query = db
    .select(db.users, "id", "name")
    .from(db.users);
  const sql = query.$SQL();

  expect(sql).toContain("SELECT ");
  expect(sql).toContain(" FROM users");
  expect(sql).toEqual(expect.stringMatching(/ id[ ,]/));
  expect(sql).toEqual(expect.stringMatching(/ name[ ,]/));
});

test("SelectQuery without manual .from()", () => {
  class User extends Table {
    id = new IntColumn();
    name = new StringColumn().nullable();
  }

  const db = Database(null as any, {users: new User});
  const query = db.select(db.users, "id", "name");
  const sql = query.$SQL();

  expect(sql).toContain("SELECT ");
  expect(sql).toContain(" FROM users");
  expect(sql).toEqual(expect.stringMatching(/ id[ ,]/));
  expect(sql).toEqual(expect.stringMatching(/ name[ ,]/));
});
