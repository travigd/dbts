import { IntColumn, StringColumn, Table, TableWrapper } from "@";

test("Table creation SQL is correct", () => {
  class User extends Table {
    id = new IntColumn();
    name = new StringColumn().nullable();
  }

  let tw = TableWrapper("users", new User());
  const sql = tw.$creationSQL();

  expect(sql).toContain("CREATE TABLE users");
  expect(sql).toContain("id int NOT NULL");
  expect(sql).toContain("name text");
});
